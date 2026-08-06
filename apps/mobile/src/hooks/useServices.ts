import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "@/services/service.service";
import { ServiceParams } from "@/types/service";

export function useServices(params?: ServiceParams) {
  return useQuery({
    queryKey: ["services", params],
    queryFn: () => getServices(params),
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}
