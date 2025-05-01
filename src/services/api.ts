// src/services/api.ts
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from "axios";
import axios from "axios";
import { firebaseAuth } from "../config/firebase";

/**
 * Instância do axios configurada com URL base da API
 */
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000, // timeout padrão de 10 segundos
});

/**
 * Interceptor para adicionar o token de autenticação em cada requisição
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const user = firebaseAuth.currentUser;

    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.set("Authorization", `Bearer ${token}`);
      } catch (error) {
        console.error("Erro ao obter token de autenticação:", error);
      }
    }

    return config;
  },
  (error: AxiosError): Promise<never> => {
    return Promise.reject(error);
  },
);

/**
 * Interceptor para tratamento de erros nas respostas
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError): Promise<never> => {
    // Log de erro em desenvolvimento
    if (import.meta.env.DEV) {
      console.error("Erro na requisição:", {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  },
);

export default api;
