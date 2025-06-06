// src/pages/Transactions.tsx
import type { FC, ChangeEvent } from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, ArrowUp, ArrowDown, Trash2, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

import MonthYearSelector from "../components/MonthYearSelector";
import Input from "../components/Input";
import Button from "../components/Button";
import Card from "../components/Card";
import Loading from "../components/Loading";

import { getTransactions, deleteTransaction } from "../services/transactionService";
import type { Category, Transaction } from "../types";
import { TransactionType } from "../types";
import { formatCurrency, formatDate } from "../utils/formatters";

interface CategoryInfo {
  name: string;
  color: string;
}

const Transactions: FC = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");
        const data = await getTransactions({ month, year });
        setTransactions(data);
      } catch (err) {
        console.error("Erro ao buscar transações:", err);
        setError("Não foi possível carregar as transações");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [month, year]);

  const filteredTransactions = transactions.filter((t) =>
    t.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      if (!id) {
        toast.error("ID inválido");
        return;
      }

      setDeletingId(id);
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => (t._id || t.id) !== id));
      toast.success("Transação excluída com sucesso");
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      toast.error("Erro ao excluir transação");
    } finally {
      setDeletingId(null);
    }
  };

  const confirmDelete = (transaction: Transaction): void => {
    const id = transaction._id || transaction.id;
    if (!id) {
      toast.error("ID não encontrado");
      return;
    }

    if (window.confirm("Tem certeza que deseja excluir esta transação?")) {
      handleDelete(id);
    }
  };

  const getCategoryInfo = (transaction: Transaction): CategoryInfo => {
    if (typeof transaction.categoryId === "object" && transaction.categoryId !== null) {
      const category = transaction.categoryId as Category;

      return {
        name: category.name ?? "Sem nome",
        color: category.color ?? "#999999",
      };
    }

    if (transaction.category) {
      return {
        name: transaction.category.name ?? "Sem nome",
        color: transaction.category.color ?? "#999999",
      };
    }

    return {
      name: "Categoria não encontrada",
      color: "#999999",
    };
  };

  const handleReload = (): void => {
    window.location.reload();
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

      <div className="mb-6">
        <MonthYearSelector
          month={month}
          year={year}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </div>

      <Card className="mb-6">
        <Input
          placeholder="Buscar transação..."
          value={searchTerm}
          onChange={handleSearchChange}
          icon={<Search className="w-4 h-4" />}
          fullWidth
        />
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loading size="medium" text="Carregando transações..." />
          </div>
        ) : error ? (
          <div className="p-8 text-center" role="alert">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-muted mb-2">{error}</p>
            <Button onClick={handleReload} variant="primary">
              Tentar novamente
            </Button>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted mb-4">Nenhuma transação encontrada.</p>
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider"
                  >
                    Descrição
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider"
                  >
                    Data
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider"
                  >
                    Categoria
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider"
                  >
                    Valor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider"
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark">
                {filteredTransactions.map((transaction) => {
                  const id = transaction._id || transaction.id;
                  const categoryInfo = getCategoryInfo(transaction);

                  return (
                    <tr key={id} className="hover:bg-lighter transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="mr-2">
                            {transaction.type === TransactionType.INCOME ? (
                              <ArrowUp className="w-4 h-4 text-primary" aria-label="Receita" />
                            ) : (
                              <ArrowDown className="w-4 h-4 text-red-500" aria-label="Despesa" />
                            )}
                          </div>
                          <span className="text-sm font-medium text-white">
                            {transaction.description}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted whitespace-nowrap">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-2 h-2 rounded-full mr-2"
                            style={{ backgroundColor: categoryInfo.color }}
                            aria-hidden="true"
                          />
                          <span className="text-sm text-muted">{categoryInfo.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                        <span
                          className={
                            transaction.type === TransactionType.INCOME
                              ? "text-primary"
                              : "text-red-500"
                          }
                        >
                          {formatCurrency(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => confirmDelete(transaction)}
                          className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-red-500 hover:bg-opacity-10 transition"
                          title="Excluir"
                          aria-label={`Excluir transação ${transaction.description}`}
                          disabled={deletingId === id}
                        >
                          {deletingId === id ? (
                            <span
                              className="inline-block w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"
                              aria-hidden="true"
                            />
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
