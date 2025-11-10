import React, { useEffect, useState } from "react";
import api from "../api/api";
import { getUserFromToken } from "../utils/auth";

const StaffDashboard = () => {
  const user = getUserFromToken();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
    // eslint-disable-next-line
  }, [user]);

  const loadAppointments = async () => {
    try {
      const res = await api.get(`/appointments/doctor/${user.user_id}`);
      setAppointments(res.data);
    } catch (err) {
      console.error("Error loading appointments:", err);
    }
  };

  if (!user) {
    return <div>Please log in to access your dashboard.</div>;
  }

  // Static placeholders for demo (replace with API calls later)
  const profile = {
    name: user.name || "Dr. John Doe",
    specialization: "Cardiology",
    clinic: "City Clinic",
    appointmentsToday: 5,
    patientsThisWeek: 18,
  };

  const upcomingAppointments = [
    { date: "10 Nov 2025", time: "09:30 AM", patient: "John Smith", clinic: "City Clinic", status: "Confirmed", actions: ["View"] },
    { date: "10 Nov 2025", time: "11:00 AM", patient: "Sarah Adams", clinic: "City Clinic", status: "Pending", actions: ["Confirm"] },
  ];

  const patientDetails = {
    name: "John Smith",
    age: 42,
    contact: "+27 65 234 7890",
    lastVisit: "20 Oct 2025",
    notes: "Follow-up for blood pressure monitoring.",
  };

  const weeklySummary = {
    totalAppointments: 22,
    completed: 20,
    canceled: 2,
    avgPatientsPerDay: 4.5,
  };

  const notifications = [
    "🩺 New appointment booked with Sarah Adams (11:00 AM)",
    "⚠️ Appointment with Michael Jones canceled (2:00 PM)",
    "📢 Reminder: Staff meeting at 4:00 PM today",
  ];

  const dailySchedule = [
    { time: "09:30 AM", patient: "John Smith", clinic: "City Clinic", status: "Confirmed" },
    { time: "11:00 AM", patient: "Sarah Adams", clinic: "City Clinic", status: "Pending" },
    { time: "01:00 PM", patient: "Michael Jones", clinic: "City Clinic", status: "Completed" },
  ];

  const medicalTip = "💡 Encourage patients to maintain consistent sleep schedules for better recovery and energy.";

  return (
    <div className="container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-header">
            <h1 className="hero-title">👨‍⚕️ Welcome, {profile.name}!</h1>
            <p className="hero-description">
              Here’s your personalized staff dashboard — manage your appointments, review patient information, update visit statuses, and stay informed about your daily schedule.
            </p>
          </div>

          <div className="purpose-section">
            <h3 className="section-title">Profile Summary</h3>
            <div className="service-cards">
              <div className="service-card">
                <div className="service-icon">👨‍⚕️</div>
                <h4 className="service-title">Doctor: {profile.name}</h4>
                <p>Specialization: {profile.specialization}</p>
                <p>Clinic: {profile.clinic}</p>
                <p>Appointments Today: {profile.appointmentsToday}</p>
                <p>Patients This Week: {profile.patientsThisWeek}</p>
              </div>
            </div>
          </div>

          <div className="services-section">
            <h3 className="section-title">📅 Upcoming Appointments</h3>
            <p className="purpose-text">Keep track of your upcoming appointments and daily schedule. You can view, confirm, or cancel patient visits directly from here.</p>
            <p className="purpose-text">✅ Tip: Use filters to view appointments by Today, Tomorrow, or This Week.</p>
            <div className="service-card">
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Date</th>
                    <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Time</th>
                    <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Patient</th>
                    <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Clinic</th>
                    <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Status</th>
                    <th style={{ padding: "0.5rem", border: "1px solid #ddd" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAppointments.map((appt, index) => (
                    <tr key={index}>
                      <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{appt.date}</td>
                      <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{appt.time}</td>
                      <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{appt.patient}</td>
                      <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{appt.clinic}</td>
                      <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>{appt.status}</td>
                      <td style={{ padding: "0.5rem", border: "1px solid #ddd" }}>
                        {appt.actions.map((action, i) => (
                          <button key={i} style={{ marginRight: "0.5rem", padding: "0.25rem 0.5rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px" }}>{action}</button>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="purpose-section">
            <h3 className="section-title">📋 Patient Details</h3>
            <p className="purpose-text">Access important patient information with a single click.</p>
            <div className="service-card">
              <h4 className="service-title">Name: {patientDetails.name}</h4>
              <p>Age: {patientDetails.age}</p>
              <p>Contact: {patientDetails.contact}</p>
              <p>Last Visit: {patientDetails.lastVisit}</p>
              <p>Notes: {patientDetails.notes}</p>
            </div>
          </div>

          <div className="services-section">
            <h3 className="section-title">🧾 Appointment Management</h3>
            <p className="purpose-text">Easily update appointment statuses or record medical notes after consultations.</p>
            <div className="service-card">
              <h4 className="service-title">Actions Available:</h4>
              <ul className="service-list">
                <li>✅ Mark as Completed</li>
                <li>❌ Cancel Appointment</li>
                <li>📝 Add Visit Notes or Prescription</li>
              </ul>
            </div>
          </div>

          <div className="purpose-section">
            <h3 className="section-title">📊 Weekly Summary & Insights</h3>
            <p className="purpose-text">Gain insights into your clinic performance and workload.</p>
            <div className="service-card">
              <h4 className="service-title">Weekly Overview:</h4>
              <p>Total Appointments: {weeklySummary.totalAppointments}</p>
              <p>Completed: {weeklySummary.completed}</p>
              <p>Canceled: {weeklySummary.canceled}</p>
              <p>Average Patients per Day: {weeklySummary.avgPatientsPerDay}</p>
              <p>Visual Insights (optional for charts): Most common appointment times, Number of patients per weekday, Percentage of repeat patients.</p>
            </div>
          </div>

          <div className="services-section">
            <h3 className="section-title">🔔 Notifications</h3>
            <p className="purpose-text">Stay informed with real-time alerts for new bookings, cancellations, or system updates.</p>
            <div className="service-card">
              <h4 className="service-title">Recent Notifications:</h4>
              <ul className="service-list">
                {notifications.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="purpose-section">
            <h3 className="section-title">💬 Communication & Feedback</h3>
            <p className="purpose-text">Engage with clinic staff or administrators for updates and collaboration.</p>
            <div className="service-card">
              <h4 className="service-title">Available Actions:</h4>
              <ul className="service-list">
                <li>💭 Message Admin — Request schedule changes or report issues.</li>
                <li>📋 Leave Feedback — Share suggestions for system improvements.</li>
              </ul>
            </div>
          </div>

          <div className="services-section">
            <h3 className="section-title">🕓 Daily Schedule Overview</h3>
            <p className="purpose-text">View your full day at a glance with a simple schedule timeline.</p>
            <p className="purpose-text">✅ Color-code statuses for easy identification (e.g., Green = Completed, Yellow = Pending, Red = Canceled).</p>
            <div className="service-card">
              <ul className="service-list">
                {dailySchedule.map((slot, index) => (
                  <li key={index}>
                    <strong>{slot.time}</strong> - {slot.patient} ({slot.clinic}) - <span style={{ color: slot.status === "Completed" ? "green" : slot.status === "Pending" ? "orange" : "red" }}>{slot.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="purpose-section">
            <h3 className="section-title">🧠 Quick Medical Tips</h3>
            <p className="purpose-text">Keep yourself and your patients informed with regular healthcare insights.</p>
            <div className="service-card">
              <p>{medicalTip} (Updated daily for engagement and awareness.)</p>
            </div>
          </div>

          <div className="commitment-section">
            <blockquote className="commitment-quote">
              "Empowering healthcare professionals with smarter tools to provide better care, faster decisions, and improved patient satisfaction."
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
