// src/pages/TransactionForm.tsx
import type { FC, ChangeEvent, FormEvent } from "react";
import { useState, useEffect, useId } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, DollarSign, Tag, Save, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Loading from "../components/Loading";
import Card from "../components/Card";
import TransactionTypeSelector from "../components/TransactionTypeSelector";

import { getCategories } from "../services/categoryService";
import { createTransaction } from "../services/transactionService";
import type { Category, CreateTransactionDTO } from "../types";
import { TransactionType } from "../types";

interface FormData {
  description: string;
  amount: string;
  date: string;
  categoryId: string;
  type: TransactionType;
}

const TransactionForm: FC = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const typeFieldId = useId();

  const initialFormData: FormData = {
    description: "",
    amount: "",
    date: today,
    categoryId: "",
    type: TransactionType.EXPENSE,
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async (): Promise<void> => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Erro ao carregar categorias:", err);
        setError("Erro ao carregar categorias");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((category) => category.type === formData.type);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type: TransactionType): void => {
    setFormData((prev) => ({ ...prev, type, categoryId: "" }));
  };

  const validateForm = (): boolean => {
    if (!formData.description || !formData.amount || !formData.date || !formData.categoryId) {
      setError("Todos os campos são obrigatórios");
      return false;
    }

    if (Number.parseFloat(formData.amount) <= 0) {
      setError("O valor deve ser maior que zero");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError(null);

      if (!validateForm()) {
        setSubmitting(false);
        return;
      }

      const transactionData: CreateTransactionDTO = {
        description: formData.description,
        amount: Number.parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
        categoryId: formData.categoryId,
        type: formData.type,
      };

      await createTransaction(transactionData);
      toast.success("Transação criada com sucesso!");
      navigate("/transactions");
    } catch (err) {
      console.error("Erro ao salvar transação:", err);
      setError("Não foi possível salvar a transação.");
      toast.error("Erro ao criar transação");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    navigate("/transactions");
  };

  if (loading) {
    return (
      <div className="container-app py-8">
        <div className="flex justify-center py-12">
          <Loading size="large" text="Carregando formulário..." />
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
            <div
              className="bg-danger bg-opacity-10 border border-danger border-opacity-20 rounded-xl p-4 mb-6 flex items-start"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 text-danger mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-danger">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor={typeFieldId} className="label">
                Tipo de Transação
              </label>
              <TransactionTypeSelector
                id={typeFieldId}
                value={formData.type}
                onChange={handleTypeChange}
              />
            </div>

            <Input
              label="Descrição"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ex: Supermercado, Salário, etc."
              required
            />

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

            <Input
              label="Data"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              icon={<Calendar className="w-4 h-4 text-muted" />}
              required
            />

            <Select
              label="Categoria"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              options={[
                { value: "", label: "Selecione uma categoria" },
                ...filteredCategories.map((category) => ({
                  value: category._id ?? category.id ?? "",
                  label: category.name,
                })),
              ]}
              icon={<Tag className="w-4 h-4 text-muted" />}
              required
            />

            <div className="flex justify-end space-x-3 mt-6">
              <Button type="button" variant="outline" onClick={handleCancel} disabled={submitting}>
                Cancelar
              </Button>
              <Button
                type="submit"
                variant={formData.type === TransactionType.EXPENSE ? "danger" : "success"}
                isLoading={submitting}
                disabled={submitting || filteredCategories.length === 0}
              >
                <Save className="w-4 h-4 mr-2" />
                {submitting ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default TransactionForm;
