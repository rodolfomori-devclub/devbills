// src/components/TransactionTypeSelector.tsx
import type { FC } from "react";
import { TransactionType } from "../types";

interface TransactionTypeSelectorProps {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
  id?: string;
}

const TransactionTypeSelector: FC<TransactionTypeSelectorProps> = ({ value, onChange, id }) => {
  const transactionTypes = [
    {
      type: TransactionType.EXPENSE,
      label: "Despesa",
      activeClasses: "bg-red-100 border-red-500 text-red-700 font-medium",
      inactiveClasses: "bg-transparent border-red-300 text-red-500 hover:bg-red-50",
    },
    {
      type: TransactionType.INCOME,
      label: "Receita",
      activeClasses: "bg-green-100 border-green-500 text-green-700 font-medium",
      inactiveClasses: "bg-transparent border-green-300 text-green-500 hover:bg-green-50",
    },
  ];

  return (
    <fieldset id={id} className="grid grid-cols-2 gap-4" aria-label="Tipo de transação">
      <legend className="sr-only">Tipo de transação</legend>

      {transactionTypes.map((item) => (
        <button
          key={item.type}
          type="button"
          onClick={() => onChange(item.type)}
          className={`btn flex items-center justify-center border rounded-md py-2 px-4 transition-all
            ${value === item.type ? item.activeClasses : item.inactiveClasses}`}
          aria-pressed={value === item.type}
        >
          {item.label}
        </button>
      ))}
    </fieldset>
  );
};

export default TransactionTypeSelector;
