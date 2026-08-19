import api from "@/lib/api";
import { Expense, ExpensePaginatedResponse, ExpenseParams } from "@/types/expense";

export async function getExpenses(params?: ExpenseParams): Promise<ExpensePaginatedResponse> {
  const { data } = await api.get("/expenses", { params });
  return data;
}

export async function createExpense(expenseData: {
  jobId?: string;
  category: string;
  amount: number;
  description?: string;
  paidTo?: string;
}): Promise<Expense> {
  const { data } = await api.post("/expenses", expenseData);
  return data;
}

export async function deleteExpense(id: string): Promise<void> {
  await api.delete(`/expenses/${id}`);
}
