import { NextResponse } from "next/server";
import { LaborLogService } from "@/features/labor-logs";

const laborLogService = new LaborLogService();

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await laborLogService.delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
