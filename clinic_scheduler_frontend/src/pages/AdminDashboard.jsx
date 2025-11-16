import React, { useState, useRef, useEffect } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab]);

  // Mock data
  const stats = {
    totalPatients: 234,
    totalStaff: 42,
    activeClinics: 8,
    pendingApprovals: 3
  };

  const patients = [
    { id: 'P-1024', name: 'Sarah Adams', contact: '+27 61 234 5678', registered: '01 Nov 2025', lastAppointment: '10 Nov 2025' },
    { id: 'P-1025', name: 'John Smith', contact: '+27 74 987 6543', registered: '02 Nov 2025', lastAppointment: '11 Nov 2025' }
  ];

  const staff = [
    { id: 'D-204', name: 'Dr. Naidoo', role: 'General Practitioner', clinic: 'City Clinic', status: 'Active' },
    { id: 'D-205', name: 'Dr. Jacobs', role: 'Dentist', clinic: 'SmileCare', status: 'Pending Approval' }
  ];

  const recentUsers = [
    { name: 'John Doe', role: 'Patient', email: 'john@example.com', registered: '09 Nov 2025', status: 'Verified' },
    { name: 'Sarah Smith', role: 'Doctor', email: 'sarah.smith@clinic.co.za', registered: '10 Nov 2025', status: 'Pending Review' }
  ];

  const supportLogs = [
    { id: '#1004', user: 'John Smith', issue: 'Unable to log in', status: 'Open', assignedTo: 'Admin Team' },
    { id: '#1005', user: 'Dr. Jacobs', issue: 'Appointment not syncing', status: 'Resolved', assignedTo: 'Tier 2' }
  ];

  const clinics = [
    { id: 'C-001', name: 'City Clinic', location: 'Johannesburg', doctors: 12, status: 'Active' },
    { id: 'C-002', name: 'Sunrise Health', location: 'Durban', doctors: 8, status: 'Active' }
  ];

  const notifications = [
    { type: 'doctor', message: 'New Doctor Registration: Dr. Sarah Adams (Pending Approval)', icon: '🩺', time: '2 hours ago' },
    { type: 'patient', message: 'Patient Record Updated: John Smith', icon: '👥', time: '4 hours ago' },
    { type: 'system', message: 'System Alert: Database backup completed successfully', icon: '⚠️', time: '6 hours ago' }
  ];

  return (
    <div className="container">
      <div className="hero-section">
        <div className="hero-content">
        {/* Welcome Section */}
        <div className="hero-header">
          <h1 className="hero-title">🧑‍💼 Welcome, Admin!</h1>
          <p className="hero-description">
            Here's your administrator control panel — manage patient records, oversee staff accounts, and ensure smooth operation of the clinic scheduling system.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            As a Tier 1 Support Admin, you play a key role in maintaining user access, handling registration issues, and coordinating with staff for system updates or troubleshooting.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Select a Task</h2>
          <div className="service-cards">
            {[
              { id: 'overview', label: 'System Overview', icon: '🏥', desc: 'View key metrics and system status' },
              { id: 'patients', label: 'Patient Management', icon: '👥', desc: 'Manage patient records and profiles' },
              { id: 'staff', label: 'Staff Management', icon: '🧾', desc: 'Oversee doctors and staff accounts' },
              { id: 'registration', label: 'Registration Monitoring', icon: '📋', desc: 'Track user sign-ups and verifications' },
              { id: 'support', label: 'Support & Issues', icon: '🧩', desc: 'Handle support tickets and issues' },
              { id: 'clinics', label: 'Clinic Management', icon: '🏗️', desc: 'Configure and manage clinics' },
              { id: 'reports', label: 'Reports & Analytics', icon: '📊', desc: 'Access system reports and insights' },
              { id: 'notifications', label: 'Notifications', icon: '🔔', desc: 'View system alerts and updates' }
            ].map(tab => (
              <div
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`service-card cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : ''
                }`}
              >
                <div className="service-icon text-2xl">{tab.icon}</div>
                <h4 className={`service-title text-base ${activeTab === tab.id ? 'text-blue-700' : ''}`}>
                  {tab.label}
                </h4>
                <p className="text-xs text-gray-600 mt-1 text-center">{tab.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div ref={contentRef}>
        {activeTab === 'overview' && (
          <div className="services-section">
            <h3 className="section-title">🏥 System Overview</h3>
            <p className="purpose-text">
              Get a quick overview of the clinic scheduling system's key metrics and performance indicators.
            </p>
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

        {activeTab === 'patients' && (
          <div className="purpose-section">
            <h3 className="section-title">👥 Patient Management</h3>
            <p className="purpose-text">
              Easily manage all patient profiles within the system. Add new patient records or search for existing ones.
            </p>

            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="🔍 Search by Name, ID, or Contact Number"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
                ➕ Add New Patient
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold">Patient ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Contact Number</th>
                    <th className="px-4 py-3 text-left font-semibold">Registered On</th>
                    <th className="px-4 py-3 text-left font-semibold">Last Appointment</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{patient.id}</td>
                      <td className="px-4 py-3 font-medium">{patient.name}</td>
                      <td className="px-4 py-3">{patient.contact}</td>
                      <td className="px-4 py-3">{patient.registered}</td>
                      <td className="px-4 py-3">{patient.lastAppointment}</td>
                      <td className="px-4 py-3">
                        <button className="text-blue-500 hover:text-blue-700 mr-2">✏️ Edit</button>
                        <button className="text-red-500 hover:text-red-700">🗑️ Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'staff' && (
          <div className="purpose-section">
            <h3 className="section-title">🧾 Staff & Doctor Management</h3>
            <p className="purpose-text">
              Admins can manage healthcare staff and doctor access once they've registered and verified with support.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold">Staff ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Role</th>
                    <th className="px-4 py-3 text-left font-semibold">Clinic</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{member.id}</td>
                      <td className="px-4 py-3 font-medium">{member.name}</td>
                      <td className="px-4 py-3">{member.role}</td>
                      <td className="px-4 py-3">{member.clinic}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {member.status === 'Pending Approval' ? (
                          <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm">
                            ✅ Approve
                          </button>
                        ) : (
                          <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">
                            🚫 Suspend
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'registration' && (
          <div className="purpose-section">
            <h3 className="section-title">📋 Registration Monitoring</h3>
            <p className="purpose-text">
              Track user sign-ups and ensure the registration process runs smoothly.
            </p>

            <h3 className="text-lg font-semibold mb-4">Recently Registered Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Role</th>
                    <th className="px-4 py-3 text-left font-semibold">Email</th>
                    <th className="px-4 py-3 text-left font-semibold">Registered On</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{user.name}</td>
                      <td className="px-4 py-3">{user.role}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.registered}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-blue-500 hover:text-blue-700 text-sm">✅ Verify</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="purpose-section">
            <h3 className="section-title">🧩 Support & Issue Management</h3>
            <p className="purpose-text">
              As a Tier 1 Support Admin, you handle first-level issues and escalate when needed.
            </p>

            <h3 className="text-lg font-semibold mb-4">Support Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold">Ticket ID</th>
                    <th className="px-4 py-3 text-left font-semibold">User</th>
                    <th className="px-4 py-3 text-left font-semibold">Issue</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Assigned To</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {supportLogs.map((log, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{log.id}</td>
                      <td className="px-4 py-3">{log.user}</td>
                      <td className="px-4 py-3">{log.issue}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          log.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{log.assignedTo}</td>
                      <td className="px-4 py-3">
                        <button className="text-blue-500 hover:text-blue-700 text-sm mr-2">🛠️ Resolve</button>
                        <button className="text-orange-500 hover:text-orange-700 text-sm">📨 Escalate</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'clinics' && (
          <div className="purpose-section">
            <h3 className="section-title">🏗️ Clinic Management</h3>
            <p className="purpose-text">
              Manage and configure clinics available in the system.
            </p>

            <div className="mb-6">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                ➕ Add New Clinic
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-semibold">Clinic ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Clinic Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Location</th>
                    <th className="px-4 py-3 text-left font-semibold">Active Doctors</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clinics.map((clinic, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{clinic.id}</td>
                      <td className="px-4 py-3 font-medium">{clinic.name}</td>
                      <td className="px-4 py-3">{clinic.location}</td>
                      <td className="px-4 py-3">{clinic.doctors}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          {clinic.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-blue-500 hover:text-blue-700 mr-2">🏥 Edit</button>
                        <button className="text-red-500 hover:text-red-700">❌ Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="purpose-section">
            <h3 className="section-title">📊 Reports & Analytics</h3>
            <p className="purpose-text">
              Access summarized reports to track system usage and clinic efficiency.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-4 border shadow-sm" style={{ height: '300px' }}>
                <h3 className="font-semibold mb-2">Monthly Appointments</h3>
                <Bar
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                      label: 'Appointments',
                      data: [120, 150, 180, 200, 250, 300],
                      backgroundColor: 'rgba(59, 130, 246, 0.8)',
                      borderColor: 'rgba(59, 130, 246, 1)',
                      borderWidth: 1,
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                />
              </div>
              <div className="bg-white rounded-lg p-4 border shadow-sm" style={{ height: '300px' }}>
                <h3 className="font-semibold mb-2">Clinic Performance</h3>
                <Bar
                  data={{
                    labels: ['City Clinic', 'Sunrise Health', 'MediCare', 'HealthPlus'],
                    datasets: [{
                      label: 'Appointments',
                      data: [215, 180, 150, 120],
                      backgroundColor: [
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(251, 191, 36, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                        'rgba(168, 85, 247, 0.8)',
                      ],
                      borderWidth: 1,
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                />
              </div>
              <div className="bg-white rounded-lg p-4 border shadow-sm" style={{ height: '300px' }}>
                <h3 className="font-semibold mb-2">Appointment Status</h3>
                <Pie
                  data={{
                    labels: ['Completed', 'Scheduled', 'Cancelled'],
                    datasets: [{
                      data: [856, 120, 32],
                      backgroundColor: [
                        'rgba(34, 197, 94, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                      ],
                      borderWidth: 1,
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'bottom' },
                    },
                  }}
                />
              </div>
              <div className="bg-white rounded-lg p-4 border shadow-sm" style={{ height: '300px' }}>
                <h3 className="font-semibold mb-2">System Uptime Trend</h3>
                <Line
                  data={{
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                    datasets: [{
                      label: 'Uptime %',
                      data: [99.2, 99.8, 99.5, 99.9],
                      borderColor: 'rgba(34, 197, 94, 1)',
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      fill: true,
                      tension: 0.4,
                    }],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: {
                        beginAtZero: false,
                        min: 95,
                        max: 100,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="purpose-section">
            <h3 className="section-title">🔔 Notifications</h3>
            <p className="purpose-text">
              Stay up to date with real-time system updates, user registrations, and alerts.
            </p>

            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg flex items-start gap-3">
                  <span className="text-2xl">{notification.icon}</span>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-1">{notification.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    notification.type === 'doctor' ? 'bg-yellow-100 text-yellow-800' :
                    notification.type === 'patient' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {notification.type}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">💬 Communication & Feedback</h3>
              <p className="text-gray-600 mb-4">Coordinate with other staff members or escalate issues to higher support levels.</p>
              <div className="flex gap-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  📨 Message Support Team
                </button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
                  🧾 View Support Logs
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  📝 Submit Feedback
                </button>
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
