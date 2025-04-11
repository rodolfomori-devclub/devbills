import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Wallet, TrendingUp, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import Card from '../components/Card';
import MonthYearSelector from '../components/MonthYearSelector';
import { getTransactionSummary, getTransactions } from '../services/transactionService';
import { formatCurrency } from '../utils/formatters';
import Loading from '../components/Loading';
import dayjs from 'dayjs';

const Dashboard = () => {
  // Estado para controlar mês e ano selecionados
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  
  // Estado para armazenar dados do dashboard
  const [summary, setSummary] = useState({
    totalIncomes: 0,
    totalExpenses: 0,
    balance: 0,
    expensesByCategory: []
  });

  // Estado para dados do gráfico de histórico mensal
  const [monthlyData, setMonthlyData] = useState([]);
  
  // Estado para controlar carregamento
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cores para o gráfico de pizza
  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8AC926', '#1982C4'];

  // Buscar dados do resumo do mês atual
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getTransactionSummary(month, year);
        setSummary(data);
      } catch (err) {
        console.error('Erro ao buscar resumo:', err);
        setError('Não foi possível carregar os dados financeiros');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [month, year]);

  // Buscar dados históricos para o gráfico de barras
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const currentDate = new Date(year, month - 1, 1);
        const data = [];
        
        // Buscar dados dos últimos 6 meses
        for (let i = 0; i < 6; i++) {
          const date = new Date(currentDate);
          date.setMonth(date.getMonth() - i);
          
          const monthNum = date.getMonth() + 1;
          const yearNum = date.getFullYear();
          
          // Buscar as transações deste mês
          const transactions = await getTransactions({ 
            month: monthNum, 
            year: yearNum 
          });
          
          // Calcular totais
          let monthlyExpenses = 0;
          let monthlyIncome = 0;
          
          transactions.forEach(transaction => {
            if (transaction.type === 'expense') {
              monthlyExpenses += transaction.amount;
            } else {
              monthlyIncome += transaction.amount;
            }
          });
          
          // Formatar o nome do mês
          const monthName = dayjs().month(date.getMonth()).format('MMM');
          
          data.unshift({
            name: `${monthName}/${yearNum}`,
            expenses: monthlyExpenses,
            income: monthlyIncome
          });
        }
        
        setMonthlyData(data);
      } catch (err) {
        console.error('Erro ao buscar dados históricos:', err);
      }
    };

    fetchHistoricalData();
  }, [month, year]);

  // Formatador de valor para o tooltip do gráfico
  const formatTooltipValue = (value) => {
    return formatCurrency(value);
  };

  // Renderização condicional durante carregamento
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
        
        {/* Seletor de mês e ano */}
        <div className="w-full md:w-auto">
          <MonthYearSelector
            month={month}
            year={year}
            onMonthChange={setMonth}
            onYearChange={setYear}
          />
        </div>
      </div>
      
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Card de saldo */}
        <Card 
          icon={<Wallet size={20} />} 
          title={
            <div className="flex items-center gap-2">
              <Wallet size={16} />
              <span>Saldo</span>
            </div>
          }
          hoverable
          glowEffect={summary.balance > 0}
        >
          <p className={`text-2xl font-semibold mt-2 ${
            summary.balance >= 0 ? 'text-primary' : 'text-red-500'
          }`}>
            {formatCurrency(summary.balance)}
          </p>
        </Card>

        {/* Card de receitas */}
        <Card 
          icon={<ArrowUp size={20} />} 
          title={
            <div className="flex items-center gap-2">
              <ArrowUp size={16} />
              <span>Receitas</span>
            </div>
          }
          hoverable
        >
          <p className="text-2xl font-semibold text-primary mt-2">
            {formatCurrency(summary.totalIncomes)}
          </p>
        </Card>

        {/* Card de despesas */}
        <Card 
          icon={<ArrowDown size={20} />} 
          title={
            <div className="flex items-center gap-2">
              <ArrowDown size={16} />
              <span>Despesas</span>
            </div>
          }
          hoverable
        >
          <p className="text-2xl font-semibold text-red-500 mt-2">
            {formatCurrency(summary.totalExpenses)}
          </p>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de despesas por categoria */}
        <Card 
          icon={<TrendingUp size={20} />} 
          title="Despesas por Categoria"
          className="min-h-80"
        >
          {summary.expensesByCategory && summary.expensesByCategory.length > 0 ? (
            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={summary.expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    nameKey="categoryName"
                    label={({ categoryName, percent }) => `${categoryName}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {summary.expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.categoryColor || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
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

        {/* Gráfico de histórico financeiro mensal */}
        <Card 
          icon={<Calendar size={20} />} 
          title="Histórico Mensal"
          className="min-h-80"
        >
          <div className="h-64 mt-4">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#94A3B8" />
                  <YAxis stroke="#94A3B8" tickFormatter={(value) => value} />
                  <Tooltip 
                    formatter={formatTooltipValue}
                    contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#2A2A2A' }}
                    labelStyle={{ color: '#F8F9FA' }}
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

      {/* Dica financeira */}
      <div className="p-4 border border-primary border-opacity-30 rounded-xl bg-primary bg-opacity-5">
        <h3 className="text-primary font-medium flex items-center gap-2">
          <span className="bg-primary bg-opacity-20 p-2 rounded-full">💡</span>
          Dica financeira
        </h3>
        <p className="mt-2 text-sm text-muted">
          Ao economizar 20% da sua renda mensal, você conseguirá atingir metas financeiras mais rapidamente 
          e construir uma reserva de emergência sólida.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;