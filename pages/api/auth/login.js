import { sanitizeEmail, sanitizePassword } from "../../../utils/sanitize";

import fs from 'fs';
import path from 'path';

// In-memory rate limiter: { ip: { count, resetAt } }
const rateLimitStore = new Map();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds

// Hard-locked data path for system stability
const USERS_DATA_PATH = 'C:\\Users\\ALI MURTAZA\\Desktop\\BudgetWise\\budgetwise\\data\\users.json';


function getRateLimit(ip) {
  const now = Date.now();
  let record = rateLimitStore.get(ip);

  if (!record || now > record.resetAt) {
    record = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
    rateLimitStore.set(ip, record);
  }
  return record;
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed." });
  }

  // Rate limiting
  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
  const limit = getRateLimit(ip);
  limit.count++;

  if (limit.count > RATE_LIMIT_MAX) {
    const retryAfterSec = Math.ceil((limit.resetAt - Date.now()) / 1000);
    return res.status(429).json({
      success: false,
      message: `Too many attempts. Please wait ${retryAfterSec} seconds.`,
      retryAfter: retryAfterSec,
    });
  }

  const { email, password } = req.body || {};

  // Server-side validation
  const emailResult = sanitizeEmail(email);
  if (!emailResult.valid) {
    return res.status(400).json({ success: false, message: emailResult.message });
  }

  const passwordResult = sanitizePassword(password);
  if (!passwordResult.valid) {
    return res.status(400).json({ success: false, message: passwordResult.message });
  }

  // Read users from persistent store
  let users = [];
  try {
    users = JSON.parse(fs.readFileSync(USERS_DATA_PATH, 'utf8'));
  } catch (err) {
    console.error("Failed to read user data store:", err);
    return res.status(500).json({ success: false, message: "Authentication service unavailable." });
  }

  // Find user
  const user = users.find(
    (u) => u.email === emailResult.value && u.password === passwordResult.value
  );

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password." });
  }

  // Generate a simple mock session token
  const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

  // Reset rate limit on success
  rateLimitStore.delete(ip);

  return res.status(200).json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
