import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

export async function POST() {
  try {
    const csvPath = path.join(process.cwd(), "sample-enquiries.csv");
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json({ success: false, error: "CSV file not found" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(csvPath, "utf-8");
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      bom: true,
    }) as any[];

    // Clear existing records
    await prisma.enquiry.deleteMany({});

    for (const row of records) {
      const rawId = row.id || row["\uFEFFid"] || row["﻿id"] || "";
      const csvId = parseInt(String(rawId), 10) || 0;
      const msg = (row.message || "").toLowerCase();
      const rawMsg = row.message || "";
      const name = row["sender name"] || "";
      const phone = row.phone || "";

      let interest = "General Enquiry";
      let status = "New";
      let category = "LEAD";
      let detectedLang = "English";
      let suggestedReply = "";

      if (csvId === 11 || msg.includes("crypto") || msg.includes("5000 usd")) {
        category = "SPAM";
        status = "Lost";
        suggestedReply = "Spam/scam message flagged. No sales follow-up required.";
      } else if (csvId === 20 || msg.includes("job as an ai intern") || msg.includes("where do i apply")) {
        category = "JOB_SEEKER";
        status = "Lost";
        suggestedReply = "Hi " + (name || "there") + ", thank you for your interest in joining BIAI! Please email your CV and portfolio to careers@biai.com.bd.";
      } else if (csvId === 7 || csvId === 16 || msg.includes("বিকাশে দিয়েছি") || msg.includes("cancel his enrolment")) {
        category = "SUPPORT";
        status = csvId === 16 ? "Contacted" : "New";
        if (msg.includes("বিকাশ") || msg.includes("কনফার্মেশন")) {
          detectedLang = "Bangla";
          suggestedReply = "আন্তরিকভাবে দুঃখিত ফারজানা আপু। আপনার ২৫ তারিখের বিকাশ লেনদেনটি আমাদের অ্যাকাউন্টস টিম দ্রুত ভেরিফাই করছে। দয়া করে ট্রানজ্যাকশন আইডি (TrxID) জানান।";
        } else {
          suggestedReply = "Dear Habibur Rahman, we sincerely apologize. Our supervisor is reviewing your cancellation to process the refund today. You will receive an update within 2 hours.";
        }
      } else {
        category = "LEAD";
        if (msg.includes("bootcamp") || msg.includes("3 day")) interest = "3-Day Bootcamp";
        else if (msg.includes("ফেলোশিপ") || msg.includes("fellowship")) interest = "AI Fellowship";
        else if (msg.includes("corporate") || msg.includes("textile") || msg.includes("bank") || msg.includes("কর্মীর")) interest = "Corporate Training";

        if (csvId === 1) {
          status = "New";
          detectedLang = "Banglish";
          suggestedReply = "Walaikumassalam Rafi bhai! Amader 3-day AI Bootcamp er fee 3,500 BDT. bKash ba card diye online payment kora jay. Link pathabo?";
        } else if (csvId === 2) {
          status = "New";
          detectedLang = "Bangla";
          suggestedReply = "ধন্যবাদ তাহমিনা আপু! আমাদের পরবর্তী ফেলোশিপ ব্যাচ ১৫ নভেম্বর শুরু হচ্ছে। বিস্তারিত সিলেবাসের জন্য ফোন নম্বরটি শেয়ার করুন।";
        } else if (csvId === 3) {
          status = "Contacted";
          detectedLang = "English";
          suggestedReply = "Dear Mahmud Hasan, thank you for contacting BIAI. Our corporate training lead will call you tomorrow between 11 AM - 1 PM.";
        } else if (csvId === 8 || csvId === 10 || csvId === 12 || csvId === 14 || csvId === 18 || csvId === 19) {
          status = "Interested";
        } else {
          status = "Contacted";
        }
      }

      let receivedAt = new Date();
      if (row["received at"]) {
        const d = new Date(row["received at"]);
        if (!isNaN(d.getTime())) receivedAt = d;
      }

      await prisma.enquiry.create({
        data: {
          csvId,
          channel: row.channel || "WhatsApp",
          receivedAt,
          senderName: name.trim() || "Unknown Sender",
          phone: phone.trim() || null,
          message: rawMsg,
          interest,
          status,
          category,
          detectedLang,
          suggestedReply,
        },
      });
    }

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
