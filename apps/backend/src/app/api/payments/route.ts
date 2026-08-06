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

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get("q") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const sortBy = searchParams.get("sortBy") || undefined;
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || undefined;

    const payments = await paymentService.findAll({
      q,
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return NextResponse.json(payments, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Something went wrong." },
      { status: 500 }
    );
  }
}