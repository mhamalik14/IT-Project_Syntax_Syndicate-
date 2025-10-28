import { useState } from "react";
import API from "../api/api";

export default function AppointmentForm({ onBooked }) {
  const [form, setForm] = useState({
    clinic_id: "",
    room_id: "",
    patient_id: "",
    provider_id: "",
    start_time: "",
    end_time: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/appointments/", form);
      alert("Appointment booked!");
      onBooked(data);
    } catch (err) {
      alert(err.response?.data?.detail || "Error booking appointment");
    }
  };
    if (!form.clinic_id || !form.patient_id || !form.start_time || !form.end_time) {
  alert("Please fill in all required fields.");
  return;
} 

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Clinic ID" onChange={(e) => setForm({ ...form, clinic_id: e.target.value })} />
      <input placeholder="Room ID" onChange={(e) => setForm({ ...form, room_id: e.target.value })} />
      <input placeholder="Patient ID" onChange={(e) => setForm({ ...form, patient_id: e.target.value })} />
      <input placeholder="Provider ID" onChange={(e) => setForm({ ...form, provider_id: e.target.value })} />
      <label>Start Time:</label>
      <input type="datetime-local" onChange={(e) => setForm({ ...form, start_time: e.target.value })} />
      <label>End Time:</label>
      <input type="datetime-local" onChange={(e) => setForm({ ...form, end_time: e.target.value })} />
      <button type="submit">Book Appointment</button>
    </form>
  );
}

