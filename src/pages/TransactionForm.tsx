import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Calendar, DollarSign, Tag, Save } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Loading from '../components/Loading';
import { getCategories } from '../services/categoryService';
import { getTransactions, createTransaction, updateTransaction } from '../services/transactionService';
import { Category, Transaction, TransactionType } from '../types';

const TransactionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  // Estado do formulário
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: '',
    categoryId: '',
    type: TransactionType.EXPENSE,
  });

  // Estados de UI
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar categorias e transação (se estiver editando)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar categorias
        const categoriesData = await getCategories();
        setCategories(categoriesData);

        // Se estiver editando, buscar a transação
        if (isEditing && id) {
          const transactions = await getTransactions();
          const transaction = transactions.find(t => t._id === id);

          if (transaction) {
            // Formatar a data para o formato yyyy-MM-dd
            const date = new Date(transaction.date);
            const formattedDate = date.toISOString().split('T')[0];

            setFormData({
              description: transaction.description,
              amount: transaction.amount.toString(),
              date: formattedDate,
              categoryId: typeof transaction.categoryId === 'string'
                ? transaction.categoryId
                : transaction.categoryId._id,
              type: transaction.type,
            });
          } else {
            setError('Transação não encontrada');
          }
        } else {
          // Se estiver criando, inicializar com a data atual
          const today = new Date().toISOString().split('T')[0];
          setFormData(prev => ({ ...prev, date: today }));
        }
      } catch (err: any) {
        console.error('Erro ao carregar dados:', err);
        setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditing]);

  // Atualizar o formulário quando o tipo mudar para limpar a categoria
  useEffect(() => {
    setFormData(prev => ({ ...prev, categoryId: '' }));
  }, [formData.type]);

  // Filtrar categorias pelo tipo selecionado
  const filteredCategories = categories.filter(
    category => category.type === formData.type
  );

  // Handler de alteração de inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler de envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);

      // Validar formulário
      if (!formData.description || !formData.amount || !formData.date || !formData.categoryId) {
        setError('Preencha todos os campos obrigatórios');
        return;
      }

      // Preparar os dados
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
      };

      // Criar ou atualizar a transação
      if (isEditing && id) {
        await updateTransaction(id, transactionData);
      } else {
        await createTransaction(transactionData);
      }

      // Navegar de volta para a lista de transações
      navigate('/transactions');
    } catch (err: any) {
      console.error('Erro ao salvar transação:', err);
      setError('Não foi possível salvar a transação. Tente novamente mais tarde.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container-app py-8">
        <div className="flex justify-center py-12">
          <Loading text="Carregando formulário..." />
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditing ? 'Editar Transação' : 'Nova Transação'}
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            {/* Tipo de transação */}
            <div className="mb-4">
              <label className="label">Tipo de Transação</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`btn flex items-center justify-center ${
                    formData.type === TransactionType.EXPENSE
                      ? 'bg-danger-500 text-white'
                      : 'btn-outline'
                  }`}
                  onClick={() =>
                    setFormData(prev => ({ ...prev, type: TransactionType.EXPENSE }))
                  }
                >
                  <span>Despesa</span>
                </button>
                <button
                  type="button"
                  className={`btn flex items-center justify-center ${
                    formData.type === TransactionType.INCOME
                      ? 'bg-success-500 text-white'
                      : 'btn-outline'
                  }`}
                  onClick={() =>
                    setFormData(prev => ({ ...prev, type: TransactionType.INCOME }))
                  }
                >
                  <span>Receita</span>
                </button>
              </div>
            </div>

            {/* Descrição */}
            <Input
              label="Descrição"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ex: Supermercado, Salário, etc."
              required
            />

            {/* Valor */}
            <Input
              label="Valor"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0,00"
              icon={<DollarSign className="w-4 h-4" />}
              required
            />

            {/* Data */}
            <Input
              label="Data"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              icon={<Calendar className="w-4 h-4" />}
              required
            />

            {/* Categoria */}
            <Select
              label="Categoria"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              options={[
                { value: '', label: 'Selecione uma categoria' },
                ...filteredCategories.map(category => ({
                  value: category._id,
                  label: category.name,
                })),
              ]}
              icon={<Tag className="w-4 h-4" />}
              required
            />

            {/* Botões */}
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/transactions')}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant={formData.type === TransactionType.EXPENSE ? 'danger' : 'success'}
                isLoading={submitting}
              >
                <Save className="w-4 h-4 mr-2" />
                {submitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;