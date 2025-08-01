import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
API.interceptors.request.use(
  config => {
    const user = JSON.parse(localStorage.getItem('leaveManagementUser'));
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('leaveManagementUser');
      window.location = '/';
    }
    return Promise.reject(error);
  }
);

export default API;