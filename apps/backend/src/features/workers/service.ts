import { WorkerRepository } from "./repository";

export class WorkerService {
  constructor(private readonly repository = new WorkerRepository()) {}

  async findAll() {
    return this.repository.findAll();
  }

  async findById(id: string) {
    const worker = await this.repository.findById(id);
    if (!worker) throw new Error("Worker not found");
    return worker;
  }

  async create(data: { name: string; phone?: string }) {
    return this.repository.create(data);
  }

  async update(id: string, data: { name?: string; phone?: string; isActive?: boolean }) {
    return this.repository.update(id, data);
  }

  async delete(id: string) {
    return this.repository.delete(id);
  }
}
