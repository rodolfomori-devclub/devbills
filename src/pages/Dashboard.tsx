import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown, Wallet, TrendingUp, Calendar } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

import Card from "../components/Card";
import MonthYearSelector from "../components/MonthYearSelector";
import Loading from "../components/Loading";

import { getTransactionSummary, getTransactions } from "../services/transactionService";
import { formatCurrency } from "../utils/formatters";
import { GRAPH_COLORS } from "../utils/colors";

import type { TransactionSummary, MonthlyItem, Transaction, CategorySummary } from "../types";

import dayjs from "dayjs";

const Dashboard = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [summary, setSummary] = useState<TransactionSummary>({
    totalIncomes: 0,
    totalExpenses: 0,
    balance: 0,
    expensesByCategory: [],
  });

  const [monthlyData, setMonthlyData] = useState<MonthlyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadMonthlySummary = async (): Promise<void> => {
      try {
        setLoading(true);
        const summaryData: TransactionSummary = await getTransactionSummary(month, year);
        setSummary(summaryData);
      } catch (error: unknown) {
        console.error("Erro ao carregar resumo:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMonthlySummary();
  }, [month, year]);

  useEffect(() => {
    const loadHistoricalTransactions = async (): Promise<void> => {
      try {
        const baseDate = new Date(year, month - 1, 1);
        const history: MonthlyItem[] = [];

        for (let i = 0; i < 6; i++) {
          const date = new Date(baseDate);
          date.setMonth(baseDate.getMonth() - i);

          const monthNumber = date.getMonth() + 1;
          const yearNumber = date.getFullYear();

          const transactions: Transaction[] = await getTransactions({
            month: monthNumber,
            year: yearNumber,
          });

          const income = transactions
            .filter((t) => t.type === "income")
            .reduce((sum, t) => sum + t.amount, 0);

          const expenses = transactions
            .filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + t.amount, 0);

          const formattedMonth = dayjs().month(date.getMonth()).format("MMM");

          history.unshift({
            name: `${formattedMonth}/${yearNumber}`,
            income,
            expenses,
          });
        }

        setMonthlyData(history);
      } catch (error: unknown) {
        console.error("Erro ao carregar histórico:", error);
      }
    };

    loadHistoricalTransactions();
  }, [month, year]);

  const formatTooltipValue = (value: number): string => formatCurrency(value);

  if (loading) {
    return (
      <div className="container-app py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <Loading text="Carregando dados financeiros..." />
      </div>
    );
  }

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>
        <MonthYearSelector
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card
          icon={<Wallet size={20} className="text-primary" />}
          title="Saldo"
          hoverable
          glowEffect={summary.balance > 0}
        >
          <p
            className={`text-2xl font-semibold mt-2 ${summary.balance >= 0 ? "text-primary" : "text-red-500"}`}
          >
            {formatCurrency(summary.balance)}
          </p>
        </Card>
        <Card icon={<ArrowUp size={20} className="text-primary" />} title="Receitas" hoverable>
          <p className="text-2xl font-semibold text-primary mt-2">
            {formatCurrency(summary.totalIncomes)}
          </p>
        </Card>
        <Card icon={<ArrowDown size={20} className="text-primary" />} title="Despesas" hoverable>
          <p className="text-2xl font-semibold text-red-500 mt-2">
            {formatCurrency(summary.totalExpenses)}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card icon={<TrendingUp size={20} />} title="Despesas por Categoria" className="min-h-80">
          {summary.expensesByCategory.length > 0 ? (
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.expensesByCategory}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="amount"
                    nameKey="categoryName"
                    label={({
                      categoryName,
                      percent,
                    }: {
                      categoryName: string;
                      percent: number;
                    }) => `${categoryName}: ${(percent * 100).toFixed(1)}%`}
                  >
                    {summary.expensesByCategory.map((entry: CategorySummary) => (
                      <Cell
                        key={entry.categoryName}
                        fill={
                          entry.categoryColor ||
                          GRAPH_COLORS[Math.floor(Math.random() * GRAPH_COLORS.length)]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatTooltipValue} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted">
              Nenhuma despesa registrada neste período
            </div>
          )}
        </Card>

        <Card
          icon={<Calendar size={20} className="text-primary" />}
          title="Histórico Mensal"
          className="min-h-80"
        >
          <div className="h-64 mt-4">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" />
                  <Tooltip
                    formatter={formatTooltipValue}
                    contentStyle={{
                      backgroundColor: "#1A1A1A",
                      borderColor: "#2A2A2A",
                    }}
                    labelStyle={{ color: "#F8F9FA" }}
                  />
                  <Legend />
                  <Bar dataKey="expenses" name="Despesas" fill="#FF6384" />
                  <Bar dataKey="income" name="Receitas" fill="#37E359" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted">
                Carregando histórico financeiro...
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
