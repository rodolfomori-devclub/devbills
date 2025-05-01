export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat("pt-BR").format(dateObj);
};

export const parseNumberInput = (value: string): number => {
  const cleanedValue = value.replace(/[^\d.]/g, "");
  return Number.parseFloat(cleanedValue) || 0;
};
