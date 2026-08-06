import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { ServiceService } from "@/features/services/services";
import { updateServiceSchema } from "@/features/services/schema";

const serviceService = new ServiceService();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data = updateServiceSchema.parse(body);

    const service = await serviceService.update(id, data);

    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await serviceService.deactivate(id);

    return NextResponse.json({ message: "Service deactivated successfully." }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Something went wrong." },
      { status: 500 }
    );
  }
}
