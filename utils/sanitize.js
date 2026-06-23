/**
 * Input sanitization utilities — used on both client and server.
 * Keeps validation logic DRY and consistent across login/register flows.
 */

/**
 * Sanitizes an email address.
 * @param {string} value
 * @returns {{ valid: boolean, value: string, message: string }}
 */
export function sanitizeEmail(value) {
  if (typeof value !== "string") return { valid: false, value: "", message: "Invalid input." };
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return { valid: false, value: trimmed, message: "Email is required." };
  // RFC-5321 simplified check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(trimmed)) return { valid: false, value: trimmed, message: "Enter a valid email address." };
  return { valid: true, value: trimmed, message: "" };
}

/**
 * Sanitizes a password.
 * @param {string} value
 * @returns {{ valid: boolean, value: string, message: string, strength: number }}
 */
export function sanitizePassword(value) {
  if (typeof value !== "string") return { valid: false, value: "", message: "Invalid input.", strength: 0 };
  const trimmed = value; // Do NOT trim passwords — spaces are valid characters
  if (!trimmed) return { valid: false, value: trimmed, message: "Password is required.", strength: 0 };
  if (trimmed.length < 8) return { valid: false, value: trimmed, message: "Password must be at least 8 characters.", strength: 1 };

  // Strength calculation
  let strength = 1;
  if (trimmed.length >= 12) strength++;
  if (/[A-Z]/.test(trimmed)) strength++;
  if (/[0-9]/.test(trimmed)) strength++;
  if (/[^A-Za-z0-9]/.test(trimmed)) strength++;

  return { valid: true, value: trimmed, message: "", strength: Math.min(strength, 4) };
}

/**
 * Sanitizes a full name.
 * @param {string} value
 * @returns {{ valid: boolean, value: string, message: string }}
 */
export function sanitizeName(value) {
  if (typeof value !== "string") return { valid: false, value: "", message: "Invalid input." };
  const trimmed = value.trim();
  if (!trimmed) return { valid: false, value: trimmed, message: "Full name is required." };
  if (trimmed.length < 2) return { valid: false, value: trimmed, message: "Name must be at least 2 characters." };
  if (trimmed.length > 80) return { valid: false, value: trimmed, message: "Name must be under 80 characters." };
  return { valid: true, value: trimmed, message: "" };
}
