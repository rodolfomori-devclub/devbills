import axios, { InternalAxiosRequestConfig } from 'axios';
import { firebaseAuth } from '../config/firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const user = firebaseAuth.currentUser;

  if (user) {
    const token = await user.getIdToken();

    // ✅ Método oficial e seguro para adicionar o header
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

export default api;
