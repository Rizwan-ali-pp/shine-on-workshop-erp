export interface Service {
  id: string;
  name: string;
  category: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceParams {
  q?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ServicePaginatedResponse {
  data: Service[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
