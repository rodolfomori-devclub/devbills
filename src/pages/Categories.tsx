import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Check, X } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import Loading from '../components/Loading';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/categoryService';
import { Category, TransactionType } from '../types/';

const Categories = () => {
  // Estados para a lista de categorias
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para o formulário de categoria
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Omit<Category, '_id'>>({
    name: '',
    color: '#4F46E5',
    icon: 'tag',
    type: TransactionType.EXPENSE,
    userId: '', // Será preenchido pelo backend
  });
  const [editId, setEditId] = useState<string | null>(null);
  
  // Estados para operações
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Estados para filtro
  const [selectedType, setSelectedType] = useState<TransactionType | ''>('');

  // Buscar categorias
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getCategories(selectedType as TransactionType | undefined);
        setCategories(data);
      } catch (err: any) {
        console.error('Erro ao buscar categorias:', err);
        setError('Não foi possível carregar as categorias. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [selectedType]);

  // Abrir formulário para edição
  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon,
      type: category.type,
      userId: '', // Será fornecido pelo backend
    });
    setEditId(category._id);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      name: '',
      color: '#4F46E5',
      icon: 'tag',
      type: TransactionType.EXPENSE,
      userId: '',
    });
    setEditId(null);
    setIsEditing(false);
    setIsFormOpen(false);
  };

  // Manipular alterações no formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Enviar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      if (!formData.name) {
        setError('Nome da categoria é obrigatório');
        return;
      }
      
      let newCategory: Category;
      
      if (isEditing && editId) {
        // Atualizar categoria existente
        newCategory = await updateCategory(editId, {
          name: formData.name,
          color: formData.color,
          icon: formData.icon,
        });
        
        // Atualizar a lista de categorias
        setCategories(prev => prev.map(cat => 
          cat._id === editId ? newCategory : cat
        ));
      } else {
        // Criar nova categoria
        newCategory = await createCategory(formData);
        
        // Adicionar à lista de categorias
        setCategories(prev => [...prev, newCategory]);
      }
      
      // Resetar formulário
      resetForm();
    } catch (err: any) {
      console.error('Erro ao salvar categoria:', err);
      setError('Não foi possível salvar a categoria. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Excluir categoria
  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      setDeleteId(id);
      
      await deleteCategory(id);
      
      // Remover da lista
      setCategories(prev => prev.filter(cat => cat._id !== id));
    } catch (error) {
      console.error('Erro ao excluir categoria:', error);
      setError('Não foi possível excluir a categoria. Tente novamente.');
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  // Opções para filtro de tipo
  const typeOptions = [
    { value: '', label: 'Todos os tipos' },
    { value: TransactionType.EXPENSE, label: 'Despesas' },
    { value: TransactionType.INCOME, label: 'Receitas' },
  ];

  // Ícones disponíveis (simplificado para este exemplo)
  const iconOptions = [
    { value: 'tag', label: 'Tag' },
    { value: 'shopping-bag', label: 'Shopping Bag' },
    { value: 'home', label: 'Home' },
    { value: 'car', label: 'Car' },
    { value: 'heart', label: 'Heart' },
    { value: 'book', label: 'Book' },
    { value: 'music', label: 'Music' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'dollar-sign', label: 'Dollar' },
    { value: 'briefcase', label: 'Briefcase' },
    { value: 'package', label: 'Package' },
    { value: 'gift', label: 'Gift' },
  ];

  return (
    <div className="container-app py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Categorias</h1>
        <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <Select
            options={typeOptions}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as TransactionType | '')}
            fullWidth={false}
            className="md:w-48"
          />
          <Button
            onClick={() => setIsFormOpen(true)}
            disabled={isFormOpen}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Categoria
          </Button>
        </div>
      </div>

      {/* Formulário de categoria */}
      {isFormOpen && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Alimentação, Transporte, etc."
                required
              />
              
              <Select
                label="Tipo"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={[
                  { value: TransactionType.EXPENSE, label: 'Despesa' },
                  { value: TransactionType.INCOME, label: 'Receita' },
                ]}
                disabled={isEditing} // Não permitir alterar o tipo ao editar
              />
              
              <Input
                label="Cor"
                name="color"
                type="color"
                value={formData.color}
                onChange={handleChange}
              />
              
              <Select
                label="Ícone"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                options={iconOptions}
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
              >
                <Check className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de categorias */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loading text="Carregando categorias..." />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 mb-4">Nenhuma categoria encontrada.</p>
            {!isFormOpen && (
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Criar categoria
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          category.type === TransactionType.EXPENSE
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {category.type === TransactionType.EXPENSE ? 'Despesa' : 'Receita'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="text-primary-500 hover:text-primary-700"
                          title="Editar"
                          disabled={isFormOpen}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="text-red-500 hover:text-red-700"
                          title="Excluir"
                          disabled={isDeleting && deleteId === category._id}
                        >
                          {isDeleting && deleteId === category._id ? (
                            <Loading size="small" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;