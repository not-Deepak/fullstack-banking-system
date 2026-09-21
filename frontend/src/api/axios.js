import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject Bearer token from localStorage if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bank_ledger_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle unauthenticated responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear expired token if necessary
      if (localStorage.getItem('bank_ledger_token')) {
        localStorage.removeItem('bank_ledger_token');
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
