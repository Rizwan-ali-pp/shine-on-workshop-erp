import { prisma } from "@/lib/prisma";
import { CreatePaymentDTO } from "./schema";

export class PaymentRepository {
  async create(data: CreatePaymentDTO) {
    return prisma.payment.create({
      data,
    });
  }

  async findJobById(jobId: string) {
    return prisma.job.findUnique({
      where: {
        id: jobId,
      },
      include: {
        payments: true,
      },
    });
  }
}