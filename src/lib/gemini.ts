import { GoogleGenAI } from "@google/genai";
import { AIParsedResult } from "./types";

const apiKey = process.env.GEMINI_API_KEY || "";

function getClient(): GoogleGenAI | null {
  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Intelligent heuristic fallback parser in case GEMINI_API_KEY is not set
 * Ensures the app works gracefully even before the user inputs their key.
 */
function localFallbackParser(text: string): AIParsedResult {
  const lower = text.toLowerCase();
  let channel = "WhatsApp";
  if (lower.includes("facebook") || lower.includes("fb") || lower.includes("messenger")) channel = "Facebook Messenger";
  else if (lower.includes("call") || lower.includes("phone")) channel = "Phone call note";
  else if (lower.includes("website") || lower.includes("form")) channel = "Website form";

  // Phone regex
  const phoneMatch = text.match(/(?:(?:\+|00)88)?01[3-9]\d{8}/);
  const phone = phoneMatch ? phoneMatch[0] : "";

  // Name extraction attempt
  let senderName = "Prospective Student";
  const nameMatch = text.match(/(?:আমার নাম|name is|i am|iam|from|caller is)\s+([A-Za-z\u0980-\u09FF\s]+?)(?:,|\.|\n|$)/i);
  if (nameMatch && nameMatch[1]) {
    senderName = nameMatch[1].trim();
  }

  // Language detection
  const isBangla = /[\u0980-\u09FF]/.test(text);
  const isBanglish = /\b(apnader|koto|kibhabe|hobe|pawa|vai|bhai|korbo|korle|gula|ta|ki)\b/i.test(text);
  const detectedLang: 'Banglish' | 'Bangla' | 'English' = isBangla ? 'Bangla' : (isBanglish ? 'Banglish' : 'English');

  // Intent Category
  let category: AIParsedResult['category'] = 'LEAD';
  if (lower.includes('crypto') || lower.includes('usd') || lower.includes('click') || lower.includes('bit.ly')) {
    category = 'SPAM';
  } else if (lower.includes('job') || lower.includes('intern') || lower.includes('cv') || lower.includes('apply')) {
    category = 'JOB_SEEKER';
  } else if (lower.includes('payment') || lower.includes('bkash') || lower.includes('বিকাশ') || lower.includes('refund') || lower.includes('cancel')) {
    category = 'SUPPORT';
  }

  // Course interest
  let interest: AIParsedResult['interest'] = 'General Enquiry';
  if (lower.includes('bootcamp') || lower.includes('3 day') || lower.includes('বুটক্যাম্প')) {
    interest = '3-Day Bootcamp';
  } else if (lower.includes('fellowship') || lower.includes('ফেলোশিপ')) {
    interest = 'AI Fellowship';
  } else if (lower.includes('corporate') || lower.includes('company') || lower.includes('team') || lower.includes('কর্মীর') || lower.includes('employees')) {
    interest = 'Corporate Training';
  }

  // Suggested reply
  let suggestedReply = "";
  if (category === 'SPAM') {
    suggestedReply = "Spam flagged. No reply needed.";
  } else if (category === 'JOB_SEEKER') {
    suggestedReply = "Hi, thank you for your interest! Please submit your resume to careers@biai.com.bd.";
  } else if (category === 'SUPPORT') {
    suggestedReply = detectedLang === 'Bangla'
      ? "আপনার সমস্যাটির জন্য দুঃখিত। আমাদের সাপোর্ট টিম দ্রুত বিষয়টি খতিয়ে দেখছে।"
      : "Thank you for contacting support. Our team is reviewing your transaction and will update you shortly.";
  } else {
    if (detectedLang === 'Banglish') {
      suggestedReply = "Assalamualaikum! Amader BIAI programs e agroho dekhanor jonno dhonnobad. Apnake ki details ebong registration link pathabo?";
    } else if (detectedLang === 'Bangla') {
      suggestedReply = "ধন্যবাদ বিআইএআই-তে যোগাযোগ করার জন্য। আমাদের প্রোগ্রাম সংক্রান্ত বিস্তারিত তথ্য ও সিলেবাস কি আপনার সাথে শেয়ার করব?";
    } else {
      suggestedReply = "Thank you for reaching out to BIAI! We would love to share more details and answer any questions you have regarding our upcoming cohort.";
    }
  }

  return {
    senderName,
    phone,
    channel,
    interest,
    category,
    detectedLang,
    suggestedReply,
    summaryReasoning: "Parsed via rule-based intelligent fallback (add GEMINI_API_KEY in .env.local for full LLM reasoning)."
  };
}

/**
 * Main AI Message Parser: Calls Gemini 3.5 Flash-Lite with model fallback
 */
export async function parseIncomingMessage(rawText: string): Promise<AIParsedResult> {
  const client = getClient();
  if (!client) {
    return localFallbackParser(rawText);
  }

  const prompt = `You are the lead AI intake officer for Bangladesh Institute of Artificial Intelligence (BIAI).
Analyze this incoming raw message from a customer/user:
"""
${rawText}
"""

BIAI offers 3 core programs:
1. "3-Day Bootcamp" (rapid foundational AI practical training)
2. "AI Fellowship" (intensive career program for tech & non-tech leaders)
3. "Corporate Training" (tailored for companies, teams, banks, factories)
Or "General Enquiry" for other queries.

Task:
Extract and classify the enquiry into structured JSON with these exact fields:
- senderName: string (Extract person's name or company name if found. If unknown, use "Unknown Sender")
- phone: string (Extract Bangladeshi mobile number e.g. 017..., 018..., or "" if none)
- channel: string (One of: "WhatsApp", "Facebook Messenger", "Facebook comment", "Website form", "Phone call note")
- interest: string (Exactly one of: "3-Day Bootcamp", "AI Fellowship", "Corporate Training", "General Enquiry")
- category: string (Exactly one of:
    - "LEAD" for legitimate prospective students/clients
    - "SUPPORT" for existing payment issues, bKash confirmations, cancellations, refund requests
    - "SPAM" for crypto scams, ads, unrelated promotional links
    - "JOB_SEEKER" for people seeking jobs, internships, or employment at BIAI)
- detectedLang: string ("Banglish", "Bangla", or "English")
- suggestedReply: string (Draft a warm, polite, consultative, culturally authentic reply matching the EXACT language style:
    - If sender wrote in Banglish -> reply in natural, polite Banglish.
    - If sender wrote in Bangla -> reply in polished, respectful Bengali.
    - If sender wrote in English -> reply in professional, warm English.
    - If SUPPORT -> write an empathetic, calming resolution message.
    - If SPAM -> "Spam flagged. No reply needed."
    - If JOB_SEEKER -> polite redirect to careers@biai.com.bd)
- summaryReasoning: string (1 concise sentence explaining your classification)

Output strictly valid JSON.`;

  const models = ["gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

  for (const model of models) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text) as AIParsedResult;

      // Validate required fields
      return {
        senderName: parsed.senderName || "Unknown Sender",
        phone: parsed.phone || "",
        channel: parsed.channel || "WhatsApp",
        interest: parsed.interest || "General Enquiry",
        category: parsed.category || "LEAD",
        detectedLang: parsed.detectedLang || "Banglish",
        suggestedReply: parsed.suggestedReply || "",
        summaryReasoning: parsed.summaryReasoning || `Processed by ${model}`,
      };
    } catch (err: any) {
      console.warn(`[Gemini API] Model ${model} failed, checking fallback:`, err?.message || err);
    }
  }

  // If all models failed or network error, fallback gracefully
  return localFallbackParser(rawText);
}

