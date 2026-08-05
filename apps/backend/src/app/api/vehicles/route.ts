import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { VehicleService } from "@/features/vehicles/service";
import { createVehicleSchema } from "@/features/vehicles/schema";

const vehicleService = new VehicleService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = createVehicleSchema.parse(body);

    const vehicle = await vehicleService.create(data);

    return NextResponse.json(vehicle, {
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
        }
      );
    }

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const customerId = searchParams.get("customerId");

    if (!customerId) {
      return NextResponse.json(
        {
          message: "customerId is required.",
        },
        {
          status: 400,
        }
      );
    }

    const vehicles = await vehicleService.findByCustomer(customerId);

    return NextResponse.json(vehicles);
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