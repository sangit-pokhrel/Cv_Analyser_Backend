import axios from 'axios';

const baseURL = 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('accessToken='))
    ?.split('=')[1];
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;