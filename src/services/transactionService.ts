import api from './api';
import { Transaction, TransactionSummary, TransactionFilter } from '../types';

// Buscar transações
export const getTransactions = async (filter?: Partial<TransactionFilter>): Promise<Transaction[]> => {
  const response = await api.get('/transactions', { params: filter });
  return response.data;
};

// Buscar resumo de transações
export const getTransactionSummary = async (month: number, year: number): Promise<TransactionSummary> => {
  const response = await api.get('/transactions/summary', {
    params: { month, year }
  });
  return response.data;
};

// Criar transação
export const createTransaction = async (data: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
  const response = await api.post('/transactions', data);
  return response.data;
};

// Excluir transação
export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};