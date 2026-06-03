// INTERFACE =>TO DEFINE THE STRUCTURE
export interface Expense {
  id: number; // ID =>UNIQUE INDENTITY
  date: string;
  category: string;
  description: string;
  amount: number;
}

export interface ExpenseListResponse {
  items: Expense[];
  total: number;
}


