// src/services/categoryService.ts
import type { AxiosResponse, AxiosError } from "axios";
import api from "./api";
import type { Category } from "../types";
import type { TransactionType } from "../types";

/**
 * Busca todas as categorias da API.
 * @param type Tipo da categoria para filtrar (opcional)
 * @returns Promise com lista de categorias
 */
export const getCategories = async (type?: TransactionType): Promise<Category[]> => {
  try {
    const params: Record<string, TransactionType | undefined> = {};
    if (type !== undefined) {
      params.type = type;
    }

    const response: AxiosResponse<Category[]> = await api.get("/categories", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    throw error;
  }
};

/**
 * Busca uma categoria específica pelo ID
 * @param id ID da categoria
 * @returns Promise com a categoria encontrada ou null
 */
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const response: AxiosResponse<Category> = await api.get(`/categories/${id}`);
    return response.data;
  } catch (error) {
    // Retorna null se a categoria não existir (erro 404)
    const apiError = error as AxiosError;
    if (apiError.response?.status === 404) {
      return null;
    }
    console.error("Erro ao buscar categoria por ID:", error);
    throw error;
  }
};
