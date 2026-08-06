import { VehicleRepository } from "./repository";
import { CreateVehicleDTO } from "./schema";

export class VehicleService {
  constructor(
    private readonly vehicleRepository = new VehicleRepository()
  ) {}

  async create(data: CreateVehicleDTO) {
    const existingVehicle =
      await this.vehicleRepository.findByRegistrationNumber(
        data.registrationNumber
      );

    if (existingVehicle) {
      throw new Error("Vehicle with this registration number already exists.");
    }

    return this.vehicleRepository.create(data);
  }

  async findByCustomer(customerId: string) {
    return this.vehicleRepository.findByCustomer(customerId);
  }

  async findById(id: string) {
    return this.vehicleRepository.findById(id);
  }

  async findAll(params: {
    q?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    const { data, total } = await this.vehicleRepository.findAll(params);
    const limit = params.limit || 10;
    const page = params.page || 1;
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async update(id: string, data: Partial<CreateVehicleDTO>) {
    if (data.registrationNumber) {
      const existing = await this.vehicleRepository.findByRegistrationNumber(
        data.registrationNumber
      );
      if (existing && existing.id !== id) {
        throw new Error("Vehicle with this registration number already exists.");
      }
    }
    return this.vehicleRepository.update(id, data);
  }

  async delete(id: string) {
    try {
      return await this.vehicleRepository.delete(id);
    } catch (error: any) {
      if (error.code === "P2003") {
        throw new Error(
          "Cannot delete vehicle because it is associated with existing jobs."
        );
      }
      throw error;
    }
  }
}