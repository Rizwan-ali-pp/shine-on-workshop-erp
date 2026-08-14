import { prisma } from "@/lib/prisma";
import { CreateJobDTO, UpdateJobDTO } from "./schema";

export class JobRepository {
  async create(data: CreateJobDTO, jobNumber: string) {
    return prisma.$transaction(async (tx) => {
      // 1. Upsert Customer by Phone
      const customer = await tx.customer.upsert({
        where: { phone: data.customerPhone },
        update: { name: data.customerName },
        create: {
          name: data.customerName,
          phone: data.customerPhone,
        },
      });

      // 2. Upsert Vehicle by Registration Number
      const vehicle = await tx.vehicle.upsert({
        where: { registrationNumber: data.vehicleRegistration },
        update: {
          brand: data.vehicleBrand || "Unknown",
          model: data.vehicleModel || "Unknown",
        },
        create: {
          customerId: customer.id,
          registrationNumber: data.vehicleRegistration,
          brand: data.vehicleBrand || "Unknown",
          model: data.vehicleModel || "Unknown",
        },
      });

      // 3. Create the Job
      const job = await tx.job.create({
        data: {
          jobNumber,
          customerId: customer.id,
          vehicleId: vehicle.id,
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
              customer: {
                phone: { contains: q, mode: "insensitive" as const },
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
  async delete(id: string) {
    return prisma.job.delete({
      where: {
        id,
      },
    });
  }
}
