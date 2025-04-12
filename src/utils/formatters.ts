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
  return parseFloat(cleanedValue) || 0;
};

/**
 * Gera uma cor aleatória em formato hexadecimal
 * @returns String com cor hexadecimal (ex: #3a4f9c)
 */
export const generateRandomColor = (): string => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

/**
 * Limita o tamanho de um texto e adiciona reticências (...)
 * @param text Texto original
 * @param maxLength Número máximo de caracteres
 * @returns Texto cortado com "..." no final, se necessário
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};
