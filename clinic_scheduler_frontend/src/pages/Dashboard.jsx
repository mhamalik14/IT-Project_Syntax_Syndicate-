import { useEffect, useState } from "react";
import API from "../api/api";
import AppointmentForm from "../components/AppointmentForm";

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get("/appointments/");
      setAppointments(data);
    } catch (err) {
      console.error("Error loading appointments");
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="container">
      <h2>My Appointments</h2>
      <AppointmentForm onBooked={fetchAppointments} />
      <div className="form-container">
        <h3>Your Appointments</h3>
        <ul>
          {appointments.map((a) => (
            <li key={a.appt_id}>
              <strong>{a.status}</strong> | {new Date(a.start_time).toLocaleString()} → {new Date(a.end_time).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
