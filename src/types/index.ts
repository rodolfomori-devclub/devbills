// Tipos de transação
export enum TransactionType {
  EXPENSE = 'expense',  // Despesa
  INCOME = 'income'     // Receita
}

// Interface para Categoria
export interface Category {
  _id?: string;
  id?: string;
  name: string;
  color: string;
  icon: string;
  type: TransactionType;
}

// Interface para Transação
export interface Transaction {
  _id?: string;
  id?: string;
  description: string;
  amount: number;
  date: string | Date;
  categoryId: string | Category;
  type: TransactionType;
  createdAt?: string;
  updatedAt?: string;
}

// Interface para o resumo de transações
export interface TransactionSummary {
  totalExpenses: number;
  totalIncomes: number;
  balance: number;
  expensesByCategory: {
    categoryId: string;
    categoryName: string;
    categoryColor: string;
    amount: number;
    percentage: number;
  }[];
}

// Interface para o filtro de transações
export interface TransactionFilter {
  month: number;
  year: number;
  categoryId?: string;
  type?: TransactionType;
}

// Interface para o estado de autenticação
export interface AuthState {
  user: {
    uid: string;
    displayName: string | null;
    email: string | null;
    photoURL: string | null;
  } | null;
  loading: boolean;
  error: string | null;
}