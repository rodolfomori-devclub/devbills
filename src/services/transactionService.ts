import api from './api';
import {
  Transaction,
  TransactionSummary,
  TransactionFilter,
} from '../types';

/**
 * Busca transações com filtros opcionais (mês, ano, tipo, categoria)
 * @param filter Filtros opcionais como month, year, type, categoryId
 * @returns Lista de transações do usuário
 */
export const getTransactions = async (
  filter?: Partial<TransactionFilter>
): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>('/transactions', {
    params: filter,
  });
  return response.data;
};

/**
 * Busca o resumo financeiro do mês e ano informados
 * @param month Mês numérico (1 a 12)
 * @param year Ano (ex: 2025)
 * @returns Totais de receitas, despesas e agrupamento por categoria
 */
export const getTransactionSummary = async (
  month: number,
  year: number
): Promise<TransactionSummary> => {
  const response = await api.get<TransactionSummary>('/transactions/summary', {
    params: { month, year },
  });
  return response.data;
};

/**
 * Cria uma nova transação no banco de dados
 * @param data Objeto com os dados da transação (sem _id, createdAt, updatedAt)
 * @returns A transação criada
 */
export const createTransaction = async (
  data: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>
): Promise<Transaction> => {
  const response = await api.post<Transaction>('/transactions', data);
  return response.data;
};

/**
 * Exclui uma transação pelo seu ID
 * @param id ID da transação a ser deletada
 */
export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};
