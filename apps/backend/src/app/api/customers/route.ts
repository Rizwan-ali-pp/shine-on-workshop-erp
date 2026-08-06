import { ZodError } from "zod";
import { createCustomerSchema } from "@/features/customers/schema";
import { NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/features/customers/service";

const customerService = new CustomerService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = createCustomerSchema.parse(body);

    const customer = await customerService.create(data);

    return NextResponse.json(customer, {
      status: 201,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") || undefined;
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!)
      : undefined;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const sortBy = searchParams.get("sortBy") || undefined;
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || undefined;

    const customers = await customerService.findAll({
      q,
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return NextResponse.json(customers, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Something went wrong.",
      },
      {
        status: 500,
      },
    );
  }
}
