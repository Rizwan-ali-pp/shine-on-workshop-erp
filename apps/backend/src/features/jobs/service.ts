import { JobRepository } from "./repository";
import { CreateJobDTO, UpdateJobDTO } from "./schema";

export class JobService {
  constructor(private readonly jobRepository = new JobRepository()) {}

  async create(data: CreateJobDTO) {
    const year = new Date().getFullYear();

    const jobNumber = `JC-${year}-${Date.now().toString().slice(-6)}`;

    return this.jobRepository.create(data, jobNumber);
  }

  async findAll() {
    return this.jobRepository.findAll();
  }

  async findById(id: string) {
    return this.jobRepository.findById(id);
  }

  async updateStatus(id: string, data: UpdateJobDTO) {
    return this.jobRepository.updateStatus(id, data.status);
  }
}
