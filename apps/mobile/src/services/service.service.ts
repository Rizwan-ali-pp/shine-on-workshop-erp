import api from "@/lib/api";
import { Service, ServicePaginatedResponse, ServiceParams } from "@/types/service";

export async function getServices(params?: ServiceParams): Promise<ServicePaginatedResponse> {
  const { data } = await api.get("/services", { params });
  return data;
}

export async function createService(
  service: Omit<Service, "id" | "createdAt" | "updatedAt" | "isActive">
): Promise<Service> {
  const { data } = await api.post("/services", service);
  return data;
}

export async function updateService({
  id,
  data,
}: {
  id: string;
  data: Partial<Omit<Service, "id" | "createdAt" | "updatedAt" | "isActive">>;
}): Promise<Service> {
  const { data: responseData } = await api.patch(`/services/${id}`, data);
  return responseData;
}

export async function deleteService(id: string): Promise<void> {
  await api.delete(`/services/${id}`);
}
