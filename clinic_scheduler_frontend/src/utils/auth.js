import * as jwt_decode from "jwt-decode";

export function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwt_decode.default(token);
    return decoded;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

// Alias export for backward compatibility
export const getUserFromToken = getCurrentUser;
