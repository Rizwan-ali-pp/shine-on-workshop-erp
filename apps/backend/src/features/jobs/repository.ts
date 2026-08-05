import { prisma } from "@/lib/prisma";
import { CreateJobDTO } from "./schema";

export class JobRepository {
  async create(data: CreateJobDTO, jobNumber: string) {
    return prisma.$transaction(async (tx) => {
      const job = await tx.job.create({
        data: {
          jobNumber,
          customerId: data.customerId,
          vehicleId: data.vehicleId,
          status: "RECEIVED",

          estimatedTotal: data.estimatedTotal,
          advanceAmount: data.advanceAmount,
          expenseAmount: 0,

          expectedDeliveryAt: data.expectedDeliveryAt
            ? new Date(data.expectedDeliveryAt)
            : null,

          notes: data.notes,
        },
      });

      await tx.jobService.createMany({
        data: data.services.map((service) => ({
          jobId: job.id,
          serviceId: service.serviceId,
          quotedPrice: service.quotedPrice,
          notes: service.notes,
        })),
      });

      if (data.advanceAmount > 0) {
        await tx.payment.create({
          data: {
            jobId: job.id,
            amount: data.advanceAmount,
            method: "CASH", // We'll make this dynamic later
            type: "ADVANCE",
          },
        });
      }

      return job;
    });
  }
}
