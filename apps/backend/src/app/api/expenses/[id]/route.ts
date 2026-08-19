import { NextResponse } from "next/server";
import { ExpenseService } from "@/features/expenses/service";

const expenseService = new ExpenseService();

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await expenseService.delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
