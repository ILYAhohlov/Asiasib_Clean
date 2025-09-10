import axios from 'axios';

const API_URL = 'https://asiasib-clean.onrender.com';



const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = {
  login: async (password: string) => {

    const response = await api.post('/api/auth/login', { password });
    return response.data;
  }
};
