import jwt_decode from "jwt-decode";

export function getCurrentUser() {
  // 1️⃣ Use stored profile first (after update_profile)
  const stored = localStorage.getItem("user");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem("user");
    }
  }

  // 2️⃣ Use JWT token
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwt_decode(token);

    return {
      id: decoded.user_id,     // ✅ FIXED
      name: decoded.name || "",
      email: decoded.email || "",
      role: decoded.role || "patient",
      exp: decoded.exp,
      raw: decoded
    };

  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

// Alias
export const getUserFromToken = getCurrentUser;
