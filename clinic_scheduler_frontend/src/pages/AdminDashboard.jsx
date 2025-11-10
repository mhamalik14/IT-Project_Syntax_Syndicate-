import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">Admin Dashboard</h1>
      <p className="text-gray-700 text-center mb-10 max-w-xl">
        Manage clinics, users, and system settings.
      </p>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Admin Panel
        </h2>
        <p className="text-gray-600">Admin functionality to be implemented.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
