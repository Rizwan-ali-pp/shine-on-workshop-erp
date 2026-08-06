import { prisma } from "@/lib/prisma";

export class CustomerRepository {
  async create(name: string, phone: string) {
    return prisma.customer.create({
      data: {
        name,
        phone,
      },
    });
  }

  async findByPhone(phone: string) {
    return prisma.customer.findUnique({
      where: {
        phone,
      },
    });
  }

  async findById(id: string) {
    return prisma.customer.findUnique({
      where: {
        id,
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
    
    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { phone: { contains: q } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.customer.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async deactivate(id: string) {
    return prisma.customer.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }

  async update(id: string, data: { name?: string; phone?: string }) {
    return prisma.customer.update({
      where: { id },
      data,
    });
  }
}