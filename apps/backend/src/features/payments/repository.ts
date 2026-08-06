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
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params || {};

    const where = q
      ? {
          OR: [
            {
              job: {
                jobNumber: { contains: q, mode: "insensitive" as const },
              },
            },
            {
              job: {
                customer: {
                  name: { contains: q, mode: "insensitive" as const },
                },
              },
            },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          job: {
            select: {
              jobNumber: true,
              customer: {
                select: {
                  name: true,
                  phone: true,
                },
              },
            },
          },
        },
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.payment.count({ where }),
    ]);

    return { data, total };
  }
}