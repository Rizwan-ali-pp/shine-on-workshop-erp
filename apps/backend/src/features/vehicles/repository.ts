import { prisma } from "@/lib/prisma";
import { CreateVehicleDTO } from "./schema";

export class VehicleRepository {
  async create(data: CreateVehicleDTO) {
    return prisma.vehicle.create({
      data: {
        customerId: data.customerId,
        registrationNumber: data.registrationNumber.toUpperCase(),
        brand: data.brand,
        model: data.model,
      },
    });
  }

  async findByRegistrationNumber(registrationNumber: string) {
    return prisma.vehicle.findUnique({
      where: {
        registrationNumber: registrationNumber.toUpperCase(),
      },
    });
  }

  async findByCustomer(customerId: string) {
    return prisma.vehicle.findMany({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string) {
    return prisma.vehicle.findUnique({
      where: {
        id,
      },
    });
  }
}