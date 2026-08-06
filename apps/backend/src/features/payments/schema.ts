import { z } from "zod";

export const createPaymentSchema = z.object({
  jobId: z.string().uuid(),

  amount: z.number().positive(),

  method: z.enum([
    "CASH",
    "UPI",
    "CARD",
  ]),

  type: z.enum([
    "ADVANCE",
    "PARTIAL",
    "FINAL",
  ]),

  notes: z.string().trim().optional(),
});

export type CreatePaymentDTO =
  z.infer<typeof createPaymentSchema>;