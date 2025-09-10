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
    try {
      const response = await api.post('/api/auth/login', { password });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Неверный пароль');
      }
      throw new Error('Ошибка сервера');
    }
  }
};
