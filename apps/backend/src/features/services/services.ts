import { ServiceRepository } from "./repository";
import { CreateServiceDTO } from "./schema";

export class ServiceService {
  constructor(
    private readonly serviceRepository = new ServiceRepository()
  ) {}

  async create(data: CreateServiceDTO) {
    const existing = await this.serviceRepository.findByName(data.name);

    if (existing) {
      throw new Error("Service already exists.");
    }

    return this.serviceRepository.create(data);
  }

  async findAll() {
    return this.serviceRepository.findAll();
  }
}