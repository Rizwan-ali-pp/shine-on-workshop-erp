import { NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/features/customers/service";
import { updateCustomerSchema } from "@/features/customers/schema";
import { ZodError } from "zod";

const customerService = new CustomerService();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data = updateCustomerSchema.parse(body);

    const customer = await customerService.update(id, data);

    return NextResponse.json(customer, {
      status: 200,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const customer = await customerService.deactivate(id);

    return NextResponse.json(customer, {
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
