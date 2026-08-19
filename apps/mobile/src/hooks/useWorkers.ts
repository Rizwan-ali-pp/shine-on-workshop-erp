import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useWorkers() {
  return useQuery({
    queryKey: ["workers"],
    queryFn: async () => {
      const { data } = await api.get("/workers");
      return data;
    },
  });
}

export function useWorker(id: string) {
  return useQuery({
    queryKey: ["worker", id],
    queryFn: async () => {
      const { data } = await api.get(`/workers/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateWorker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (workerData: { name: string; phone?: string }) => {
      const { data } = await api.post("/workers", workerData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
}

export function useDeleteWorker() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/workers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });
}

export function useCreateLaborLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (logData: { workerId: string; amount: number; jobId?: string; notes?: string }) => {
      const { data } = await api.post("/labor-logs", logData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
      queryClient.invalidateQueries({ queryKey: ["worker", variables.workerId] });
    },
  });
}

export function useDeleteLaborLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: string, workerId: string }) => {
      await api.delete(`/labor-logs/${data.id}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workers"] });
      queryClient.invalidateQueries({ queryKey: ["worker", variables.workerId] });
    },
  });
}
