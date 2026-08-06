import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPayments, createPayment } from "@/services/payment.service";
import { PaymentParams } from "@/types/payment";

export function usePayments(params?: PaymentParams) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => getPayments(params),
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      // Invalidate jobs as well since a payment affects a job's paid total
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
