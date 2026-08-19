import { prisma } from "@/lib/prisma";

export class LaborLogRepository {
  async create(data: { workerId: string; amount: number; jobId?: string; notes?: string }) {
    return prisma.laborLog.create({ data });
  }

  async delete(id: string) {
    return prisma.laborLog.delete({
      where: { id },
    });
  }
}
