import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { VehicleService } from "@/features/vehicles/service";
import { updateVehicleSchema } from "@/features/vehicles/schema";

const vehicleService = new VehicleService();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const data = updateVehicleSchema.parse(body);

    const vehicle = await vehicleService.update(id, data);

    return NextResponse.json(vehicle, { status: 200 });
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

    await vehicleService.delete(id);

    return NextResponse.json({ message: "Vehicle deleted successfully." }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Something went wrong." },
      { status: 500 }
    );
  }
}
