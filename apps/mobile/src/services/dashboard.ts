import api from "@/lib/api";

export async function getDashboardStats() {
  const { data } = await api.get("/dashboard");
  return data;
}