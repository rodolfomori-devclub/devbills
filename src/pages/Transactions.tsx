import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import dayjs from 'dayjs';
import MonthYearSelector from '../components/MonthYearSelector';
import Input from '../components/Input';
import Select from '../components/Select';
import Loading from '../components/Loading';
import Button from '../components/Button';
import { getTransactions, deleteTransaction } from '../services/transactionService';
import { getCategories } from '../services/categoryService';
import { Transaction, Category, TransactionType } from '../types';
import { formatCurrency } from '../utils/formatters';

const Transactions = () => {
  // Estado para o mês e ano selecionados
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  
  // Estado para os filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Estado para os dados
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para controlar a exclusão
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Buscar transações e categorias
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Construir os parâmetros de filtro
        const params: any = { month, year };
        if (selectedType) params.type = selectedType;
        if (selectedCategory) params.categoryId = selectedCategory;
        
        // Buscar transações com os filtros aplicados
        const transactionsData = await getTransactions(params);
        
        // Buscar todas as categorias
        const categoriesData = await getCategories();
        
        setTransactions(transactionsData);
        setCategories(categoriesData);
      } catch (err: any) {
        console.error('Erro ao buscar dados:', err);
        setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [month, year, selectedType, selectedCategory]);

  // Filtragem de transações pelo termo de busca
  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler para excluir uma transação
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      setDeleteId(id);
      
      await deleteTransaction(id);
      
      // Atualizar a lista removendo a transação excluída
      setTransactions(prevTransactions => 
        prevTransactions.filter(transaction => transaction._id !== id)
      );
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      setError('Não foi possível excluir a transação. Tente novamente.');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Renderizar o ícone adequado ao tipo da transação
  const renderTypeIcon = (type: TransactionType) => {
    if (type === TransactionType.INCOME) {
      return <ArrowUp className="w-4 h-4 text-success-500" />;
    }
    return <ArrowDown className="w-4 h-4 text-danger-500" />;
  };

  // Opções para o filtro de tipo
  const typeOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: TransactionType.EXPENSE, label: 'Despesas' },
    { value: TransactionType.INCOME, label: 'Receitas' },
  ];

  // Opções para o filtro de categoria
  const categoryOptions = [
    { value: '', label: 'Todas as categorias' },
    ...categories.map(category => ({
      value: category._id,
      label: category.name,
    })),
  ];

  return (
    <div className="container-app py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Transações</h1>
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
      <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
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
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Tipo"
              options={typeOptions}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            />
            <Select
              label="Categoria"
              options={categoryOptions}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Lista de transações */}
      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loading text="Carregando transações..." />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{error}</p>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              className="mt-2"
            >
              Tentar novamente
            </Button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500 mb-4">Nenhuma transação encontrada para o período selecionado.</p>
            <Link to="/transactions/new" className="btn btn-primary inline-flex">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar transação
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descrição
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => {
                    // Verificar se categoryId é uma string ou um objeto
                    const category = typeof transaction.categoryId === 'string'
                      ? categories.find(cat => cat._id === transaction.categoryId)
                      : transaction.categoryId as Category;
                    
                    return (
                      <tr key={transaction._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="mr-2">
                              {renderTypeIcon(transaction.type)}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {transaction.description}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dayjs(transaction.date).format('DD/MM/YYYY')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category && (
                            <div className="flex items-center">
                              <div
                                className="w-2 h-2 rounded-full mr-2"
                                style={{ backgroundColor: category.color }}
                              ></div>
                              <span className="text-sm text-gray-500">
                                {category.name}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right">
                          <span
                            className={
                              transaction.type === TransactionType.INCOME
                                ? 'text-success-500'
                                : 'text-danger-500'
                            }
                          >
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/transactions/edit/${transaction._id}`}
                              className="text-primary-500 hover:text-primary-700"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(transaction._id)}
                              className="text-red-500 hover:text-red-700"
                              title="Excluir"
                              disabled={isDeleting && deleteId === transaction._id}
                            >
                              {isDeleting && deleteId === transaction._id ? (
                                <Loading size="small" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;