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

    const vehicles = await vehicleService.findAll({
      q,
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return NextResponse.json(vehicles, {
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
      }
    );
  }
}