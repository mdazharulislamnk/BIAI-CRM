import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isLeadOverdue } from "@/lib/utils";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = await prisma.enquiry.update({
      where: { id },
      data: {
        ...body,
        updatedAt: new Date(),
        // If status changes to Contacted, record contact time
        ...(body.status === "Contacted" ? { lastContactedAt: new Date() } : {}),
      },
    });

    return NextResponse.json({
      success: true,
      enquiry: {
        ...updated,
        isOverdue: isLeadOverdue(updated.receivedAt, updated.status),
      },
    });
  } catch (error: any) {
    console.error("PATCH /api/enquiries/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update enquiry" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.enquiry.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Enquiry deleted" });
  } catch (error: any) {
    console.error("DELETE /api/enquiries/[id] error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete enquiry" },
      { status: 500 }
    );
  }
}
