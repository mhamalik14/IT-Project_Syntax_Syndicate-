import { Link, useNavigate, Outlet, NavLink } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <>
      <nav className="navbar" aria-label="Main navigation">
        <h2>Que-Quick Reserve</h2>
        <div>
          <NavLink to="/" className={({ isActive }) => isActive ? "active-link" : ""}>Home</NavLink>
          {token ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              {role === "admin" && <NavLink to="/admin">Admin Panel</NavLink>}
              {role === "staff" && <NavLink to="/provider">Provider View</NavLink>}
              {role === "patient" && <NavLink to="/profile">My Profile</NavLink>}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}
