import { NextResponse } from "next/server";
import { WorkerService } from "@/features/workers";

const workerService = new WorkerService();

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const worker = await workerService.findById(params.id);
    return NextResponse.json(worker);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: error.message === "Worker not found" ? 404 : 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const worker = await workerService.update(params.id, data);
    return NextResponse.json(worker);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await workerService.delete(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
