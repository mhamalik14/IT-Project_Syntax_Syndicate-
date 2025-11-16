import React, { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { fetchStaffAppointments, updateStatus as apiUpdateStatus } from "../api/appointments";
import { getCurrentUser } from "../utils/auth";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components globally
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function StaffDashboard() {
  const user = getCurrentUser();

  // Data/state
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState("");

  // Filters
  const [dateFilter, setDateFilter] = useState("today"); // today | tomorrow | week | all
  const [statusFilter, setStatusFilter] = useState("all"); // all | confirmed | pending | completed | canceled
  const [searchQuery, setSearchQuery] = useState("");

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: user?.name || "",
    staffId: user?.user_id || user?.id || "",
    profession: "",
    specialization: "",
    clinic: "",
    email: "",
    phone: "",
  });
  const [profileMessage, setProfileMessage] = useState("");

  // Modals
  const [viewAppt, setViewAppt] = useState(null); // appointment object or null
  const [noteText, setNoteText] = useState("");

  // Demo fallbacks for dashboard cards
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

  const weeklySummary = {
    totalAppointments: 22,
    completed: 20,
    canceled: 2,
    avgPatientsPerDay: 4.5,
  };

  const medicalTip = "💡 Encourage patients to maintain consistent sleep schedules for better recovery and energy.";

  // Load appointments
  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoadingAppointments(true);
      setAppointmentsError("");
      try {
        const staffId = user.user_id || user.id;
        const data = await fetchStaffAppointments(staffId);
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading appointments:", err);
        setAppointmentsError("Failed to load appointments. Please try again.");
        setAppointments([]);
      } finally {
        setLoadingAppointments(false);
      }
    })();
  }, [user]);

  if (!user) {
    return <div className="container p-6">Please log in to access your dashboard.</div>;
  }

  // Profile handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage("");
    try {
      const staffId = user.user_id || user.id;
      await api.post(`/staff/profile/${staffId}`, profileForm);
      setProfileMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setProfileMessage("❌ Failed to update profile.");
    }
  };

  // Appointment actions
  const updateAppointmentStatus = async (apptId, status) => {
    try {
      await apiUpdateStatus(apptId, status);
      setAppointments((prev) =>
        prev.map((a) => (a.id === apptId || a._id === apptId ? { ...a, status } : a))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Could not update status. Please try again.");
    }
  };

  const addAppointmentNote = async () => {
    if (!viewAppt) return;
    try {
      await api.post(`/appointments/${viewAppt.id || viewAppt._id}/notes`, { note: noteText });
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === (viewAppt.id || viewAppt._id) || a._id === (viewAppt.id || viewAppt._id)
            ? { ...a, notes: [...(a.notes || []), noteText] }
            : a
        )
      );
      setNoteText("");
      alert("Note added.");
    } catch (err) {
      console.error("Failed to add note:", err);
      alert("Could not add note. Please try again.");
    }
  };

  // Filters logic
  const isDateInFilter = (dateStr) => {
    if (!dateStr) return true;
    const today = new Date();
    const date = new Date(dateStr);
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.floor((date - new Date(today.toDateString())) / oneDay);

    switch (dateFilter) {
      case "today":
        return date.toDateString() === today.toDateString();
      case "tomorrow": {
        const tmr = new Date(today);
        tmr.setDate(today.getDate() + 1);
        return date.toDateString() === tmr.toDateString();
      }
      case "week": {
        const end = new Date(today);
        end.setDate(today.getDate() + 7);
        return date >= today && date <= end;
      }
      case "all":
      default:
        return true;
    }
  };

  const filteredAppointments = useMemo(() => {
    return (appointments || [])
      .filter((a) => {
        const status = (a.status || "").toLowerCase();
        const matchesStatus = statusFilter === "all" ? true : status === statusFilter;
        const matchesDate = isDateInFilter(a.date);
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !q ||
          (a.patient && a.patient.toLowerCase().includes(q)) ||
          (a.clinic && a.clinic.toLowerCase().includes(q)) ||
          (a.time && a.time.toLowerCase().includes(q));
        return matchesStatus && matchesDate && matchesSearch;
      })
      .sort((x, y) => {
        const dx = new Date(x.date || 0).getTime();
        const dy = new Date(y.date || 0).getTime();
        return dx - dy;
      });
  }, [appointments, statusFilter, dateFilter, searchQuery]);

  // Charts data (demo)
  const lineData = useMemo(
    () => ({
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [
        {
          label: "Appointments per Day",
          data: [5, 8, 6, 10, 7],
          borderColor: "#2563EB",
          backgroundColor: "rgba(37,99,235,0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    }),
    []
  );

  const barData = useMemo(
    () => ({
      labels: ["Confirmed", "Pending", "Completed", "Canceled"],
      datasets: [
        {
          label: "Status Distribution",
          data: [10, 4, 6, 2],
          backgroundColor: ["#22C55E", "#F59E0B", "#0EA5E9", "#EF4444"],
        },
      ],
    }),
    []
  );

  const pieData = useMemo(
    () => ({
      labels: ["New Patients", "Repeat Patients"],
      datasets: [
        {
          data: [12, 10],
          backgroundColor: ["#8B5CF6", "#14B8A6"],
        },
      ],
    }),
    []
  );

  return (
    <div className="container">
      <div className="hero-section">
        <div className="hero-content">
          {/* Header */}
          <div className="hero-header">
            <h1 className="hero-title">👨‍⚕️ Welcome, {profileForm.fullName || "Staff Member"}!</h1>
            <p className="hero-description">
              Manage appointments, review patient information, update your profile, and track performance with real-time insights.
            </p>
          </div>

          {/* Profile Form */}
          <div className="purpose-section">
            <h3 className="section-title">📝 Staff profile</h3>
            <div className="service-card">
              <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="fullName" value={profileForm.fullName} onChange={handleProfileChange} placeholder="Full name" className="border p-3 rounded" />
                <input name="staffId" value={profileForm.staffId} onChange={handleProfileChange} placeholder="Staff ID" className="border p-3 rounded" />
                <select name="profession" value={profileForm.profession} onChange={handleProfileChange} className="border p-3 rounded">
                  <option value="">-- Select profession --</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Pharmacist">Pharmacist</option>
                  <option value="Lab Technician">Lab Technician</option>
                  <option value="Physiotherapist">Physiotherapist</option>
                  <option value="Admin">Admin Staff</option>
                </select>
                <input name="specialization" value={profileForm.specialization} onChange={handleProfileChange} placeholder="Specialization (e.g., Cardiology)" className="border p-3 rounded" />
                <input name="clinic" value={profileForm.clinic} onChange={handleProfileChange} placeholder="Clinic" className="border p-3 rounded" />
                <input type="email" name="email" value={profileForm.email} onChange={handleProfileChange} placeholder="Email" className="border p-3 rounded" />
                <input name="phone" value={profileForm.phone} onChange={handleProfileChange} placeholder="Phone number" className="border p-3 rounded" />
                <div className="col-span-1 md:col-span-2 flex gap-3">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save profile</button>
                  {profileMessage && (
                    <div className={`font-semibold ${profileMessage.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>{profileMessage}</div>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Upcoming Appointments with filters */}
          <div className="services-section">
            <h3 className="section-title">📅 Upcoming appointments</h3>
            <p className="purpose-text">Filter by date range, status, or search by patient/clinic/time.</p>

            {/* Filter bar */}
            <div className="service-card">
              <div className="flex flex-col md:flex-row gap-3 mb-3">
                <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="border p-2 rounded">
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="week">This week</option>
                  <option value="all">All</option>
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border p-2 rounded">
                  <option value="all">All statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search (patient/clinic/time)"
                  className="border p-2 rounded flex-1"
                />
              </div>

              {loadingAppointments ? (
                <div className="p-4">Loading appointments...</div>
              ) : appointmentsError ? (
                <div className="p-4 text-red-600">{appointmentsError}</div>
              ) : filteredAppointments.length === 0 ? (
                <div className="p-4 text-gray-600">No appointments match your filters.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="p-2 border">Date</th>
                        <th className="p-2 border">Time</th>
                        <th className="p-2 border">Patient</th>
                        <th className="p-2 border">Clinic</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAppointments.map((appt, index) => {
                        const id = appt.id || appt._id || `row-${index}`;
                        return (
                          <tr key={id}>
                            <td className="p-2 border">{appt.date || "-"}</td>
                            <td className="p-2 border">{appt.time || "-"}</td>
                            <td className="p-2 border">{appt.patient || "-"}</td>
                            <td className="p-2 border">{appt.clinic || "-"}</td>
                            <td className="p-2 border capitalize">{appt.status || "-"}</td>
                            <td className="p-2 border">
                              <div className="flex flex-wrap gap-2">
                                <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={() => setViewAppt(appt)}>View</button>
                                <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={() => updateAppointmentStatus(id, "confirmed")}>Confirm</button>
                                <button className="px-3 py-1 bg-emerald-600 text-white rounded" onClick={() => updateAppointmentStatus(id, "completed")}>Complete</button>
                                <button className="px-3 py-1 bg-red-600 text-white rounded" onClick={() => updateAppointmentStatus(id, "canceled")}>Cancel</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Appointment modal */}
          {viewAppt && (
            <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
                <h4 className="text-lg font-semibold mb-2">Appointment details</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Patient:</strong> {viewAppt.patient || "-"}</p>
                  <p><strong>Clinic:</strong> {viewAppt.clinic || "-"}</p>
                  <p><strong>Date:</strong> {viewAppt.date || "-"}</p>
                  <p><strong>Time:</strong> {viewAppt.time || "-"}</p>
                  <p><strong>Status:</strong> {viewAppt.status || "-"}</p>
                  <p><strong>Notes:</strong> {(viewAppt.notes && viewAppt.notes.join("; ")) || "-"}</p>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Add note</label>
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full border rounded p-2"
                    placeholder="Enter consultation note or instructions"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={addAppointmentNote}>Save note</button>
                  <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => { setViewAppt(null); setNoteText(""); }}>Close</button>
                </div>
              </div>
            </div>
          )}

          {/* Analytics & Charts */}
          <div className="purpose-section">
            <h3 className="section-title">📊 Analytics & charts</h3>
            <div className="charts-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
              <div className="chart-card h-64 p-2 border rounded"><Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
              <div className="chart-card h-64 p-2 border rounded"><Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
              <div className="chart-card h-64 p-2 border rounded"><Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} /></div>
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="services-section">
            <h3 className="section-title">🧾 Weekly summary</h3>
            <div className="service-card">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="p-3 border rounded"><strong>Total appointments:</strong> {weeklySummary.totalAppointments}</div>
                <div className="p-3 border rounded"><strong>Completed:</strong> {weeklySummary.completed}</div>
                <div className="p-3 border rounded"><strong>Canceled:</strong> {weeklySummary.canceled}</div>
                <div className="p-3 border rounded"><strong>Avg patients/day:</strong> {weeklySummary.avgPatientsPerDay}</div>
              </div>
              <p className="mt-2 text-sm text-gray-600">Consider adding live charts sourced from your analytics API.</p>
            </div>
          </div>

          {/* Notifications */}
          <div className="purpose-section">
            <h3 className="section-title">🔔 Notifications</h3>
            <div className="service-card">
              <ul className="list-disc pl-5">
                {notifications.map((note, i) => <li key={i}>{note}</li>)}
              </ul>
            </div>
          </div>

          {/* Daily Schedule */}
          <div className="services-section">
            <h3 className="section-title">🕓 Daily schedule</h3>
            <div className="service-card">
              <ul className="space-y-1">
                {dailySchedule.map((slot, i) => (
                  <li key={i}>
                    <strong>{slot.time}</strong> — {slot.patient} ({slot.clinic}) —{" "}
                    <span
                      style={{
                        color:
                          slot.status === "Completed" ? "green" :
                          slot.status === "Pending" ? "orange" :
                          slot.status === "Confirmed" ? "blue" : "red",
                      }}
                    >
                      {slot.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Medical Tip */}
          <div className="purpose-section">
            <h3 className="section-title">🧠 Quick medical tip</h3>
            <div className="service-card">
              <p>{medicalTip}</p>
            </div>
          </div>

          {/* Commitment */}
          <div className="commitment-section">
            <blockquote className="commitment-quote">
              "Empowering healthcare professionals with smarter tools to provide better care, faster decisions, and improved patient satisfaction."
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
