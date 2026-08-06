import { z } from "zod";

export const createExpenseSchema = z.object({
  jobId: z.string().uuid(),

  category: z
    .string()
    .trim()
    .min(2)
    .max(100),

  amount: z.number().positive(),

  description: z
    .string()
    .trim()
    .optional(),

  paidTo: z
    .string()
    .trim()
    .optional(),
});

export type CreateExpenseDTO =
  z.infer<typeof createExpenseSchema>;