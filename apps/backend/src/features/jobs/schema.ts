import { z } from "zod";

export const createJobSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  vehicleRegistration: z.string().min(1, "Vehicle registration is required"),
  vehicleBrand: z.string().optional(),
  vehicleModel: z.string().optional(),

  estimatedTotal: z.number().positive(),

  advanceAmount: z.number().min(0).default(0),

  expectedDeliveryAt: z.string().datetime().optional(),

  notes: z.string().trim().optional(),

  services: z
    .array(
      z.object({
        serviceId: z.string().uuid(),

        quotedPrice: z.number().positive(),

        notes: z.string().trim().optional(),
      }),
    )
    .min(1, "At least one service is required."),
});

export const updateJobSchema = z.object({
  status: z.enum([
    "RECEIVED",
    "INSPECTING",
    "ESTIMATE_PREPARED",
    "WAITING_APPROVAL",
    "APPROVED",
    "IN_PROGRESS",
    "READY",
    "DELIVERED",
    "CANCELLED",
  ]),
});

export type UpdateJobDTO = z.infer<typeof updateJobSchema>;
export type CreateJobDTO = z.infer<typeof createJobSchema>;
