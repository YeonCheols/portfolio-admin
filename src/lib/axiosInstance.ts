import axios from 'axios';
import { getAccessToken } from './auth';

const axiosInstance = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  baseURL: process.env.API_URL,
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async config => {
    const isEdge = process.env.NEXT_RUNTIME === 'edge';
    const dev = process.env.NODE_ENV === 'development';
    const accessToken = await getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    if (dev && !isEdge) {
      const https = require('https');
      config.httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });
    }
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
