import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowUp, ArrowDown, Plus, Wallet, Loader } from 'lucide-react';
import MonthYearSelector from '../components/MonthYearSelector';
import { getTransactionSummary } from '../services/transactionService';
import { TransactionSummary } from '../types';
import { formatCurrency } from '../utils/formatters';

const Dashboard = () => {
  // Estado para armazenar o mês e ano selecionados
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Janeiro é 0, então somamos 1
  const [year, setYear] = useState(new Date().getFullYear());
  
  // Estado para armazenar os dados do resumo
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar o resumo das transações quando o mês ou ano mudar
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getTransactionSummary(month, year);
        setSummary(data);
      } catch (err: any) {
        console.error('Erro ao buscar resumo:', err);
        setError('Não foi possível carregar os dados do resumo. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [month, year]);

  // Renderizar o estado de carregamento
  if (loading) {
    return (
      <div className="container-app py-8">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader className="w-10 h-10 text-primary-500 animate-spin mb-4" />
          <p className="text-gray-500">Carregando seus dados financeiros...</p>
        </div>
      </div>
    );
  }

  // Renderizar mensagem de erro se houver
  if (error) {
    return (
      <div className="container-app py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
          <p className="text-red-700">{error}</p>
        </div>
        <div className="flex justify-center mt-4">
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Caso não haja transações no período
  if (summary && summary.totalExpenses === 0 && summary.totalIncomes === 0) {
    return (
      <div className="container-app py-8">
        <MonthYearSelector
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
        
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6 text-center">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">Sem transações no período</h2>
          <p className="text-gray-500 mb-6">
            Você ainda não registrou nenhuma transação para este mês.
          </p>
          <div className="flex justify-center">
            <Link to="/transactions/new" className="btn btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar transação
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      {/* Seletor de mês e ano */}
      <MonthYearSelector
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
      />

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Card de receitas */}
        <div className="card">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <ArrowUp className="w-5 h-5 text-success-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">Receitas</h3>
          </div>
          <p className="text-2xl font-semibold text-success-500">
            {formatCurrency(summary?.totalIncomes || 0)}
          </p>
        </div>

        {/* Card de despesas */}
        <div className="card">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
              <ArrowDown className="w-5 h-5 text-danger-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">Despesas</h3>
          </div>
          <p className="text-2xl font-semibold text-danger-500">
            {formatCurrency(summary?.totalExpenses || 0)}
          </p>
        </div>

        {/* Card de saldo */}
        <div className="card">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <Wallet className="w-5 h-5 text-primary-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">Saldo</h3>
          </div>
          <p className={`text-2xl font-semibold ${
            (summary?.balance || 0) >= 0 ? 'text-success-500' : 'text-danger-500'
          }`}>
            {formatCurrency(summary?.balance || 0)}
          </p>
        </div>
      </div>

      {/* Gráfico de despesas por categoria */}
      {summary && summary.expensesByCategory.length > 0 ? (
        <div className="card mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Despesas por Categoria</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gráfico de pizza */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="categoryName"
                  >
                    {summary.expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.categoryColor} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(name) => `Categoria: ${name}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Lista de categorias */}
            <div className="overflow-y-auto max-h-64">
              <ul className="space-y-3">
                {summary.expensesByCategory.map((category) => (
                  <li key={category.categoryId.toString()} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: category.categoryColor }}
                      />
                      <span className="text-sm text-gray-700">{category.categoryName}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(category.amount)}
                      </p>
                      <p className="text-xs text-gray-500">{category.percentage.toFixed(1)}%</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="card mt-6 text-center">
          <p className="text-gray-500">Sem despesas registradas neste período.</p>
        </div>
      )}

      {/* Botão para adicionar nova transação */}
      <div className="flex justify-end mt-6">
        <Link to="/transactions/new" className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;