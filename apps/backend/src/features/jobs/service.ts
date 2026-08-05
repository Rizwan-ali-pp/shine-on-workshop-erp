import { JobRepository } from "./repository";
import { CreateJobDTO } from "./schema";

export class JobService {
  constructor(
    private readonly jobRepository = new JobRepository()
  ) {}

  async create(data: CreateJobDTO) {
    const year = new Date().getFullYear();

    const jobNumber = `JC-${year}-${Date.now().toString().slice(-6)}`;

    return this.jobRepository.create(data, jobNumber);
  }
}