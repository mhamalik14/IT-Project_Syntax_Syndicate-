import React, { useEffect, useState } from "react";
import api from "../api/api";
import { getUserFromToken } from "../utils/auth";

const StaffDashboard = () => {
  const user = getUserFromToken();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
    // eslint-disable-next-line
  }, [user]);

  const loadAppointments = async () => {
    try {
      const res = await api.get(`/appointments/doctor/${user.user_id}`);
      setAppointments(res.data);
    } catch (err) {
      console.error("Error loading appointments:", err);
    }
  };

  if (!user) {
    return <div>Please log in to access your dashboard.</div>;
  }

  return (
    <div className="container">
      <div className="min-h-screen bg-green-50 flex flex-col items-center py-10 px-4">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Staff Dashboard</h1>
        <p className="text-gray-700 text-center mb-10 max-w-xl">
          Manage your daily schedule, view patient appointments, and update their visit statuses.
        </p>

        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Today's Appointments
          </h2>

          {appointments.length === 0 ? (
            <div className="text-gray-500 text-center py-6">
              No appointments assigned.
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((a) => (
                <div
                  key={a._id || a.id}
                  className="p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition duration-200"
                >
                  <div className="font-semibold text-green-700 text-lg">
                    {a.patientName || a.patient?.name || "Unknown Patient"}
                  </div>
                  <div className="text-sm text-gray-600">
                    {a.date} • {a.timeSlot} •{" "}
                    {a.clinicName || a.clinic?.name || "Clinic not specified"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
