export interface ExpenseJobRelation {
  jobNumber: string;
  customer: {
    name: string;
  };
}

export interface Expense {
  id: string;
  jobId: string;
  job?: ExpenseJobRelation;
  category: string;
  amount: number;
  description?: string;
  paidTo?: string;
  createdAt: string;
}

export interface ExpenseParams {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ExpensePaginatedResponse {
  data: Expense[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
