import { API_URL } from '../config';
import axios from 'axios';

// Singleton axios instance
const apiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Setup interceptors once
apiInstance.interceptors.request.use(config => {
  return config;
});

apiInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    throw error;
  }
);

export function useApi() {
  return {
    login: async (password: string) => {
      const response = await apiInstance.post('/api/auth/login', { password });
      return response.data;
    },
    // Add other API methods here as needed
  };
}
