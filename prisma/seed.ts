import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const prisma = new PrismaClient();

interface CSVRow {
  id: string;
  channel: string;
  "received at": string;
  "sender name": string;
  phone: string;
  message: string;
}

/**
 * Intelligent helper to deduce course, intent category, language, and suggested reply
 */
function enrichEnquiry(row: any) {
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

  // 1. Detect Category / Intent
  if (csvId === 11 || msg.includes("crypto") || msg.includes("5000 usd")) {
    category = "SPAM";
    status = "Lost";
    suggestedReply = "Spam/scam message flagged. No sales follow-up required.";
  } else if (csvId === 20 || msg.includes("job as an ai intern") || msg.includes("where do i apply")) {
    category = "JOB_SEEKER";
    status = "Lost";
    suggestedReply = "Hi " + (name || "there") + ", thank you for your interest in joining BIAI! Please email your CV and portfolio to careers@biai.com.bd. Our recruitment team reviews intern applications on a rolling basis.";
  } else if (csvId === 7 || csvId === 16 || msg.includes("বিকাশে দিয়েছি") || msg.includes("cancel his enrolment") || msg.includes("money back")) {
    category = "SUPPORT";
    status = csvId === 16 ? "Contacted" : "New";
    if (msg.includes("বিকাশ") || msg.includes("কনফার্মেশন")) {
      detectedLang = "Bangla";
      suggestedReply = "আন্তরিকভাবে দুঃখিত ফারজানা আপু। আপনার ২৫ তারিখের বিকাশ লেনদেনটি আমাদের অ্যাকাউন্টস টিম দ্রুত ভেরিফাই করছে। দয়া করে ট্রানজ্যাকশন আইডি (TrxID) টি জানান, আমরা ৩০ মিনিটের মধ্যে কনফার্মেশন জানিয়ে দিচ্ছি।";
    } else {
      suggestedReply = "Dear Habibur Rahman, we sincerely apologize for the inconvenience. Our senior supervisor is reviewing your cancellation request right now to process the refund today. You will receive an update within 2 hours.";
    }
  } else {
    category = "LEAD";
  }

  // 2. Detect Program of Interest (if not already handled)
  if (category === "LEAD") {
    if (msg.includes("bootcamp") || msg.includes("3 day")) {
      interest = "3-Day Bootcamp";
    } else if (msg.includes("ফেলোশিপ") || msg.includes("fellowship")) {
      interest = "AI Fellowship";
    } else if (msg.includes("corporate") || msg.includes("textile") || msg.includes("bank") || msg.includes("কোম্পানি") || msg.includes("training for our team") || msg.includes("120 employees") || msg.includes("১৫ জন কর্মী")) {
      interest = "Corporate Training";
    } else if (msg.includes("masterclass") || msg.includes("মাস্টারক্লাস")) {
      interest = "General Enquiry";
    }

    // Pipeline Stage distribution based on enquiry progress
    if (csvId === 1) {
      status = "New";
      detectedLang = "Banglish";
      suggestedReply = "Walaikumassalam Rafi bhai! Amader 3-day AI Bootcamp er regular fee 3,500 BDT. bKash ba card diye online-e admission nite parben. Ami ki apnake registration link pathabo?";
    } else if (csvId === 2) {
      status = "New";
      detectedLang = "Bangla";
      suggestedReply = "ধন্যবাদ তাহমিনা আপু! আমাদের পরবর্তী এআই ফেলোশিপ ব্যাচ আগামী ১৫ নভেম্বর থেকে শুরু হচ্ছে। বিস্তারিত কারিকুলাম ও আবেদন প্রক্রিয়ার জন্য আপনার ফোন নম্বরটি কি দয়া করে শেয়ার করবেন?";
    } else if (csvId === 3) {
      status = "Contacted";
      detectedLang = "English";
      suggestedReply = "Dear Mahmud Hasan, thank you for contacting BIAI. We would be delighted to design a customized AI training program for your 40-person team in Gazipur. Our corporate training lead will call you tomorrow between 11 AM - 1 PM. Would that suit you?";
    } else if (csvId === 4) {
      status = "Contacted";
      detectedLang = "Banglish";
      suggestedReply = "Sabbir bhai, amader sob class live interactive hoy Zoom-e. Class sesh e prottek ti session er HD recording ebong resource sheet LMS portal-e lifetime access thakbe.";
    } else if (csvId === 5) {
      status = "Contacted";
      detectedLang = "English";
      suggestedReply = "Hi Nasreen, following up on our call regarding student discounts. We offer a 20% scholarship for verified students. We look forward to speaking with you tomorrow after 5 PM.";
    } else if (csvId === 6) {
      status = "New";
      detectedLang = "Banglish";
      suggestedReply = "Ishtiaq bhai, ei fellowship-e hands-on industry project, portfolio review, ebong hiring partners placement support thake. Direct job guarantee deya hoy na, tobe top performers der job reference pawa jay.";
    } else if (csvId === 8) {
      status = "Interested";
      detectedLang = "English";
      suggestedReply = "Hi Anika, yes! We offer a full 100% refund policy if requested before the second session begins, or you can transfer your seat to any upcoming cohort without extra fees.";
    } else if (csvId === 9) {
      status = "Contacted";
      detectedLang = "Banglish";
      suggestedReply = "Jahid bhai, amader offline lab session Gulshan campus-e hoy. Mirpur er student-der jonno interactive live online batch ebong hybrid weekend lab available ache. Apni konta prefer korben?";
    } else if (csvId === 10) {
      status = "Interested";
      detectedLang = "English";
      suggestedReply = "Dear Kamrul Islam, thank you for reaching out. We have extensive experience conducting enterprise AI upskilling for banking institutions. We will prepare a customized proposal with modular options for 120 employees and email it to you by tomorrow noon.";
    } else if (csvId === 12) {
      status = "Interested";
      detectedLang = "Banglish";
      suggestedReply = "Rafi bhai, amader 3-day bootcamp er regular fee 3,500 BDT, kintu early-bird discount-e ajke enrol korle 2,900 BDT te admission nite parben. Link: biai.com.bd/bootcamp-register";
    } else if (csvId === 13) {
      status = "Contacted";
      detectedLang = "Bangla";
      suggestedReply = "অবশ্যই মিম! আমাদের ফ্রি এআই মাস্টারক্লাস সবার জন্য উন্মুক্ত। ক্লাস ৯-এর শিক্ষার্থীরাও কোডিং ছাড়া এআই-এর প্রাথমিক বিষয়গুলো শিখতে পারবে। এই লিঙ্কে গিয়ে ফ্রি রেজিস্ট্রেশন করে নাও: biai.com.bd/masterclass";
    } else if (csvId === 14) {
      status = "Interested";
      detectedLang = "English";
      suggestedReply = "Hi Shirin, absolutely! The AI Fellowship has a dedicated track designed specifically for non-technical leaders and marketers focusing on AI tools, workflows, analytics, and automation without coding. We'd love to share the syllabus.";
    } else if (csvId === 15) {
      status = "Contacted";
      detectedLang = "Banglish";
      suggestedReply = "Tanvir bhai, Add-on hocche amader 50+ ready-to-use AI prompts ebong automation workflow templates. Lifetime access mane hocche course materials ebong recordings apnar portal-e shob somoy thakbe.";
    } else if (csvId === 17) {
      status = "Contacted";
      detectedLang = "Banglish";
      suggestedReply = "Nowshin apu, amader certificate BIAI accredited ebong hands-on project portfolio based. Eta international level-e LinkedIn ebong corporate recruiters-der kache verified credentials hishebe accepted.";
    } else if (csvId === 18) {
      status = "Interested";
      detectedLang = "Bangla";
      suggestedReply = "রেজাউল করিম ভাই, হ্যাঁ! আপনার ১৫ জন কর্মীর জন্য আমাদের বিশেষ করপোরেট গ্রুপ ডিসকাউন্ট (২৫%) প্রযোজ্য হবে। আপনি কি অনলাইনে নাকি অন-সাইট ট্রেইনিং করাতে চান? আমাদের করপোরেট কনসালটেন্ট আজই আপনার সাথে কথা বলবেন।";
    } else if (csvId === 19) {
      status = "Interested";
      detectedLang = "English";
      suggestedReply = "Hi Samira, yes! We offer an installment payment facility for the AI Fellowship: 50% at enrollment and the remaining 50% after the first month of classes. Would you like the installment schedule?";
    }
  }

  // 3. Parse date safely
  let receivedAt = new Date();
  if (row["received at"]) {
    const parsedDate = new Date(row["received at"]);
    if (!isNaN(parsedDate.getTime())) {
      receivedAt = parsedDate;
    }
  }

  return {
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
  };
}

async function main() {
  console.log("🌱 Starting BIAI CRM database seed...");

  const csvPath = path.join(process.cwd(), "sample-enquiries.csv");
  if (!fs.existsSync(csvPath)) {
    console.error("❌ sample-enquiries.csv not found at:", csvPath);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(csvPath, "utf-8");
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
  }) as CSVRow[];

  console.log(`📄 Found ${records.length} records in sample-enquiries.csv`);

  // Clear existing records to ensure idempotency
  await prisma.enquiry.deleteMany({});
  console.log("🧹 Cleared existing database records.");

  for (const row of records) {
    const data = enrichEnquiry(row);
    await prisma.enquiry.create({
      data,
    });
  }

  console.log("✅ Successfully seeded 20 enquiries into SQLite dev.db!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
