import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExpenses, createExpense } from "@/services/expense.service";
import { ExpenseParams } from "@/types/expense";

export function useExpenses(params?: ExpenseParams) {
  return useQuery({
    queryKey: ["expenses", params],
    queryFn: () => getExpenses(params),
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      // Invalidate jobs as well since an expense affects a job's financials
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      // Invalidate specific job if it is open in the details view
      queryClient.invalidateQueries({ queryKey: ["job"] });
    },
  });
}
