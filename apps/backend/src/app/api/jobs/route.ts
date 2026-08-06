import { NextRequest, NextResponse } from "next/server";
import { createJobSchema } from "@/features/jobs/schema";
import { JobService } from "@/features/jobs/service";

const jobService = new JobService();

export async function GET() {
  try {
    const jobs = await jobService.findAll();

    return NextResponse.json(jobs);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = createJobSchema.parse(body);

    const job = await jobService.create(data);

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}