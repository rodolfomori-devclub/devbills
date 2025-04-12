import api from './api';
import { Category, TransactionType } from '../types';

/**
 * Busca todas as categorias da API.
 * Pode receber um filtro opcional por tipo de transação ('expense' ou 'income').
 * 
 * @param type (opcional) Tipo da categoria para filtrar
 * @returns Lista de categorias
 */
export const getCategories = async (
  type?: TransactionType
): Promise<Category[]> => {
  try {
    // ✅ Criação segura dos parâmetros da query string
    const params: { type?: TransactionType } = {};
    if (type) {
      params.type = type;
    }

    // ✅ Tipagem da resposta com Category[]
    const response = await api.get<Category[]>('/categories', { params });

    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar categorias:', error);
    throw error;
  }
};
