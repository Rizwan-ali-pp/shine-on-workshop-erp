import { LaborLogRepository } from "./repository";

export class LaborLogService {
  constructor(private readonly repository = new LaborLogRepository()) {}

  async create(data: { workerId: string; amount: number; jobId?: string; notes?: string }) {
    if (data.amount <= 0) throw new Error("Amount must be greater than 0");
    return this.repository.create(data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
