import { NextResponse } from "next/server";
import { WorkerService } from "@/features/workers";

const workerService = new WorkerService();

export async function GET() {
  try {
    const workers = await workerService.findAll();
    return NextResponse.json(workers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newWorker = await workerService.create({
      name: data.name,
      phone: data.phone,
    });
    return NextResponse.json(newWorker, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
