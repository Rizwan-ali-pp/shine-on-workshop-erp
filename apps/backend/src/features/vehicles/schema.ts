import { z } from "zod";

export const createVehicleSchema = z.object({
  customerId: z.uuid(),

  registrationNumber: z
    .string()
    .trim()
    .min(4)
    .max(20),

  brand: z
    .string()
    .trim()
    .min(2)
    .max(50),

  model: z
    .string()
    .trim()
    .min(1)
    .max(50),
});

export type CreateVehicleDTO =
  z.infer<typeof createVehicleSchema>;