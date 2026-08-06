import { ExpenseRepository } from "./repository";
import { CreateExpenseDTO } from "./schema";

export class ExpenseService {
  constructor(
    private readonly expenseRepository = new ExpenseRepository()
  ) {}

  async create(data: CreateExpenseDTO) {
    const job = await this.expenseRepository.findJobById(
      data.jobId
    );

    if (!job) {
      throw new Error("Job not found.");
    }

    return this.expenseRepository.create(data);
  }
}