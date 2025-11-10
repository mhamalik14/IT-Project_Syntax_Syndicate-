import { Link, useNavigate } from "react-router-dom";
import { getUserFromToken } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUserFromToken();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/dashboard";
    switch (user.role) {
      case "patient":
        return "/patient/dashboard";
      case "staff":
        return "/staff/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/dashboard";
    }
  };

  return (
    <nav className="navbar">
      <h2>Que-Quick Reserve</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        {user ? (
          <>
            <Link to={getDashboardLink()}>Dashboard</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
