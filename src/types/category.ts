import type { TransactionType } from "./transaction";

// Tipagem da Categoria
export interface Category {
  _id?: string; // MongoDB
  id?: string; // Prisma
  name: string;
  color: string;
  icon: string;
  type: TransactionType;
}
