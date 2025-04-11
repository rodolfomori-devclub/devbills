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
  try {
    // Garantir que os dados estão formatados corretamente
    // Especialmente importante para a data - garantir que é enviada corretamente
    const formattedData = {
      description: transactionData.description,
      amount: Number(transactionData.amount),
      date: transactionData.date, // Mantemos o ISO string recebido do componente
      categoryId: transactionData.categoryId,
      type: transactionData.type
    };
    
    // Log para depuração
    console.log('Enviando dados de transação:', formattedData);
    
    const response = await api.post('/transactions', formattedData);
    return response.data;
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    if (error.response && error.response.data && error.response.data.error) {
      console.error('Mensagem de erro do servidor:', error.response.data.error);
    }
    throw error;
  }
};

// Excluir uma transação
export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    // Validar se o ID existe
    if (!id) {
      throw new Error('ID da transação não fornecido');
    }
    
    // Log para depuração
    console.log(`Excluindo transação com ID: ${id}`);
    
    // Chamar a API para excluir a transação
    await api.delete(`/transactions/${id}`);
    
    console.log(`Transação ${id} excluída com sucesso`);
  } catch (error) {
    console.error(`Erro ao excluir transação (ID: ${id}):`, error);
    throw error;
  }
};