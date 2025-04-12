import { Category } from './category';

// Enum para tipo de transação
export enum TransactionType {
  EXPENSE = 'expense',
  INCOME = 'income',
}

// Transação completa
export interface Transaction {
  _id?: string;
  id?: string;
  description: string;
  amount: number;
  date: string | Date;
  categoryId: string;
  type: TransactionType;
  createdAt?: string;
  updatedAt?: string;
  category?: Category;
}

// DTO para criar transação
export interface CreateTransactionDTO {
  description: string;
  amount: number;
  date: string | Date;
  categoryId: string;
  type: TransactionType;
}

// Filtros opcionais
export interface TransactionFilter {
  month: number;
  year: number;
  categoryId?: string;
  type?: TransactionType;
}
