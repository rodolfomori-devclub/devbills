import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import MonthYearSelector from '../components/MonthYearSelector';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import Card from '../components/Card';

// Exemplo de dados para demonstração
const mockTransactions = [
  {
    _id: '1',
    description: 'Salário',
    amount: 5000,
    date: '2025-04-05',
    type: 'income',
    category: { name: 'Receitas', color: '#10B981' }
  },
  {
    _id: '2',
    description: 'Aluguel',
    amount: 1200,
    date: '2025-04-10',
    type: 'expense',
    category: { name: 'Moradia', color: '#EF4444' }
  },
  {
    _id: '3',
    description: 'Supermercado',
    amount: 450,
    date: '2025-04-15',
    type: 'expense',
    category: { name: 'Alimentação', color: '#F59E0B' }
  },
  {
    _id: '4',
    description: 'Freelance',
    amount: 1500,
    date: '2025-04-20',
    type: 'income',
    category: { name: 'Freelance', color: '#37E359' }
  },
];

const Transactions = () => {
  // Estado para o mês e ano selecionados
  const [month, setMonth] = useState(4); // Abril
  const [year, setYear] = useState(2025);
  
  // Estado para os filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Formatação de moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Formatação de data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Filtrar transações
  const filteredTransactions = mockTransactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedType === '' || transaction.type === selectedType)
  );

  // Opções para filtro de tipo
  const typeOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: 'expense', label: 'Despesas' },
    { value: 'income', label: 'Receitas' },
  ];

  return (
    <div className="container-app py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">Transações</h1>
        <Link to="/transactions/new" className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Link>
      </div>

      {/* Seletor de mês e ano */}
      <MonthYearSelector
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
      />

      {/* Barra de busca e filtros */}
      <Card className="mt-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto flex-1">
            <Input
              placeholder="Buscar transação..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              fullWidth
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full md:w-auto"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </Button>
        </div>

        {/* Filtros avançados */}
        {showFilters && (
          <div className="mt-4">
            <Select
              label="Tipo"
              options={typeOptions}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            />
          </div>
        )}
      </Card>

      {/* Lista de transações */}
      <Card className="mt-6">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted mb-4">Nenhuma transação encontrada para o período selecionado.</p>
            <Link to="/transactions/new" className="btn btn-primary inline-flex">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar transação
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-dark">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-lighter transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {transaction.type === 'income' ? (
                            <ArrowUp className="w-4 h-4 text-primary" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-500" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-white">
                          {transaction.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: transaction.category.color }}
                        ></div>
                        <span className="text-sm text-muted">
                          {transaction.category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <span
                        className={
                          transaction.type === 'income'
                            ? 'text-primary'
                            : 'text-red-500'
                        }
                      >
                        {formatCurrency(transaction.amount)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          className="text-primary hover:text-primary/80 transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-400 transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Transactions;