import { Expense } from "./expense.model";


export interface CategoryBreakdown {
  category: string;
  amount: number;
}

export interface DashboardSummary {
  total_expense: number;
  expense_count: number;
  highest_expense: number;
  top_category: string;
  current_month_total: number;

  recent_expenses: Expense[];

  category_breakdown: CategoryBreakdown[];
}