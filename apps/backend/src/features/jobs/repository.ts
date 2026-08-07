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
  async findAll(params?: {
    q?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const {
      q,
      page = 1,
      limit = 10,
      sortBy = "receivedAt",
      sortOrder = "desc",
    } = params || {};

    const where = q
      ? {
          OR: [
            { jobNumber: { contains: q, mode: "insensitive" as const } },
            {
              customer: {
                name: { contains: q, mode: "insensitive" as const },
              },
            },
            {
              vehicle: {
                registrationNumber: { contains: q, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          customer: {
            select: { id: true, name: true, phone: true },
          },
          vehicle: {
            select: { id: true, registrationNumber: true, brand: true, model: true },
          },
          payments: {
            select: { amount: true },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.job.count({ where }),
    ]);

    const mappedData = data.map((job) => ({
      ...job,
      totalPaid: job.payments.reduce((sum, p) => sum + p.amount, 0),
    }));

    return { data: mappedData, total };
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
