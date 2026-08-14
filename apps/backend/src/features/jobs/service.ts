import { JobRepository } from "./repository";
import { CreateJobDTO, UpdateJobDTO } from "./schema";

export class JobService {
  constructor(private readonly jobRepository = new JobRepository()) {}

  async create(data: CreateJobDTO) {
    const year = new Date().getFullYear();

    const jobNumber = `JC-${year}-${Date.now().toString().slice(-6)}`;

    return this.jobRepository.create(data, jobNumber);
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

    const { data, total } = await this.jobRepository.findAll(params);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    return this.jobRepository.findById(id);
  }

  async updateStatus(id: string, data: UpdateJobDTO) {
    return this.jobRepository.updateStatus(id, data.status);
  }

  async delete(id: string) {
    return this.jobRepository.delete(id);
  }
}
