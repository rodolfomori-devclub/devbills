import { ArrowUp, ArrowDown, Wallet, TrendingUp } from 'lucide-react';
import Card from '../components/Card';

const Dashboard = () => {
  // Dados mockados para demonstração
  const summary = {
    totalIncomes: 4500,
    totalExpenses: 2800,
    balance: 1700,
  };

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="container-app">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card de receitas */}
        <Card 
          icon={<ArrowUp size={20} />} 
          title="Receitas"
          hoverable
        >
          <p className="text-2xl font-semibold text-primary mt-2">
            {formatCurrency(summary.totalIncomes)}
          </p>
        </Card>

        {/* Card de despesas */}
        <Card 
          icon={<ArrowDown size={20} />} 
          title="Despesas"
          hoverable
        >
          <p className="text-2xl font-semibold text-red-500 mt-2">
            {formatCurrency(summary.totalExpenses)}
          </p>
        </Card>

        {/* Card de saldo */}
        <Card 
          icon={<Wallet size={20} />} 
          title="Saldo"
          hoverable
          glowEffect={summary.balance > 0}
        >
          <p className={`text-2xl font-semibold mt-2 ${
            summary.balance >= 0 ? 'text-primary' : 'text-red-500'
          }`}>
            {formatCurrency(summary.balance)}
          </p>
        </Card>
      </div>

      {/* Card de estatísticas */}
      <div className="mt-8">
        <Card 
          icon={<TrendingUp size={20} />}
          title="Resumo Financeiro" 
          subtitle="Análise mensal das suas finanças"
        >
          <div className="mt-4 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-dark">
              <span className="text-muted">Economia do mês</span>
              <span className={`font-medium ${summary.balance > 0 ? 'text-primary' : 'text-red-500'}`}>
                {Math.round((summary.balance / summary.totalIncomes) * 100)}%
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-dark">
              <span className="text-muted">Maior categoria de gasto</span>
              <span className="font-medium text-white">Alimentação</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-muted">Status mensal</span>
              <span className="px-2 py-1 text-xs font-medium bg-opacity-10 bg-primary text-primary rounded-full">
                Positivo
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Dica financeira */}
      <div className="mt-8 p-4 border border-primary border-opacity-30 rounded-lg bg-opacity-5 bg-primary">
        <h3 className="text-primary font-medium">💡 Dica financeira</h3>
        <p className="mt-2 text-sm text-muted">
          Ao economizar 20% da sua renda mensal, você conseguirá atingir metas financeiras mais rapidamente 
          e construir uma reserva de emergência sólida.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;