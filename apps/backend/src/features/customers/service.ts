import { CustomerRepository } from "./repository";
import { CreateCustomerDTO } from "./schema";

export class CustomerService {
  constructor(
    private readonly customerRepository = new CustomerRepository()
  ) {}

  async create(data: CreateCustomerDTO) {
    const existingCustomer = await this.customerRepository.findByPhone(
      data.phone
    );

    if (existingCustomer) {
      throw new Error("Customer with this phone number already exists.");
    }

    return this.customerRepository.create(data.name, data.phone);
  }

  async findAll(params?: {
    q?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) {
    return this.customerRepository.findAll(params);
  }

  async findById(id: string) {
    return this.customerRepository.findById(id);
  }

  async deactivate(id: string) {
    return this.customerRepository.deactivate(id);
  }

  async update(id: string, data: { name?: string; phone?: string }) {
    if (data.phone) {
      const existingCustomer = await this.customerRepository.findByPhone(
        data.phone
      );

      if (existingCustomer && existingCustomer.id !== id) {
        throw new Error("Customer with this phone number already exists.");
      }
    }

    return this.customerRepository.update(id, data);
  }
}