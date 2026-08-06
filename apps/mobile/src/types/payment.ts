export type PaymentMethod = "CASH" | "UPI" | "CARD";
export type PaymentType = "ADVANCE" | "PARTIAL" | "FINAL";

export interface PaymentJobRelation {
  jobNumber: string;
  customer: {
    name: string;
    phone: string;
  };
}

export interface Payment {
  id: string;
  jobId: string;
  job?: PaymentJobRelation;
  amount: number;
  method: PaymentMethod;
  type: PaymentType;
  notes?: string;
  createdAt: string;
}

export interface PaymentParams {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaymentPaginatedResponse {
  data: Payment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
