import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST() {
  try {
    await execAsync("npx tsx prisma/seed.ts");
    return NextResponse.json({
      success: true,
      message: "Database successfully reset to original 20 sample enquiries.",
    });
  } catch (error: any) {
    console.error("POST /api/seed error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to reset sample data" },
      { status: 500 }
    );
  }
}
