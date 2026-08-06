import api from "@/lib/api";
import { Customer } from "@/types/customer";

export async function getCustomers(): Promise<Customer[]> {
  const { data } = await api.get("/customers");
  return data;
}