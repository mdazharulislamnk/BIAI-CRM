import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isLeadOverdue } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const channel = searchParams.get("channel") || "";
    const status = searchParams.get("status") || "";
    const category = searchParams.get("category") || "";
    const interest = searchParams.get("interest") || "";

    const where: any = {};

    if (search.trim()) {
      where.OR = [
        { senderName: { contains: search } },
        { phone: { contains: search } },
        { message: { contains: search } },
      ];
    }

    if (channel && channel !== "ALL") where.channel = channel;
    if (status && status !== "ALL") where.status = status;
    if (category && category !== "ALL") where.category = category;
    if (interest && interest !== "ALL") where.interest = interest;

    const enquiries = await prisma.enquiry.findMany({
      where,
      orderBy: [
        { csvId: "asc" },
        { receivedAt: "desc" },
      ],
    });

    // Compute dynamic overdue property
    const enriched = enquiries.map((item) => ({
      ...item,
      isOverdue: isLeadOverdue(item.receivedAt, item.status),
    }));

    return NextResponse.json({ success: true, count: enriched.length, enquiries: enriched });
  } catch (error: any) {
    console.error("GET /api/enquiries error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      senderName,
      phone,
      channel,
      interest,
      status,
      category,
      message,
      suggestedReply,
      detectedLang,
      notes,
    } = body;

    if (!message || !channel) {
      return NextResponse.json(
        { success: false, error: "Message and channel are required" },
        { status: 400 }
      );
    }

    const newEnquiry = await prisma.enquiry.create({
      data: {
        senderName: senderName || "Unknown Sender",
        phone: phone || null,
        channel: channel || "WhatsApp",
        interest: interest || "General Enquiry",
        status: status || "New",
        category: category || "LEAD",
        message,
        suggestedReply: suggestedReply || null,
        detectedLang: detectedLang || "English",
        notes: notes || null,
        receivedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, enquiry: newEnquiry });
  } catch (error: any) {
    console.error("POST /api/enquiries error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create enquiry" },
      { status: 500 }
    );
  }
}
