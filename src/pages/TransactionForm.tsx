import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, DollarSign, Tag, Save, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Loading from '../components/Loading';
import Card from '../components/Card';
import { getCategories } from '../services/categoryService';
import { createTransaction } from '../services/transactionService';

const TransactionForm = () => {
  const navigate = useNavigate();
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    type: 'expense',
  });

  // Estados de UI
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Carregar categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setError('Não foi possível carregar as categorias.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filtrar categorias pelo tipo selecionado
  const filteredCategories = categories.filter(
    category => category.type === formData.type
  );

  // Handler de alteração de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler de envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);

      // Validações básicas
      if (!formData.description || !formData.amount || !formData.date || !formData.categoryId) {
        setError('Todos os campos são obrigatórios');
        return;
      }

      const transactionData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
        categoryId: formData.categoryId,
        type: formData.type
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
            {/* Tipo de transação */}
            <div className="mb-4">
              <label className="label">Tipo de Transação</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`btn flex items-center justify-center ${
                    formData.type === 'expense'
                      ? 'bg-danger text-white font-medium'
                      : 'bg-transparent border border-danger text-danger'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'expense', categoryId: '' }))}
                >
                  <span>Despesa</span>
                </button>

                <button
                  type="button"
                  className={`btn flex items-center justify-center ${
                    formData.type === 'income'
                      ? 'bg-success text-white font-medium'
                      : 'bg-transparent border border-success text-success'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, type: 'income', categoryId: '' }))}
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
                  value: category._id || category.id,
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
                variant={formData.type === 'expense' ? 'danger' : 'success'}
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