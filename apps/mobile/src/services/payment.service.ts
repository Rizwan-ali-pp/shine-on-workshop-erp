import api from "@/lib/api";
import { Payment, PaymentPaginatedResponse, PaymentParams } from "@/types/payment";

export async function getPayments(params?: PaymentParams): Promise<PaymentPaginatedResponse> {
  const { data } = await api.get("/payments", { params });
  return data;
}

export async function createPayment(paymentData: {
  jobId: string;
  amount: number;
  method: "CASH" | "UPI" | "CARD";
  type: "ADVANCE" | "PARTIAL" | "FINAL";
  notes?: string;
}): Promise<Payment> {
  const { data } = await api.post("/payments", paymentData);
  return data;
}
