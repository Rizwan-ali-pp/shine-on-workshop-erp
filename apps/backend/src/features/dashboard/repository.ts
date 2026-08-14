import { prisma } from "@/lib/prisma";

export class DashboardRepository {
  async getStats() {
    const [
      totalJobs,
      totalCustomers,
      totalVehicles,
      revenueResult,
      expenseResult,
      recentPayments,
      recentExpenses,
    ] = await Promise.all([
      prisma.job.count(),
      prisma.customer.count({
        where: {
          jobs: {
            some: {},
          },
        },
      }),
      prisma.vehicle.count(),
      prisma.payment.aggregate({ _sum: { amount: true } }),
      prisma.expense.aggregate({ _sum: { amount: true } }),
      prisma.payment.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { job: { select: { jobNumber: true } } },
      }),
      prisma.expense.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { job: { select: { jobNumber: true } } },
      }),
    ]);

    const totalRevenue = revenueResult._sum.amount ?? 0;
    const totalExpenses = expenseResult._sum.amount ?? 0;
    const netProfit = totalRevenue - totalExpenses;

    const activity = [
      ...recentPayments.map((p) => ({
        id: p.id,
        type: "PAYMENT",
        amount: p.amount,
        title: `Payment Received - Job ${p.job?.jobNumber}`,
        date: p.createdAt,
      })),
      ...recentExpenses.map((e) => ({
        id: e.id,
        type: "EXPENSE",
        amount: e.amount,
        title: e.job
          ? `Expense - Job ${e.job.jobNumber} (${e.category})`
          : `Shop Expense (${e.category})`,
        date: e.createdAt,
      })),
    ];

    const recentActivity = activity
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 15);

    return {
      totalJobs,
      totalCustomers,
      totalVehicles,
      totalRevenue,
      totalExpenses,
      netProfit,
      recentActivity,
    };
  }
}