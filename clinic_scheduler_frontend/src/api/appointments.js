import api from './api';

/**
 * Fetch appointments with optional query params.
 * @param {Object} params - query params for filtering (e.g., { doctorId, date })
 * @returns {Promise<Array>} array of appointments
 */
export const fetchAppointments = async (params) => {
  const res = await api.get('/appointments/', { params });
  return res.data;
};

/**
 * Fetch appointments for a specific staff/doctor if staffId provided, otherwise fetch all.
 * @param {string|number} staffId
 * @returns {Promise<Array>}
 */
export const fetchStaffAppointments = async (staffId) => {
  if (staffId) {
    const res = await api.get(`/appointments/doctor/${staffId}`);
    return res.data;
  }
  const res = await api.get('/appointments/');
  return res.data;
};

/**
 * Update appointment status. Uses PUT with status as query param to match backend contract.
 * @param {string|number} apptId
 * @param {string} newStatus
 * @returns {Promise<any>} response data
 */
export const updateStatus = async (apptId, newStatus) => {
  const res = await api.put(`/appointments/${apptId}/status`, null, {
    params: { status: newStatus },
  });
  return res.data;
};

export default { fetchAppointments, fetchStaffAppointments, updateStatus };
