import { NextRequest, NextResponse } from "next/server";
import { createExpenseSchema } from "@/features/expenses/schema";
import { ExpenseService } from "@/features/expenses/service";

const expenseService = new ExpenseService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = createExpenseSchema.parse(body);

    const expense = await expenseService.create(data);

    return NextResponse.json(expense, {
      status: 201,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}