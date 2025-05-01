/**
 * Formata um valor numérico como moeda brasileira (BRL)
 * @param value Valor numérico
 * @returns Valor formatado como moeda
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formata uma data no padrão brasileiro (DD/MM/YYYY)
 * @param date Data em string ou objeto Date
 * @returns Data formatada como string
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
};

/**
 * Converte uma string para número decimal
 * @param value Texto vindo de um input numérico
 * @returns Valor numérico convertido (ou 0 se inválido)
 */
export const parseNumberInput = (value: string): number => {
  const cleanedValue = value.replace(/[^\d.]/g, '');
  return Number.parseFloat(cleanedValue) || 0;
};

// As funções truncateText e generateRandomColor foram removidas pois não eram utilizadas