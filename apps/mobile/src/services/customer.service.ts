import api from "@/lib/api";
import { Customer, CustomerPaginatedResponse, CustomerParams } from "@/types/customer";

export async function getCustomers(params?: CustomerParams): Promise<CustomerPaginatedResponse> {
  const { data } = await api.get("/customers", { params });
  return data;
}

export async function createCustomer(customerData: { name: string; phone: string }): Promise<Customer> {
  const { data } = await api.post("/customers", customerData);
  return data;
}

export async function updateCustomer(id: string, customerData: { name?: string; phone?: string }): Promise<Customer> {
  const { data } = await api.patch(`/customers/${id}`, customerData);
  return data;
}

export async function deleteCustomer(id: string): Promise<Customer> {
  const { data } = await api.delete(`/customers/${id}`);
  return data;
}