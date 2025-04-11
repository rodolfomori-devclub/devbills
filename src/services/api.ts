import axios from 'axios';
import { auth } from '../config/firebase';

// Criar uma instância do axios com URL base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptador para adicionar o token de autenticação a todas as requisições
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default api;