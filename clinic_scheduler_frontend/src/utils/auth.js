import jwt_decode from "jwt-decode";

export function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwt_decode(token);
    // Normalize to a consistent shape
    return {
      id: decoded.sub,      // The user ID from FastAPI
      email: decoded.email,
      role: decoded.role,
      exp: decoded.exp,
      raw: decoded           // Keep full decoded data if needed
    };
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

// Alias for backward compatibility
export const getUserFromToken = getCurrentUser;
