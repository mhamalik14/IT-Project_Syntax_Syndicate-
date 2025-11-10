import React, { useEffect, useState } from "react";
import api from "../api/api";
import { getCurrentUser } from "../utils/auth";
import { Link } from "react-router-dom";

const PatientInfoForm = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
    date_of_birth: user.date_of_birth || "",
    address: user.address || "",
    emergency_contact: user.emergency_contact || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put("/auth/profile", formData);
      onUpdate(response.data);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="purpose-section">
      <h3 className="section-title">📋 Patient Information</h3>
      <p className="purpose-text">
        Please provide your personal information to help us serve you better.
      </p>
      <form onSubmit={handleSubmit} className="form-container" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date_of_birth"
          placeholder="Date of Birth"
          value={formData.date_of_birth}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="emergency_contact"
          placeholder="Emergency Contact"
          value={formData.emergency_contact}
          onChange={handleChange}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default function PatientDashboard() {
  const user = getCurrentUser(); // get JWT-decoded user
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      fetchAppointments();
    } else {
      console.warn("User not loaded or missing ID");
      setLoading(false);
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      // ✅ No query params, backend gets user ID from JWT
      const res = await api.get("/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-10 text-gray-700">
        Please log in to access your dashboard.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading your appointments...
      </div>
    );
  }

  // Calculate quick stats
  const totalAppointments = appointments.length;
  const upcomingAppointments = appointments.filter(a => a.status !== "Completed").length;
  const completedAppointments = appointments.filter(a => a.status === "Completed").length;

  // Separate appointments
  const upcoming = appointments.filter(a => a.status !== "Completed");
  const past = appointments.filter(a => a.status === "Completed");

  return (
    <div className="container">
      {/* Welcome Message */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">👋 Welcome, {user.name || "Patient"}!</h1>
          <p className="hero-description">
            Here’s your personalized dashboard — manage your upcoming appointments, view your booking history, and stay connected with your healthcare providers all in one place.
          </p>
        </div>
      </div>

      {/* Member Info */}
      <div className="purpose-section">
        <h3 className="section-title">Member Info</h3>
        <div className="text-center">
          <p><strong>Patient Name:</strong> {user.name || "Not provided"}</p>
          <p><strong>Last Login:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
          <p><strong>Member Since:</strong> March 2024</p>
          <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
          <p><strong>Date of Birth:</strong> {user.date_of_birth || "Not provided"}</p>
          <p><strong>Address:</strong> {user.address || "Not provided"}</p>
          <p><strong>Emergency Contact:</strong> {user.emergency_contact || "Not provided"}</p>
        </div>
      </div>

      {/* Patient Information Form */}
      <PatientInfoForm user={user} onUpdate={(updatedUser) => {
        // Update local user state if needed
        console.log("Profile updated:", updatedUser);
      }} />

      {/* Quick Stats */}
      <div className="services-section">
        <h3 className="section-title">Quick Stats</h3>
        <div className="service-cards">
          <div className="service-card">
            <div className="service-icon">📊</div>
            <h4 className="service-title">Total Appointments</h4>
            <p className="text-center text-2xl font-bold">{totalAppointments}</p>
          </div>
          <div className="service-card">
            <div className="service-icon">⏰</div>
            <h4 className="service-title">Upcoming</h4>
            <p className="text-center text-2xl font-bold">{upcomingAppointments}</p>
          </div>
          <div className="service-card">
            <div className="service-icon">✅</div>
            <h4 className="service-title">Completed</h4>
            <p className="text-center text-2xl font-bold">{completedAppointments}</p>
          </div>
        </div>
      </div>

      {/* Book New Appointment */}
      <div className="cta-section">
        <h3 className="section-title">➡️ Book New Appointment</h3>
        <p className="cta-text">
          (Click the button above to book a new appointment quickly and easily.)
        </p>
        <Link to="/book" className="cta-button">Book New Appointment</Link>
      </div>

      {/* Upcoming Appointments */}
      <div className="purpose-section">
        <h3 className="section-title">📅 Your Upcoming Appointments</h3>
        <p className="purpose-text">
          View and manage your upcoming visits. You can reschedule or cancel directly from here.
        </p>
        {upcoming.length === 0 ? (
          <p className="text-center text-gray-500">No upcoming appointments.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Time</th>
                <th className="border border-gray-300 p-2">Clinic</th>
                <th className="border border-gray-300 p-2">Doctor</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((a) => (
                <tr key={a._id || a.id}>
                  <td className="border border-gray-300 p-2">{a.date}</td>
                  <td className="border border-gray-300 p-2">{a.timeSlot}</td>
                  <td className="border border-gray-300 p-2">{a.clinicName || a.clinic?.name}</td>
                  <td className="border border-gray-300 p-2">{a.doctorName || a.doctor?.name || "TBD"}</td>
                  <td className="border border-gray-300 p-2">{a.status || "Confirmed"}</td>
                  <td className="border border-gray-300 p-2">
                    <button className="text-blue-600 hover:underline mr-2">Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Past Appointments */}
      <div className="purpose-section">
        <h3 className="section-title">📜 Past Appointments</h3>
        <p className="purpose-text">
          A summary of your previous appointments and their outcomes.
        </p>
        {past.length === 0 ? (
          <p className="text-center text-gray-500">No past appointments.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Clinic</th>
                <th className="border border-gray-300 p-2">Doctor</th>
                <th className="border border-gray-300 p-2">Notes</th>
                <th className="border border-gray-300 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {past.map((a) => (
                <tr key={a._id || a.id}>
                  <td className="border border-gray-300 p-2">{a.date}</td>
                  <td className="border border-gray-300 p-2">{a.clinicName || a.clinic?.name}</td>
                  <td className="border border-gray-300 p-2">{a.doctorName || a.doctor?.name || "TBD"}</td>
                  <td className="border border-gray-300 p-2">Follow-up recommended</td>
                  <td className="border border-gray-300 p-2">{a.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Reminders and Notifications */}
      <div className="purpose-section">
        <h3 className="section-title">🔔 Reminders and Notifications</h3>
        <p className="purpose-text">
          Stay on top of your healthcare journey with instant reminders and alerts.
        </p>
        <h4 className="text-lg font-semibold mb-2">Recent Notifications:</h4>
        <ul className="list-disc list-inside">
          <li>🩺 Your appointment with Dr. Jacobs is tomorrow at 09:30 AM.</li>
          <li>⚕️ New slot availability at City Clinic next week.</li>
          <li>💊 Reminder: Don’t forget to bring your medical card during your next visit.</li>
        </ul>
      </div>

      {/* Assistance */}
      <div className="purpose-section">
        <h3 className="section-title">💬 Need Assistance or Want to Share Feedback?</h3>
        <p className="purpose-text">
          We value your experience. Reach out to our support team or share feedback to help us improve the system.
        </p>
        <div className="text-center">
          <button className="cta-button mr-4">📝 Submit Feedback</button>
          <button className="cta-button">📞 Contact Support</button>
        </div>
      </div>

      {/* Daily Health Tip */}
      <div className="commitment-section">
        <h3 className="section-title">🧠 Daily Health Tip</h3>
        <blockquote className="commitment-quote">
          💡 “Drink at least 2 liters of water every day to stay hydrated and energized.”
          <br />
          Stay healthy — small steps make a big difference.
        </blockquote>
      </div>
    </div>
  );
}
