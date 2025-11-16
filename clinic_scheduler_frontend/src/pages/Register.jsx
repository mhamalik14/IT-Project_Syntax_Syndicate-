import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import jwt_decode from 'jwt-decode';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient", // default
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password confirmation
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", formData);
      // Backend now returns token, store it and decode role
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        const decoded = jwt_decode(response.data.access_token);
        const role = decoded.role;
        switch (role) {
          case "patient":
            navigate("/patient/dashboard");
            break;
          case "staff":
            navigate("/staff/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        // Fallback if no token (shouldn't happen now)
        switch (formData.role) {
          case "patient":
            navigate("/patient/dashboard");
            break;
          case "staff":
            navigate("/staff/dashboard");
            break;
          case "admin":
            navigate("/admin/dashboard");
            break;
          default:
            navigate("/");
        }
      }
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirm_password || ""}
            onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="patient">Patient</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit">Register</button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
