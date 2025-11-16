import React, { useState, useRef, useEffect, useMemo } from "react";
import { fetchAppointments } from "../api/appointments";
import { fetchClinics as apiFetchClinics } from "../api/clinics";
import { fetchProviders as apiFetchProviders } from "../api/providers";
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

// Register Chart.js globally
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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTab]);

  // --- Mock data for all tabs ---
  const [appointments, setAppointments] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const stats = {
    totalPatients: 1200,
    totalStaff: 85,
    activeClinics: 12,
    pendingApprovals: 7,
  };
  const patients = [
    { id: "P001", name: "John Smith", contact: "+27 65 234 7890", registered: "2025-10-01", lastAppointment: "2025-11-10" },
    { id: "P002", name: "Sarah Adams", contact: "+27 72 111 2222", registered: "2025-09-15", lastAppointment: "2025-11-12" },
    { id: "P003", name: "Sipho Mkhize", contact: "+27 83 555 0199", registered: "2025-08-21", lastAppointment: "2025-11-08" },
  ];

  const staff = [
    { id: "S001", name: "Dr. Jane Doe", role: "Doctor", clinic: "City Clinic", status: "Active" },
    { id: "S002", name: "Nurse Peter", role: "Nurse", clinic: "North Clinic", status: "Pending Approval" },
    { id: "S003", name: "Pharm. Lerato", role: "Pharmacist", clinic: "South Clinic", status: "Active" },
  ];

  const recentUsers = [
    { name: "Alice Johnson", role: "Patient", email: "alice@example.com", registered: "2025-11-14", status: "Verified" },
    { name: "Michael Brown", role: "Doctor", email: "michael@example.com", registered: "2025-11-13", status: "Pending" },
    { name: "Thabo Dlamini", role: "Patient", email: "thabo@example.com", registered: "2025-11-12", status: "Verified" },
  ];

  const supportLogs = [
    { id: "T001", user: "John Smith", issue: "Login error", status: "Resolved", assignedTo: "Support Agent A" },
    { id: "T002", user: "Sarah Adams", issue: "Appointment not saving", status: "Open", assignedTo: "Support Agent B" },
    { id: "T003", user: "Dr. Jane Doe", issue: "Chart not loading", status: "Open", assignedTo: "Support Agent C" },
  ];

  const initialClinics = [
    { id: "C001", name: "City Clinic", location: "Durban CBD", doctors: 15, status: "Active" },
    { id: "C002", name: "North Clinic", location: "Pietermaritzburg", doctors: 8, status: "Active" },
    { id: "C003", name: "South Clinic", location: "Umlazi", doctors: 10, status: "Active" },
  ];

  // seed clinics state with initial mock data; real data will replace on fetch
  useEffect(() => {
    setClinics(initialClinics);
  }, []);

  const notifications = [
    { icon: "🩺", message: "New doctor registered", time: "2 hours ago", type: "doctor" },
    { icon: "👥", message: "Patient John Smith booked an appointment", time: "5 hours ago", type: "patient" },
    { icon: "⚠️", message: "High cancellation rate detected (12%)", time: "1 day ago", type: "system" },
  ];

  // --- Chart data (mock) ---
  const lineData = useMemo(
    () => ({
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Appointments per Day",
          data: [32, 45, 28, 51, 40, 22, 18],
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
      labels: clinics.map((c) => c.name),
      datasets: [
        {
          label: "Appointments (last week)",
          data: clinics.map(() => Math.floor(Math.random() * 250)), // placeholder
          backgroundColor: ["#22C55E", "#F59E0B", "#EF4444"].slice(0, clinics.length),
        },
      ],
    }),
    [clinics]
  );

  const pieData = useMemo(
    () => ({
      labels: ["Completed", "Canceled"],
      datasets: [
        {
          data: [85, 15],
          backgroundColor: ["#10B981", "#EF4444"],
        },
      ],
    }),
    []
  );

  // Load server-side data (appointments, clinics, providers)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const [apptsRes, clinicsRes, providersRes] = await Promise.allSettled([
          fetchAppointments(),
          apiFetchClinics(),
          apiFetchProviders(),
        ]);

        if (!mounted) return;

        if (apptsRes.status === "fulfilled" && Array.isArray(apptsRes.value)) {
          setAppointments(apptsRes.value);
        }
        if (clinicsRes.status === "fulfilled" && Array.isArray(clinicsRes.value)) {
          setClinics(clinicsRes.value);
        }
        if (providersRes.status === "fulfilled" && Array.isArray(providersRes.value)) {
          setProviders(providersRes.value);
        }
      } catch (err) {
        console.warn("Admin dashboard load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  // --- Helpers ---
  const filterBySearch = (items, keys) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      keys.some((k) => String(it[k] ?? "").toLowerCase().includes(q))
    );
  };

  return (
    <div className="container">
      <div className="hero-section">
        <div className="hero-content">
          {/* Header */}
          <div className="hero-header">
            <h1 className="hero-title">🧑‍💼 Welcome, Admin!</h1>
            <p className="hero-description">
              Manage patients, staff, clinics, registrations, support, analytics, and notifications.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Select a task</h2>
            <div className="service-cards">
              {[
                { id: "overview", label: "System Overview", icon: "🏥" },
                { id: "patients", label: "Patient Management", icon: "👥" },
                { id: "staff", label: "Staff Management", icon: "🧾" },
                { id: "registration", label: "Registration Monitoring", icon: "📋" },
                { id: "support", label: "Support & Issues", icon: "🧩" },
                { id: "clinics", label: "Clinic Management", icon: "🏗️" },
                { id: "analytics", label: "Analytics & Insights", icon: "📊" },
                { id: "notifications", label: "Notifications", icon: "🔔" },
              ].map((tab) => (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`service-card cursor-pointer ${
                    activeTab === tab.id ? "border-blue-500 bg-blue-50 shadow-lg" : ""
                  }`}
                >
                  <div className="service-icon text-2xl">{tab.icon}</div>
                  <h4 className={`service-title text-base ${activeTab === tab.id ? "text-blue-700" : ""}`}>
                    {tab.label}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 text-center">
                    {tab.id === "overview" && "Key metrics and system status"}
                    {tab.id === "patients" && "Manage patient records and profiles"}
                    {tab.id === "staff" && "Oversee doctors and staff accounts"}
                    {tab.id === "registration" && "Track sign-ups and verifications"}
                    {tab.id === "support" && "Handle tickets and escalate issues"}
                    {tab.id === "clinics" && "Configure and manage clinics"}
                    {tab.id === "analytics" && "Charts and insights"}
                    {tab.id === "notifications" && "System alerts and updates"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Content Sections */}
          <div ref={contentRef}>
            {loading && (
              <div className="p-4 text-center text-gray-600">Loading dashboard data...</div>
            )}
            {/* Overview */}
            {activeTab === "overview" && (
              <div className="services-section">
                <h3 className="section-title">🏥 System overview</h3>
                <div className="service-cards">
                  <div className="service-card">
                    <div className="service-icon">👥</div>
                    <h4 className="service-title">Total Registered Patients</h4>
                    <p className="text-center text-2xl font-bold">{stats.totalPatients}</p>
                  </div>
                  <div className="service-card">
                    <div className="service-icon">🧑‍⚕️</div>
                    <h4 className="service-title">Total Doctors / Staff</h4>
                    <p className="text-center text-2xl font-bold">{stats.totalStaff}</p>
                  </div>
                  <div className="service-card">
                    <div className="service-icon">🏥</div>
                    <h4 className="service-title">Active Clinics</h4>
                    <p className="text-center text-2xl font-bold">{stats.activeClinics}</p>
                  </div>
                  <div className="service-card">
                    <div className="service-icon">⏳</div>
                    <h4 className="service-title">Pending Approvals</h4>
                    <p className="text-center text-2xl font-bold">{stats.pendingApprovals}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Patients */}
            {activeTab === "patients" && (
              <div className="purpose-section">
                <h3 className="section-title">👥 Patient management</h3>
                <div className="flex gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="🔍 Search by name, ID, or contact"
                    className="flex-1 px-4 py-2 border rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="bg-green-500 text-white px-4 py-2 rounded">➕ Add patient</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left">Patient ID</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Contact</th>
                        <th className="px-4 py-3 text-left">Registered</th>
                        <th className="px-4 py-3 text-left">Last Appointment</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterBySearch(patients, ["id", "name", "contact"]).map((p) => (
                        <tr key={p.id} className="border-b">
                          <td className="px-4 py-3">{p.id}</td>
                          <td className="px-4 py-3">{p.name}</td>
                          <td className="px-4 py-3">{p.contact}</td>
                          <td className="px-4 py-3">{p.registered}</td>
                          <td className="px-4 py-3">{p.lastAppointment}</td>
                          <td className="px-4 py-3">
                            <button className="text-blue-600 mr-3">✏️ Edit</button>
                            <button className="text-red-600">🗑️ Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Staff */}
            {activeTab === "staff" && (
              <div className="purpose-section">
                <h3 className="section-title">🧾 Staff & doctor management</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left">Staff ID</th>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-left">Clinic</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterBySearch(staff, ["id", "name", "role", "clinic"]).map((m) => (
                        <tr key={m.id} className="border-b">
                          <td className="px-4 py-3">{m.id}</td>
                          <td className="px-4 py-3">{m.name}</td>
                          <td className="px-4 py-3">{m.role}</td>
                          <td className="px-4 py-3">{m.clinic}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                m.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {m.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {m.status === "Pending Approval" ? (
                              <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">✅ Approve</button>
                            ) : (
                              <button className="bg-red-500 text-white px-3 py-1 rounded text-sm">🚫 Suspend</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Registration */}
            {activeTab === "registration" && (
              <div className="purpose-section">
                <h3 className="section-title">📋 Registration monitoring</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Registered On</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterBySearch(recentUsers, ["name", "role", "email"]).map((u, i) => (
                        <tr key={i} className="border-b">
                          <td className="px-4 py-3">{u.name}</td>
                          <td className="px-4 py-3">{u.role}</td>
                          <td className="px-4 py-3">{u.email}</td>
                          <td className="px-4 py-3">{u.registered}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                u.status === "Verified"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {u.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-blue-600 text-sm">✅ Verify</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Support */}
            {activeTab === "support" && (
              <div className="purpose-section">
                <h3 className="section-title">🧩 Support & issue management</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left">Ticket ID</th>
                        <th className="px-4 py-3 text-left">User</th>
                        <th className="px-4 py-3 text-left">Issue</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Assigned To</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterBySearch(supportLogs, ["id", "user", "issue", "assignedTo"]).map((log) => (
                        <tr key={log.id} className="border-b">
                          <td className="px-4 py-3">{log.id}</td>
                          <td className="px-4 py-3">{log.user}</td>
                          <td className="px-4 py-3">{log.issue}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                log.status === "Resolved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">{log.assignedTo}</td>
                          <td className="px-4 py-3">
                            <button className="text-blue-600 text-sm mr-3">🛠️ Resolve</button>
                            <button className="text-orange-600 text-sm">📨 Escalate</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Clinics */}
            {activeTab === "clinics" && (
              <div className="purpose-section">
                <h3 className="section-title">🏗️ Clinic management</h3>
                <div className="mb-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">➕ Add clinic</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left">Clinic ID</th>
                        <th className="px-4 py-3 text-left">Clinic Name</th>
                        <th className="px-4 py-3 text-left">Location</th>
                        <th className="px-4 py-3 text-left">Active Doctors</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterBySearch(clinics, ["id", "name", "location"]).map((c) => (
                        <tr key={c.id} className="border-b">
                          <td className="px-4 py-3">{c.id}</td>
                          <td className="px-4 py-3">{c.name}</td>
                          <td className="px-4 py-3">{c.location}</td>
                          <td className="px-4 py-3">{c.doctors}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              {c.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-blue-600 mr-3">🏥 Edit</button>
                            <button className="text-red-600">❌ Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics */}
            {activeTab === "analytics" && (
              <div className="purpose-section">
                <h3 className="section-title">📊 Analytics & insights</h3>
                <div
                  className="charts-grid"
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
                >
                  <div className="chart-card bg-white p-4 rounded border h-64">
                    <h4 className="font-semibold mb-2">Appointments per day</h4>
                    <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                  <div className="chart-card bg-white p-4 rounded border h-64">
                    <h4 className="font-semibold mb-2">Clinic performance</h4>
                    <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                  <div className="chart-card bg-white p-4 rounded border h-64">
                    <h4 className="font-semibold mb-2">Cancellation rate</h4>
                    <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                  <div className="chart-card bg-white p-4 rounded border h-64">
                    <h4 className="font-semibold mb-2">System health</h4>
                    <p className="text-2xl font-bold text-green-600">99.8% Uptime</p>
                    <p className="text-sm text-gray-600">Last 30 days</p>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="purpose-section">
                <h3 className="section-title">🔔 Notifications</h3>
                <div className="space-y-4">
                  {notifications.map((n, i) => (
                    <div
                      key={i}
                      className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg flex items-start gap-3"
                    >
                      <span className="text-2xl">{n.icon}</span>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">{n.message}</p>
                        <p className="text-sm text-gray-500 mt-1">{n.time}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          n.type === "doctor"
                            ? "bg-yellow-100 text-yellow-800"
                            : n.type === "patient"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {n.type}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-semibold mb-4">💬 Communication & feedback</h3>
                  <p className="text-gray-600 mb-4">
                    Coordinate with staff or escalate issues to higher support levels.
                  </p>
                  <div className="flex gap-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded">📨 Message support</button>
                    <button className="bg-gray-500 text-white px-4 py-2 rounded">🧾 View logs</button>
                    <button className="bg-green-500 text-white px-4 py-2 rounded">📝 Submit feedback</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
