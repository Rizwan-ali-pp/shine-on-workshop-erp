import { CustomerRepository } from "./repository";

export class CustomerService {
  constructor(private readonly customerRepository = new CustomerRepository()) {}

  async create(name: string, phone: string) {
    const existingCustomer =
      await this.customerRepository.findByPhone(phone);

    if (existingCustomer) {
      throw new Error("Customer with this phone number already exists.");
    }

    return this.customerRepository.create(name, phone);
  }

  async findAll() {
    return this.customerRepository.findAll();
  }

  async findById(id: string) {
    return this.customerRepository.findById(id);
  }

  async deactivate(id: string) {
    return this.customerRepository.deactivate(id);
  }
}