// src/pages/ProviderView.js
import { useEffect, useState } from "react";
import API from "../api/api";

export default function ProviderView() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchProviderAppointments = async () => {
      try {
        const { data } = await API.get("/appointments/provider");
        setAppointments(data);
      } catch (err) {
        console.error("Error loading provider appointments");
      }
    };
    fetchProviderAppointments();
  }, []);

  return (
    <div className="container">
      <h2>Provider Schedule</h2>
      <ul>
        {appointments.map((a) => (
          <li key={a.appt_id}>
            Patient: {a.patient_id} | {new Date(a.start_time).toLocaleString()} → {new Date(a.end_time).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
