"use client";

import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/services/customer.service";

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
  });
}