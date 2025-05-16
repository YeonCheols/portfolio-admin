import axios from 'axios';
import https from 'https';

const axiosInstance = axios.create({
  baseURL: process.env.API_URL,
  timeout: 10000,
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
