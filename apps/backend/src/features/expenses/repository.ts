import { prisma } from "@/lib/prisma";
import { CreateExpenseDTO } from "./schema";

export class ExpenseRepository {
  async create(data: CreateExpenseDTO) {
    return prisma.expense.create({
      data,
    });
  }

  async findJobById(jobId: string) {
    return prisma.job.findUnique({
      where: {
        id: jobId,
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
              category: { contains: q, mode: "insensitive" as const },
            },
            {
              paidTo: { contains: q, mode: "insensitive" as const },
            },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        include: {
          job: {
            select: {
              jobNumber: true,
              customer: {
                select: {
                  name: true,
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
      prisma.expense.count({ where }),
    ]);

    return { data, total };
  }
}