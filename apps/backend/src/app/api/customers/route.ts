import { NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/features/customers/service";

const customerService = new CustomerService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, phone } = body;

    if (!name || !phone) {
      return NextResponse.json(
        {
          message: "Name and phone are required.",
        },
        {
          status: 400,
        }
      );
    }

    const customer = await customerService.create(name, phone);

    return NextResponse.json(customer, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      },
      {
        status: 500,
      }
    );
  }
}