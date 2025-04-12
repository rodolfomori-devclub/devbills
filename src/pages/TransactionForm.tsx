import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Tag, Save, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Loading from '../components/Loading';
import Card from '../components/Card';
import TransactionTypeSelector from '../components/TransactionTypeSelector';

import { getCategories } from '../services/categoryService';
import { createTransaction } from '../services/transactionService';
import { Category, CreateTransactionDTO, TransactionType } from '../types';

type FormData = {
  description: string;
  amount: string;
  date: string;
  categoryId: string;
  type: TransactionType;
};

const TransactionForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    type: TransactionType.EXPENSE,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setError('Erro ao carregar categorias');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(
    (category) => category.type === formData.type
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      if (
        !formData.description ||
        !formData.amount ||
        !formData.date ||
        !formData.categoryId
      ) {
        setError('Todos os campos são obrigatórios');
        return;
      }

      const transactionData: CreateTransactionDTO = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
        categoryId: formData.categoryId,
        type: formData.type,
      };

      await createTransaction(transactionData);
      toast.success('Transação criada com sucesso!');
      navigate('/transactions');
    } catch (err) {
      console.error('Erro ao salvar transação:', err);
      setError('Não foi possível salvar a transação.');
      toast.error('Erro ao criar transação');
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
        <h1 className="text-2xl font-bold mb-6">Nova Transação</h1>

        <Card>
          {error && (
            <div className="bg-danger bg-opacity-10 border border-danger border-opacity-20 rounded-xl p-4 mb-6 flex items-start">
              <AlertCircle className="w-5 h-5 text-danger mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-danger">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Tipo */}
            <div className="mb-4">
              <label className="label">Tipo de Transação</label>
              <TransactionTypeSelector
                value={formData.type}
                onChange={(type) =>
                  setFormData((prev) => ({ ...prev, type, categoryId: '' }))
                }
              />
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
              icon={<DollarSign className="w-4 h-4 text-muted" />}
              required
            />

            {/* Data */}
            <Input
              label="Data"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              icon={<Calendar className="w-4 h-4 text-muted" />}
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
                ...filteredCategories.map((category) => ({
                  value: category._id ?? category.id ?? '',
                  label: category.name,
                })),
              ]}
              icon={<Tag className="w-4 h-4 text-muted" />}
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
                variant={
                  formData.type === TransactionType.EXPENSE
                    ? 'danger'
                    : 'success'
                }
                isLoading={submitting}
                disabled={submitting || filteredCategories.length === 0}
              >
                <Save className="w-4 h-4 mr-2" />
                {submitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default TransactionForm;
