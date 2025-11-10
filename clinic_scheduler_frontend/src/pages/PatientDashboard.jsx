import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { getUserFromToken } from '../utils/auth';
import { Link } from 'react-router-dom';

export default function PatientDashboard() {
  const user = getUserFromToken();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      const res = await api.get(`/appointments/user/${user.user_id}`);
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return <div>Please log in to access your dashboard.</div>;
  }

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Appointments</h2>
        <Link to="/book" className="text-indigo-600">Book new</Link>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 && <div className="text-gray-500">No appointments found.</div>}
        {appointments.map(a => (
          <div key={a._id || a.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{a.clinicName || a.clinic?.name}</div>
                <div className="text-sm text-gray-600">{a.date} • {a.timeSlot}</div>
                <div className="text-sm text-gray-600">Doctor: {a.doctorName || a.doctor?.name || 'TBD'}</div>
              </div>
              <div className="text-sm text-gray-500">{a.status || 'Booked'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
