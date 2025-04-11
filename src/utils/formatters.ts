/**
 * Formata um valor numérico como moeda (BRL)
 */
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };
  
  /**
   * Formata uma data no formato brasileiro (DD/MM/YYYY)
   */
  export const formatDate = (date: Date | string): string => {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    return new Intl.DateTimeFormat('pt-BR').format(dateObj);
  };
  
  /**
   * Converte um valor em string para número
   */
  export const parseNumberInput = (value: string): number => {
    // Remove caracteres não numéricos, exceto ponto decimal
    const cleanedValue = value.replace(/[^\d.]/g, '');
    return parseFloat(cleanedValue) || 0;
  };
  
  /**
   * Gera uma cor aleatória em formato hexadecimal
   */
  export const generateRandomColor = (): string => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  };
  
  /**
   * Limita um texto a um número máximo de caracteres
   */
  export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  };