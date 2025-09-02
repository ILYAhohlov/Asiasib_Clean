import axios from 'axios';

const API_URL = 'https://asiasib.onrender.com';

console.log('Configuring API client with URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  login: async (password: string) => {
    console.log('Sending login request to:', `${API_URL}/api/auth/login`);
    const response = await api.post('/api/auth/login', { password });
    return response.data;
  }
};
