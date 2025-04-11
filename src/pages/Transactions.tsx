import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, ArrowUp, ArrowDown, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import MonthYearSelector from '../components/MonthYearSelector';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import Loading from '../components/Loading';
import { getTransactions, deleteTransaction } from '../services/transactionService';
import { Transaction } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

const Transactions = () => {
  // Estado para o mês e ano selecionados
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  
  // Estado para a busca
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado para as transações
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estado para controlar exclusão
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Função para obter o ID da transação
  const getTransactionId = (transaction: any): string | undefined => {
    // Verifica se existe transaction._id
    if (transaction._id) {
      return transaction._id;
    }
    
    // Verifica se existe transaction.id
    if (transaction.id) {
      return transaction.id;
    }
    
    return undefined;
  };

  // Buscar transações
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getTransactions({ month, year });
        console.log("Transações carregadas:", data);
        setTransactions(data);
      } catch (err: any) {
        console.error('Erro ao buscar transações:', err);
        setError('Não foi possível carregar as transações');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [month, year]);

  // Filtrar transações com base na busca
  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Excluir transação
  const handleDelete = async (id: string) => {
    try {
      if (!id) {
        console.error("Tentativa de excluir transação com ID undefined");
        toast.error("Erro: ID da transação não encontrado");
        return;
      }
      
      console.log("Excluindo transação com ID:", id);
      setDeletingId(id);
      
      await deleteTransaction(id);
      
      // Atualizar a lista após exclusão
      setTransactions(prevTransactions => 
        prevTransactions.filter(transaction => {
          const transactionId = getTransactionId(transaction);
          return transactionId !== id;
        })
      );
      
      toast.success('Transação excluída com sucesso');
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      toast.error('Erro ao excluir transação');
    } finally {
      setDeletingId(null);
    }
  };

  // Confirmação de exclusão
  const confirmDelete = (transaction: Transaction) => {
    const id = getTransactionId(transaction);
    
    if (!id) {
      toast.error("Não foi possível excluir: ID não encontrado");
      return;
    }
    
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      handleDelete(id);
    }
  };

  // Função para obter o nome e a cor da categoria
  const getCategoryInfo = (transaction: any) => {
    // Se categoryId for um objeto, já temos as informações da categoria
    if (typeof transaction.categoryId === 'object' && transaction.categoryId !== null) {
      return {
        name: transaction.categoryId.name || 'Sem nome',
        color: transaction.categoryId.color || '#999999'
      };
    }
    
    // Se categoryId for um ID mas temos category, usamos category
    if (transaction.category) {
      return {
        name: transaction.category.name || 'Sem nome',
        color: transaction.category.color || '#999999'
      };
    }
    
    // Se não temos nenhuma informação válida
    return {
      name: 'Categoria não encontrada',
      color: '#999999'
    };
  };

  return (
    <div className="container-app py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Transações</h1>
        <Link to="/transactions/new" className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Link>
      </div>

      {/* Seletor de mês e ano */}
      <div className="mb-6">
        <MonthYearSelector
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </div>

      {/* Barra de busca simplificada */}
      <Card className="mb-6">
        <div className="w-full">
          <Input
            placeholder="Buscar transação..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="w-4 h-4" />}
            fullWidth
          />
        </div>
      </Card>

      {/* Lista de transações */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loading text="Carregando transações..." />
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-muted mb-2">{error}</p>
            <Button onClick={() => window.location.reload()} variant="primary">
              Tentar novamente
            </Button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
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
                {filteredTransactions.map((transaction) => {
                  const transactionId = getTransactionId(transaction);
                  const categoryInfo = getCategoryInfo(transaction);
                  
                  return (
                    <tr key={transactionId || Math.random().toString()} className="hover:bg-lighter transition-colors">
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
                            style={{ backgroundColor: categoryInfo.color }}
                          ></div>
                          <span className="text-sm text-muted">
                            {categoryInfo.name}
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
                        <button
                          onClick={() => confirmDelete(transaction)}
                          className="text-red-500 hover:text-red-400 transition-colors p-2 rounded-full hover:bg-red-500 hover:bg-opacity-10"
                          title="Excluir"
                          disabled={deletingId === transactionId}
                        >
                          {deletingId === transactionId ? (
                            <span className="inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></span>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Transactions;