export interface Vehicle {
  id: string;
  customerId: string;
  customer?: {
    name: string;
    phone: string;
  };
  registrationNumber: string;
  brand: string;
  model: string;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleParams {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface VehiclePaginatedResponse {
  data: Vehicle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
