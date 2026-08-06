import { ServiceRepository } from "./repository";
import { CreateServiceDTO, UpdateServiceDTO } from "./schema";

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

  async findById(id: string) {
    return this.serviceRepository.findById(id);
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

    const { data, total } = await this.serviceRepository.findAll(params);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: UpdateServiceDTO) {
    if (data.name) {
      const existing = await this.serviceRepository.findByName(data.name);
      if (existing && existing.id !== id) {
        throw new Error("Service with this name already exists.");
      }
    }
    return this.serviceRepository.update(id, data);
  }

  async deactivate(id: string) {
    return this.serviceRepository.deactivate(id);
  }
}