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
}