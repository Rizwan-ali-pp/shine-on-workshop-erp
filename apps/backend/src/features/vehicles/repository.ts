import { prisma } from "@/lib/prisma";
import { CreateVehicleDTO, UpdateVehicleDTO } from "./schema";
import { Prisma } from "@prisma/client";

export class VehicleRepository {
  async create(data: CreateVehicleDTO) {
    return prisma.vehicle.create({
      data: {
        customerId: data.customerId,
        registrationNumber: data.registrationNumber.toUpperCase(),
        brand: data.brand,
        model: data.model,
      },
    });
  }

  async findByRegistrationNumber(registrationNumber: string) {
    return prisma.vehicle.findUnique({
      where: {
        registrationNumber: registrationNumber.toUpperCase(),
      },
    });
  }

  async findByCustomer(customerId: string) {
    return prisma.vehicle.findMany({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.vehicle.findUnique({
      where: {
        id,
      },
    });
  }

  async findAll({
    q,
    page,
    limit,
    sortBy,
    sortOrder,
  }: {
    q?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}) {
    const where: Prisma.VehicleWhereInput = {
      ...(q
        ? {
            OR: [
              { registrationNumber: { contains: q, mode: "insensitive" as const } },
              { brand: { contains: q, mode: "insensitive" as const } },
              { model: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    let p, l;
    if (page !== undefined && limit !== undefined) {
      p = page;
      l = limit;
    }

    const [data, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        include: {
          customer: {
            select: { name: true, phone: true },
          },
        },
        orderBy: sortBy ? { [sortBy]: sortOrder || "desc" } : { createdAt: "desc" },
        ...(p && l ? { skip: (p - 1) * l, take: l } : {}),
      }),
      prisma.vehicle.count({ where }),
    ]);

    return { data, total };
  }

  async update(id: string, data: UpdateVehicleDTO) {
    return prisma.vehicle.update({
      where: { id },
      data: {
        ...data,
        registrationNumber: data.registrationNumber?.toUpperCase(),
      },
    });
  }

  async delete(id: string) {
    return prisma.vehicle.delete({
      where: { id },
    });
  }
}