import { API_URL } from '../config';
import axios from 'axios';

export function useApi() {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });



  instance.interceptors.request.use(config => {

    return config;
  });

  instance.interceptors.response.use(
    response => {

      return response;
    },
    error => {

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
