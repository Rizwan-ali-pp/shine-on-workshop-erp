import { prisma } from "@/lib/prisma";

export class WorkerRepository {
  async findAll() {
    return prisma.worker.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { laborLogs: true }
        }
      }
    });
  }

  async findById(id: string) {
    return prisma.worker.findUnique({
      where: { id },
      include: {
        laborLogs: {
          orderBy: { createdAt: "desc" },
          include: { job: true }
        }
      }
    });
  }

  async create(data: { name: string; phone?: string }) {
    return prisma.worker.create({ data });
  }

  async update(id: string, data: { name?: string; phone?: string; isActive?: boolean }) {
    return prisma.worker.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.worker.delete({
      where: { id },
    });
  }
}
