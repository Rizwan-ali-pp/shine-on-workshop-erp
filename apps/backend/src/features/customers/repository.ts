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

  async findAll() {
    return prisma.customer.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
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
}