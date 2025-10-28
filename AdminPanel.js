// src/pages/AdminPanel.js
import { useEffect, useState } from "react";
import API from "../api/api";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await API.get("/admin/users");
        const apptRes = await API.get("/appointments");
        setUsers(userRes.data);
        setAppointments(apptRes.data);
      } catch (err) {
        console.error("Error loading admin data");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container">
      <h2>Admin Panel</h2>
      <h3>Registered Users</h3>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name} ({u.role})</li>
        ))}
      </ul>
      <h3>All Appointments</h3>
      <ul>
        {appointments.map((a) => (
          <li key={a.appt_id}>
            {a.patient_id} → {a.provider_id} | {new Date(a.start_time).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
