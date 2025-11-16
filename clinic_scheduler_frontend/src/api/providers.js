import api from './api';

/**
 * Fetch providers list
 * @returns {Promise<Array>} providers
 */
export const fetchProviders = async () => {
  const res = await api.get('/providers/');
  return res.data;
};

/**
 * Add a new provider
 * @param {Object} providerData
 * @returns {Promise<any>} created provider
 */
export const addProvider = async (providerData) => {
  const res = await api.post('/providers/', providerData);
  return res.data;
};

export default { fetchProviders, addProvider };
