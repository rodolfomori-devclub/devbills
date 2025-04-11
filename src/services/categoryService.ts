import api from './api';
import { Category, TransactionType } from '../types';

// Buscar todas as categorias
export const getCategories = async (type?: TransactionType): Promise<Category[]> => {
  const params = type ? { type } : {};
  const response = await api.get('/categories', { params });
  return response.data;
};

// Criar uma nova categoria
export const createCategory = async (categoryData: Omit<Category, '_id'>): Promise<Category> => {
  const response = await api.post('/categories', categoryData);
  return response.data;
};

// Atualizar uma categoria
export const updateCategory = async (id: string, categoryData: Partial<Omit<Category, '_id' | 'type'>>): Promise<Category> => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};

// Excluir uma categoria
export const deleteCategory = async (id: string): Promise<void> => {
  await api.delete(`/categories/${id}`);
};