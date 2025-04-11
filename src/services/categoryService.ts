import api from './api';
import { Category, TransactionType } from '../types';

// Buscar todas as categorias
export const getCategories = async (type?: TransactionType): Promise<Category[]> => {
  try {
    // Adicionar parâmetros de consulta se o tipo for fornecido
    const params = type ? { type } : {};
    
    // Buscar categorias da API
    const response = await api.get('/categories', { params });
    
    // Log para depuração
    console.log('Categorias recebidas da API:', response.data);
    
    // Verificar e normalizar IDs se necessário (alguns backends usam _id, outros usam id)
    const categories = response.data.map((category: any) => {
      // Certifique-se de que a categoria tenha um campo '_id' (normalização)
      if (!category._id && category.id) {
        category._id = category.id;
      }
      return category;
    });
    
    return categories;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }
};