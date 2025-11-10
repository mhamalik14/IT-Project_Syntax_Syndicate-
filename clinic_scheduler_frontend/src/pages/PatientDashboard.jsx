import React, { useEffect, useState } from "react";
import api from "../api/api";
import { getCurrentUser } from "../utils/auth";
import { Link } from "react-router-dom";

export default function PatientDashboard() {
  const user = getCurrentUser(); // get JWT-decoded user
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.id) {
      fetchAppointments();
    } else {
      console.warn("User not loaded or missing ID");
      setLoading(false);
    }
  }, [user]);

  const fetchAppointments = async () => {
    try {
      // ✅ No query params, backend gets user ID from JWT
      const res = await api.get("/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-10 text-gray-700">
        Please log in to access your dashboard.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading your appointments...
      </div>
    );
  }

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Your Appointments</h2>
        <Link to="/book" className="text-indigo-600 hover:underline">
          Book new
        </Link>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-gray-500">No appointments found.</div>
        ) : (
          appointments.map((a) => (
            <div key={a._id || a.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">
                    {a.clinicName || a.clinic?.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {a.date} • {a.timeSlot}
                  </div>
                  <div className="text-sm text-gray-600">
                    Doctor: {a.doctorName || a.doctor?.name || "TBD"}
                  </div>
                </div>
                <div className="text-sm text-gray-500">{a.status || "Booked"}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
