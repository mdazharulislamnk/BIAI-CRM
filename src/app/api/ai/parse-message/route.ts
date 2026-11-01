import { NextResponse } from "next/server";
import { parseIncomingMessage } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const { rawMessage } = await request.json();

    if (!rawMessage || typeof rawMessage !== "string" || !rawMessage.trim()) {
      return NextResponse.json(
        { success: false, error: "Raw message is required" },
        { status: 400 }
      );
    }

    const parsed = await parseIncomingMessage(rawMessage.trim());

    return NextResponse.json({
      success: true,
      data: parsed,
    });
  } catch (error: any) {
    console.error("POST /api/ai/parse-message error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to parse message" },
      { status: 500 }
    );
  }
}
