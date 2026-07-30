import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const msg = (error.response.data?.message || '').toLowerCase();
      if (
        status === 401 ||
        msg.includes('token') ||
        msg.includes('authorized') ||
        msg.includes('auth') ||
        msg.includes('login')
      ) {
        localStorage.removeItem('token');
        if (error.response.data) {
          error.response.data.message = 'Please login';
        } else {
          error.response = {
            ...error.response,
            data: { message: 'Please login' },
          };
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
