import api from './api';

/**
 * Register a new user.
 * @param {Object} formData - { name, email, password, role, ... }
 * @returns {Promise<any>} - response data from the backend (UserOut or token info)
 */
export const registerUser = async (formData) => {
  const res = await api.post('/auth/register', formData);
  return res.data;
};

/**
 * Login a user and store token in localStorage when present.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<any>} response data
 */
export const loginUser = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  // Normalize token placement and persist
  const token = res?.data?.access_token ?? res?.data?.token ?? res?.access_token ?? res?.token;
  if (token) {
    localStorage.setItem('token', token);
  }
  return res.data;
};

/**
 * Fetch the current user's profile from the backend.
 * Backend should use the JWT to identify the user.
 * @returns {Promise<any>} user profile
 */
export const getProfile = async () => {
  const res = await api.get('/auth/profile');
  return res.data;
};

/**
 * Update the current user's profile.
 * @param {Object} updates - fields to update
 * @returns {Promise<any>} updated profile
 */
export const updateProfile = async (updates) => {
  const res = await api.put('/auth/profile', updates);
  return res.data;
};

export default { registerUser, loginUser };
