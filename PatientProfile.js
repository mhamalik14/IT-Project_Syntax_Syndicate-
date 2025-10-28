// src/pages/PatientProfile.js
import { useEffect, useState } from "react";
import API from "../api/api";

export default function PatientProfile() {
  const [profile, setProfile] = useState({});
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const profileRes = await API.get("/user/me");
        const apptRes = await API.get("/appointments/patient");
        setProfile(profileRes.data);
        setAppointments(apptRes.data);
      } catch (err) {
        console.error("Error loading patient profile");
      }
    };
    fetchPatientData();
  }, []);

  return (
    <div className="container">
      <h2>Patient Profile</h2>
      <p><strong>Name:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <h3>My Appointments</h3>
      <ul>
        {appointments.map((a) => (
          <li key={a.appt_id}>
            {new Date(a.start_time).toLocaleString()} → {new Date(a.end_time).toLocaleString()} | {a.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
