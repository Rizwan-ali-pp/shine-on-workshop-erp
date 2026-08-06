import { DashboardRepository } from "./repository";

export class DashboardService {
  constructor(
    private readonly repository = new DashboardRepository()
  ) {}

  async getStats() {
    return this.repository.getStats();
  }
}