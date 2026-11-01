# BIAI CRM — Task Checklist & Deliverables (`DONE.md`)

## 📋 Task Overview
- **Goal:** Production-grade CRM system capturing multi-channel enquiries (WhatsApp, Facebook, Website, Phone call notes) with native Bangla, Banglish, and English intelligence.
- **Reference Dataset:** `sample-enquiries.csv` (20 sample enquiries with mixed languages and intents).
- **Live Demo Link:** [https://biai-crm.vercel.app](https://biai-crm.vercel.app)
- **Status:** **100% COMPLETE (Core Requirements + All Bonus Tasks + Docker + Vercel Deployment)**

---

## 🎯 1. Core Requirements

- [x] **1. Saves each enquiry with required fields**
  - [x] Sender Name
  - [x] Phone Number
  - [x] Channel (`WhatsApp`, `Facebook Messenger`, `Facebook comment`, `Website form`, `Phone call note`)
  - [x] Program of Interest (`3-Day Bootcamp`, `AI Fellowship`, `Corporate Training`, `General Enquiry`)
  - [x] Status (`New`, `Contacted`, `Interested`, `Paid`, `Lost`)
  - [x] Persistent storage using SQLite + Prisma ORM (`prisma/dev.db`)
  - [x] Direct ingestion and seeding of all 20 rows from `sample-enquiries.csv`
  - [x] Full CRUD API routes (`GET`, `POST`, `PATCH`, `DELETE`)

- [x] **2. AI reads pasted message and fills details automatically**
  - [x] "Quick AI Intake" modal with raw text paste area
  - [x] Gemini API (`gemini-3.5-flash-lite` / `gemini-3.8-flash`) parses unstructured Bangla, Banglish, and English
  - [x] Extracts: Name, Phone, Channel, Course, Category, and suggested reply
  - [x] Auto-populates intake form for counselor confirmation & 1-click database save

- [x] **3. Suggests a reply in English or Banglish matching sender's style**
  - [x] Tone & language matching (Banglish ➔ Banglish, Bangla ➔ Bangla, English ➔ English)
  - [x] Contextual consultative reply generated for course inquiries
  - [x] De-escalating reply for refund/payment issues
  - [x] Displayed inside Enquiry Detail Modal with 1-click "Copy to Clipboard"
  - [x] 1-click "Open in WhatsApp" link with pre-filled message

- [x] **4. Shows a simple pipeline**
  - [x] 5 distinct columns: `New` ➔ `Contacted` ➔ `Interested` ➔ `Paid` ➔ `Lost`
  - [x] 1-click stage advancement buttons on cards and in details modal
  - [x] Column header badges showing live lead counts

---

## 🧠 2. Smart Triage & Edge-Case Handling (README Hint)

- [x] **Classifies non-sales enquiries so they don't corrupt sales pipeline:**
  - [x] 🚨 **Support / Urgent:** Flagged with red badge (e.g., Farzana #7 bKash payment verification, Habibur #16 angry refund)
  - [x] 🚫 **Spam / Scams:** Quarantined with spam badge and dismiss option (e.g., Earn Crypto Daily #11)
  - [x] 💼 **Job Seekers:** Flagged with applicant badge and routed to HR (e.g., Arif Hossain #20)
  - [x] 🔄 **Repeat Contact Detection:** Phone number matching (e.g., Rafi Ahmed #1 and #12)

---

## 🌟 3. Bonus Tasks

- [x] **Bonus 1: 48-Hour Overdue Follow-up Reminder**
  - [x] Dynamic calculation: checks if elapsed time since enquiry > 48 hours in `New` or `Contacted`
  - [x] High-visibility red overdue warning badge on stale cards
  - [x] Top stats counter tracking total overdue leads needing attention

- [x] **Bonus 2: AI Weekly Executive Summary**
  - [x] 1-click "AI Weekly Summary" button in navbar
  - [x] Gemini analyzes live database distribution, channel volume, and bottlenecks
  - [x] Generates an executive briefing modal with rich Markdown styling and KPI ribbon

- [x] **Bonus 3: Dual View Mode**
  - [x] Instant toggle between visual Kanban Board and high-density Data Table View

- [x] **Bonus 4: Docker & Docker Compose Containerization**
  - [x] Multi-stage Alpine Node 22 `Dockerfile`
  - [x] Single-command spin-up via `docker-compose.yml` with persistent volume

---

## 🛠️ 4. Professional Developer Hygiene

- [x] Clean Git commit history tracking every milestone
- [x] Production-grade `README.md` (no assessment tags, full Docker & Vercel guides, Loom script)
- [x] In-app "Reset to Sample Data" button to cleanly refresh database for Loom demos
- [x] 5-minute Loom video presentation script & preparation guide
