import { NextResponse } from "next/server";
import { LaborLogService } from "@/features/labor-logs";

const laborLogService = new LaborLogService();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await laborLogService.delete(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
