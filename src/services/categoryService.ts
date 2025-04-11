
import api from './api';
import { Category, TransactionType } from '../types';

// Buscar todas as categorias
export const getCategories = async (type?: TransactionType): Promise<Category[]> => {
  try {
    const params = type ? { type } : {};
    const response = await api.get('/categories', { params });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
};
