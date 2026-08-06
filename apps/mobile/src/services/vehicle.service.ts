import api from "@/lib/api";
import { Vehicle, VehiclePaginatedResponse, VehicleParams } from "@/types/vehicle";

export async function getVehicles(params?: VehicleParams): Promise<VehiclePaginatedResponse> {
  const { data } = await api.get("/vehicles", { params });
  return data;
}

export async function createVehicle(
  vehicle: Omit<Vehicle, "id" | "createdAt" | "updatedAt" | "customer">
): Promise<Vehicle> {
  const { data } = await api.post("/vehicles", vehicle);
  return data;
}

export async function updateVehicle({
  id,
  data,
}: {
  id: string;
  data: Partial<Omit<Vehicle, "id" | "createdAt" | "updatedAt" | "customer">>;
}): Promise<Vehicle> {
  const { data: responseData } = await api.patch(`/vehicles/${id}`, data);
  return responseData;
}

export async function deleteVehicle(id: string): Promise<void> {
  await api.delete(`/vehicles/${id}`);
}
