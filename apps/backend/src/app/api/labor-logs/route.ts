import { NextResponse } from "next/server";
import { LaborLogService } from "@/features/labor-logs";

const laborLogService = new LaborLogService();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newLog = await laborLogService.create({
      workerId: data.workerId,
      amount: data.amount,
      jobId: data.jobId,
      notes: data.notes,
    });
    return NextResponse.json(newLog, { status: 201 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
