import { z } from "zod";

export const createServiceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Service name is required.")
    .max(100),

  category: z
    .string()
    .trim()
    .min(2)
    .max(50),

  description: z
    .string()
    .trim()
    .optional(),
});

export type CreateServiceDTO = z.infer<typeof createServiceSchema>;

export const updateServiceSchema = createServiceSchema.partial();
export type UpdateServiceDTO = z.infer<typeof updateServiceSchema>;