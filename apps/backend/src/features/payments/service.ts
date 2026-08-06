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
}