/**
 * AI Weekly Summary Generator: Analyzes active pipeline data
 */
export async function generateWeeklySummaryReport(metrics: {
  total: number;
  byStage: Record<string, number>;
  byCategory: Record<string, number>;
  byCourse: Record<string, number>;
  overdueCount: number;
  recentLeads: Array<{ name: string; channel: string; interest: string; status: string; message: string }>;
}): Promise<string> {
  const client = getClient();
  if (!client) {
    return `### BIAI CRM Weekly Executive Briefing (Offline Mode)
**Pipeline Overview:**
- Total Enquiries Tracked: ${metrics.total}
- Leads Needing Follow-up (>48h Overdue): ${metrics.overdueCount}
- Active Conversions: ${metrics.byStage['Paid'] || 0} Paid, ${metrics.byStage['Interested'] || 0} Interested, ${metrics.byStage['Contacted'] || 0} Contacted.
- Non-sales Triage: ${metrics.byCategory['SUPPORT'] || 0} Support/Refund issues, ${metrics.byCategory['SPAM'] || 0} Spam filtered, ${metrics.byCategory['JOB_SEEKER'] || 0} Job applicants.

*Note: Add your GEMINI_API_KEY in .env.local to enable full generative AI deep analysis.*`;
  }

  const prompt = `You are the AI Chief Operations Analyst at Bangladesh Institute of Artificial Intelligence (BIAI).
Generate an insightful, executive weekly CRM briefing for the leadership team based on this pipeline data:

Total Enquiries: ${metrics.total}
Stage Distribution: ${JSON.stringify(metrics.byStage)}
Category Breakdown (Leads vs Support vs Spam): ${JSON.stringify(metrics.byCategory)}
Program Interest Breakdown: ${JSON.stringify(metrics.byCourse)}
Overdue Leads (>48 hours without contact): ${metrics.overdueCount}

Recent Enquiries Sample:
${metrics.recentLeads.map((l, i) => `${i + 1}. [${l.channel}] ${l.name} (${l.interest}, Stage: ${l.status}) -> "${l.message}"`).join('\n')}

Structure your executive briefing in clear GitHub Markdown:
1. Executive Summary (2-3 sentences on overall weekly health)
2. Revenue & Enrollment Pipeline (Analysis of Bootcamp, Fellowship, and Corporate leads)
3. Operational Bottlenecks & Overdue Alerts (Highlight the ${metrics.overdueCount} leads waiting >48 hours)
4. Customer Support & Reputation Watch (Analysis of refund complaints and bKash payment verification)
5. Recommended Action Items for Counselors This Week (3 bullet points)

Keep it actionable, professional, and directly relevant to BIAI's team in Bangladesh.`;

  try {
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        temperature: 0.3,
      },
    });
    return response.text || "Unable to generate summary.";
  } catch (err: any) {
    console.error("Gemini summary error:", err);
    return `### Weekly Executive Briefing\n\nTotal Enquiries: ${metrics.total} | Overdue Follow-ups: ${metrics.overdueCount}\n\nPlease check Gemini API quota or network connection.`;
  }
}
