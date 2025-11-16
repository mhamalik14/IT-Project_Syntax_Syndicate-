import jwt_decode from "jwt-decode";

export function getCurrentUser() {
  // 1️⃣ If updated profile exists in localStorage, use that first
  const stored = localStorage.getItem("user");
  if (stored) return JSON.parse(stored);

  // 2️⃣ Otherwise fallback to token decode
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwt_decode(token);
    return {
      id: decoded.sub,      // Backend user ID
      email: decoded.email,
      role: decoded.role,
      exp: decoded.exp,
      raw: decoded
    };
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

// Alias for backward compatibility
export const getUserFromToken = getCurrentUser;
