import { NextRequest, NextResponse } from "next/server";
import { JobService } from "@/features/jobs/service";
import { createJobSchema, updateJobSchema } from "@/features/jobs/schema";

const jobService = new JobService();

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const job = await jobService.findById(id);

    if (!job) {
      return NextResponse.json({ message: "Job not found." }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    const body = await req.json();

    const data = updateJobSchema.parse(body);

    const updatedJob = await jobService.updateStatus(id, data);

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    await jobService.delete(id);

    return NextResponse.json({ message: "Job deleted successfully." });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 },
    );
  }
}
