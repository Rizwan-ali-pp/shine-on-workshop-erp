import { NextResponse } from "next/server";
import { DashboardService } from "@/features/dashboard";

const dashboardService = new DashboardService();

export async function GET() {
  try {
    const stats = await dashboardService.getStats();

    return NextResponse.json(stats);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}