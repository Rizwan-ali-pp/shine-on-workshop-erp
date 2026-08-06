import { Customer } from "./customer";
import { Vehicle } from "./vehicle";
import { Service } from "./service";

export type JobStatus =
  | "RECEIVED"
  | "INSPECTING"
  | "ESTIMATE_PREPARED"
  | "WAITING_APPROVAL"
  | "APPROVED"
  | "IN_PROGRESS"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

export interface JobServiceRelation {
  id: string;
  jobId: string;
  serviceId: string;
  service: Service;
  quotedPrice: number;
  notes?: string;
}

export interface Job {
  id: string;
  jobNumber: string;
  customerId: string;
  customer: Customer;
  vehicleId: string;
  vehicle: Vehicle;
  status: JobStatus;
  estimatedTotal: number;
  advanceAmount: number;
  expenseAmount: number;
  notes?: string;
  receivedAt: string;
  expectedDeliveryAt?: string;
  deliveredAt?: string;
  services: JobServiceRelation[];
  createdAt: string;
  updatedAt: string;
}

export interface JobParams {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface JobPaginatedResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
