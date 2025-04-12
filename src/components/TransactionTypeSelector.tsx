import { TransactionType } from '../types';

type Props = {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
};

const TransactionTypeSelector = ({ value, onChange }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Botão Despesa */}
      <button
        type="button"
        onClick={() => onChange(TransactionType.EXPENSE)}
        className={`btn flex items-center justify-center border rounded-md py-2 px-4 transition-all
          ${
            value === TransactionType.EXPENSE
              ? 'bg-red-100 border-red-500 text-red-700 font-medium'
              : 'bg-transparent border-red-300 text-red-500 hover:bg-red-50'
          }`}
      >
        Despesa
      </button>

      {/* Botão Receita */}
      <button
        type="button"
        onClick={() => onChange(TransactionType.INCOME)}
        className={`btn flex items-center justify-center border rounded-md py-2 px-4 transition-all
          ${
            value === TransactionType.INCOME
              ? 'bg-green-100 border-green-500 text-green-700 font-medium'
              : 'bg-transparent border-green-300 text-green-500 hover:bg-green-50'
          }`}
      >
        Receita
      </button>
    </div>
  );
};

export default TransactionTypeSelector;
