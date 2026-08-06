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

  async findAll(params?: {
    q?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const limit = params?.limit || 10;
    const page = params?.page || 1;

    const { data, total } = await this.expenseRepository.findAll(params);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}