import api from './api';
import { Transaction, TransactionSummary, TransactionFilter } from '../types';

// Buscar todas as transações com filtragem opcional
export const getTransactions = async (filter?: Partial<TransactionFilter>): Promise<Transaction[]> => {
  const response = await api.get('/transactions', { params: filter });
  return response.data;
};

// Buscar o resumo das transações por mês
export const getTransactionSummary = async (month: number, year: number): Promise<TransactionSummary> => {
  const response = await api.get('/transactions/summary', {
    params: { month, year }
  });
  return response.data;
};

// Criar uma nova transação
export const createTransaction = async (transactionData: Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
  const response = await api.post('/transactions', transactionData);
  return response.data;
};

// Atualizar uma transação
export const updateTransaction = async (id: string, transactionData: Partial<Omit<Transaction, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Transaction> => {
  const response = await api.put(`/transactions/${id}`, transactionData);
  return response.data;
};

// Excluir uma transação
export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};