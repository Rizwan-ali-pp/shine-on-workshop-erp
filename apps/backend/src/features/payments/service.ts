import { PaymentRepository } from "./repository";
import { CreatePaymentDTO } from "./schema";

export class PaymentService {
  constructor(
    private readonly paymentRepository = new PaymentRepository()
  ) {}

  async create(data: CreatePaymentDTO) {
    const job = await this.paymentRepository.findJobById(data.jobId);

    if (!job) {
      throw new Error("Job not found.");
    }

    const totalPaid = job.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    const remaining = job.estimatedTotal - totalPaid;

    if (data.amount > remaining) {
      throw new Error(
        `Payment exceeds remaining balance. Remaining amount is ₹${remaining}.`
      );
    }

    return this.paymentRepository.create(data);
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

    const { data, total } = await this.paymentRepository.findAll(params);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}