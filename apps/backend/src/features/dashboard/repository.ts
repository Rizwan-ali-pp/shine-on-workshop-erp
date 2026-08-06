import { prisma } from "@/lib/prisma";

export class DashboardRepository {
  async getStats() {
    const [
      totalJobs,
      totalCustomers,
      totalVehicles,
      revenue,
    ] = await Promise.all([
      prisma.job.count(),
      prisma.customer.count(),
      prisma.vehicle.count(),
      prisma.payment.aggregate({
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      totalJobs,
      totalCustomers,
      totalVehicles,
      revenue: revenue._sum.amount ?? 0,
    };
  }
}