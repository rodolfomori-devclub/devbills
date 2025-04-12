// Resumo por categoria
export interface CategorySummary {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  amount: number;
  percentage: number;
}

// Resumo geral do dashboard
export interface TransactionSummary {
  totalExpenses: number;
  totalIncomes: number;
  balance: number;
  expensesByCategory: CategorySummary[];
}

// Dados mensais para gráfico de barras
export interface MonthlyItem {
  name: string;
  expenses: number;
  income: number;
}
