import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthYearSelectorProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const MonthYearSelector = ({ month, year, onMonthChange, onYearChange }: MonthYearSelectorProps) => {
  // Nomes dos meses em português
  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  // Navegar para o mês anterior
  const goToPreviousMonth = () => {
    if (month === 1) {
      // Se estamos em janeiro, voltar para dezembro do ano anterior
      onMonthChange(12);
      onYearChange(year - 1);
    } else {
      // Caso contrário, apenas voltar um mês
      onMonthChange(month - 1);
    }
  };

  // Navegar para o próximo mês
  const goToNextMonth = () => {
    if (month === 12) {
      // Se estamos em dezembro, avançar para janeiro do próximo ano
      onMonthChange(1);
      onYearChange(year + 1);
    } else {
      // Caso contrário, apenas avançar um mês
      onMonthChange(month + 1);
    }
  };

  // Gerar anos para o seletor (5 anos para trás e 5 para frente)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3">
      <button
        onClick={goToPreviousMonth}
        className="p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Mês anterior"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="flex space-x-2">
        <select
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          className="bg-gray-50 border border-gray-200 rounded-md py-1 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {monthNames.map((name, index) => (
            <option key={index} value={index + 1}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="bg-gray-50 border border-gray-200 rounded-md py-1 px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={goToNextMonth}
        className="p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Próximo mês"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default MonthYearSelector;