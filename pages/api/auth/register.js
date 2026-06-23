import fs from 'fs';
import path from 'path';
import { sanitizeEmail, sanitizePassword, sanitizeName } from "../../../utils/sanitize";

// Hard-locked data path for system stability
const USERS_DATA_PATH = 'C:\\Users\\ALI MURTAZA\\Desktop\\BudgetWise\\budgetwise\\data\\users.json';

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed." });
  }

  const { name, email, password, confirmPassword } = req.body || {};

  // Validate all fields
  const nameResult = sanitizeName(name);
  if (!nameResult.valid) return res.status(400).json({ success: false, message: nameResult.message });

  const emailResult = sanitizeEmail(email);
  if (!emailResult.valid) return res.status(400).json({ success: false, message: emailResult.message });

  const passwordResult = sanitizePassword(password);
  if (!passwordResult.valid) return res.status(400).json({ success: false, message: passwordResult.message });

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match." });
  }

  // Read current users
  let users = [];
  try {
    users = JSON.parse(fs.readFileSync(USERS_DATA_PATH, 'utf8'));
  } catch (err) {
    console.error("Failed to read user data store:", err);
    return res.status(500).json({ success: false, message: "Registration service unavailable." });
  }

  // Check if email already registered
  if (users.find(u => u.email === emailResult.value)) {
    return res.status(409).json({ success: false, message: "An account with this email already exists." });
  }

  // Register the user
  const userId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = {
    id: userId,
    name: nameResult.value,
    email: emailResult.value,
    password: passwordResult.value, // In prod: hash with bcrypt
    preferences: JSON.stringify({
      profile: { avatarUrl: "https://ui-avatars.com/api/?name=" + encodeURIComponent(nameResult.value) },
      notifications: { email: true, push: false, reports: true },
      security: { twoFactor: false, loginAlerts: true },
      privacy: { dataSharing: false, publicProfile: false }
    })
  };

  users.push(newUser);

  // Persist to disk
  try {
    fs.writeFileSync(USERS_DATA_PATH, JSON.stringify(users, null, 4), 'utf8');
  } catch (err) {
    console.error("Failed to save new user:", err);
    return res.status(500).json({ success: false, message: "Failed to persist account data." });
  }


  const token = Buffer.from(`${userId}:${Date.now()}`).toString("base64");

  return res.status(201).json({
    success: true,
    token,
    user: {
      id: userId,
      name: nameResult.value,
      email: emailResult.value,
      role: "user",
    },
  });
}
