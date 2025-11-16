import api from './api';

/**
 * Fetch clinics list
 * @returns {Promise<Array>} clinics
 */
export const fetchClinics = async () => {
  const res = await api.get('/clinics/');
  return res.data;
};

/**
 * Add a new clinic
 * @param {Object} clinicData
 * @returns {Promise<any>} created clinic
 */
export const addClinic = async (clinicData) => {
  const res = await api.post('/clinics/', clinicData);
  return res.data;
};

export default { fetchClinics, addClinic };
