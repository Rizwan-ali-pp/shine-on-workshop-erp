import { prisma } from "@/lib/prisma";
import { CreateServiceDTO } from "./schema";

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
      },
    });
  }

  async findAll() {
    return prisma.service.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }
}