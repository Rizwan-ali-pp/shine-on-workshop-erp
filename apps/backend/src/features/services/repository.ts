import { prisma } from "@/lib/prisma";
import { CreateServiceDTO, UpdateServiceDTO } from "./schema";
import { Prisma } from "@prisma/client";

export class ServiceRepository {
  async create(data: CreateServiceDTO) {
    return prisma.service.create({
      data,
    });
  }

  async findByName(name: string) {
    return prisma.service.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive",
        },
        isActive: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.service.findUnique({
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

    const where: Prisma.ServiceWhereInput = {
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { category: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.service.count({ where }),
    ]);

    return { data, total };
  }

  async update(id: string, data: UpdateServiceDTO) {
    return prisma.service.update({
      where: { id },
      data,
    });
  }

  async deactivate(id: string) {
    return prisma.service.update({
      where: { id },
      data: { isActive: false },
    });
  }
}