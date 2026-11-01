import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateWeeklySummaryReport } from "@/lib/gemini";
import { isLeadOverdue } from "@/lib/utils";

export async function POST() {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { receivedAt: "desc" },
    });

    const total = enquiries.length;
    const byStage: Record<string, number> = {};
    const byCategory: Record<string, number> = {};
    const byCourse: Record<string, number> = {};
    let overdueCount = 0;

    for (const item of enquiries) {
      // Stage count
      byStage[item.status] = (byStage[item.status] || 0) + 1;
      // Category count
      byCategory[item.category] = (byCategory[item.category] || 0) + 1;
      // Course count
      byCourse[item.interest] = (byCourse[item.interest] || 0) + 1;
      // Overdue check
      if (isLeadOverdue(item.receivedAt, item.status)) {
        overdueCount++;
      }
    }

    const recentLeads = enquiries.slice(0, 10).map((l) => ({
      name: l.senderName || "Unknown",
      channel: l.channel,
      interest: l.interest,
      status: l.status,
      message: l.message,
    }));

    const reportMarkdown = await generateWeeklySummaryReport({
      total,
      byStage,
      byCategory,
      byCourse,
      overdueCount,
      recentLeads,
    });

    return NextResponse.json({
      success: true,
      report: reportMarkdown,
      metrics: {
        total,
        byStage,
        byCategory,
        byCourse,
        overdueCount,
      },
    });
  } catch (error: any) {
    console.error("POST /api/ai/weekly-summary error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate weekly summary" },
      { status: 500 }
    );
  }
}
