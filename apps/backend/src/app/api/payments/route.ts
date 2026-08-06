import { NextRequest, NextResponse } from "next/server";
import {
  createPaymentSchema,
} from "@/features/payments/schema";
import { PaymentService } from "@/features/payments/service";

const paymentService = new PaymentService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = createPaymentSchema.parse(body);

    const payment = await paymentService.create(data);

    return NextResponse.json(payment, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}