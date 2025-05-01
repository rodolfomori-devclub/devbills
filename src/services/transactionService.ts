import api from "./api";
import type { Transaction, TransactionSummary, TransactionFilter } from "../types";

export const getTransactions = async (
  filter?: Partial<TransactionFilter>,
): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>("/transactions", {
    params: filter,
  });
  return response.data;
};

export const getTransactionSummary = async (
  month: number,
  year: number,
): Promise<TransactionSummary> => {
  const response = await api.get<TransactionSummary>("/transactions/summary", {
    params: { month, year },
  });
  return response.data;
};

export const createTransaction = async (
  data: Omit<Transaction, "_id" | "createdAt" | "updatedAt">,
): Promise<Transaction> => {
  const response = await api.post<Transaction>("/transactions", data);
  return response.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};
