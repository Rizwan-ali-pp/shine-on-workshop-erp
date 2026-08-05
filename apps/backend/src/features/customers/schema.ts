import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long."),

  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."),
});

export type CreateCustomerDTO = z.infer<typeof createCustomerSchema>;