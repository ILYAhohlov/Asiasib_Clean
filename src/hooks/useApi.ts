import { API_URL } from '../config';
import axios from 'axios';

export function useApi() {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  console.log('Creating API instance with baseURL:', API_URL);

  instance.interceptors.request.use(config => {
    console.log('Making request to:', config.url, 'with baseURL:', config.baseURL);
    return config;
  });

  instance.interceptors.response.use(
    response => {
      console.log('Received successful response:', response.status);
      return response;
    },
    error => {
      console.error('Request failed:', error.message, error.response?.data);
      throw error;
    }
  );

  return {
    login: async (password: string) => {
      const response = await instance.post('/api/auth/login', { password });
      return response.data;
    },
    // Add other API methods here as needed
  };
}
