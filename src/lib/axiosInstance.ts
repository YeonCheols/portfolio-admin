import https from 'https';
import axios from 'axios';

const axiosInstance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  baseURL: process.env.API_URL,
  timeout: 10000,
  withCredentials: true,
  ...(process.env.NODE_ENV === 'development' && {
    httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  }),
});

// Request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // You can add auth token here if needed
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle errors here
    return Promise.reject(error);
  },
);

export default axiosInstance;
