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
}