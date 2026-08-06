import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { ServiceService } from "@/features/services/services";
import { createServiceSchema } from "@/features/services/schema";

const serviceService = new ServiceService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createServiceSchema.parse(body);
    const service = await serviceService.create(data);

    return NextResponse.json(service, { status: 201 });
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q") || undefined;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!) : undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined;
    const sortBy = searchParams.get("sortBy") || undefined;
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || undefined;

    const services = await serviceService.findAll({
      q,
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Something went wrong." },
      { status: 500 }
    );
  }
}
