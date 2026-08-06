import { prisma } from "@/lib/prisma";
import { CreateJobDTO, UpdateJobDTO } from "./schema";

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
  async findAll() {
    return prisma.job.findMany({
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        vehicle: {
          select: {
            id: true,
            registrationNumber: true,
            brand: true,
            model: true,
          },
        },
      },
      orderBy: {
        receivedAt: "desc",
      },
    });
  }
  async findById(id: string) {
    return prisma.job.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,

        vehicle: true,

        services: {
          include: {
            service: true,
          },
        },

        payments: true,

        expenses: true,

        photos: true,
      },
    });
  }
  async updateStatus(id: string, status: UpdateJobDTO["status"]) {
    return prisma.job.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }
}
