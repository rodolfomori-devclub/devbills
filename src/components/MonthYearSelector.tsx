// src/components/MonthYearSelector.tsx
import type { FC } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthYearSelectorProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const MonthYearSelector: FC<MonthYearSelectorProps> = ({
  month,
  year,
  onMonthChange,
  onYearChange,
}) => {
  const monthNames: readonly string[] = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const handlePreviousMonth = (): void => {
    if (month === 1) {
      onMonthChange(12);
      onYearChange(year - 1);
    } else {
      onMonthChange(month - 1);
    }
  };

  const handleNextMonth = (): void => {
    if (month === 12) {
      onMonthChange(1);
      onYearChange(year + 1);
    } else {
      onMonthChange(month + 1);
    }
  };

  const currentYear = new Date().getFullYear();
  const years: number[] = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="flex items-center justify-between bg-card rounded-lg p-3 border border-dark">
      <button
        type="button"
        onClick={handlePreviousMonth}
        className="p-2 rounded-full hover:bg-lighter transition-colors text-muted hover:text-primary"
        aria-label="Mês anterior"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex space-x-2">
        <label className="sr-only" htmlFor="month-select">
          Selecionar mês
        </label>
        <select
          id="month-select"
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="bg-lighter border border-dark rounded-md py-1 px-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {monthNames.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="year-select">
          Selecionar ano
        </label>
        <select
          id="year-select"
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="bg-lighter border border-dark rounded-md py-1 px-3 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        onClick={handleNextMonth}
        className="p-2 rounded-full hover:bg-lighter transition-colors text-muted hover:text-primary"
        aria-label="Próximo mês"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default MonthYearSelector;
