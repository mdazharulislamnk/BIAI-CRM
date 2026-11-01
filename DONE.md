# BIAI CRM — Task Checklist & Deliverables (`DONE.md`)

## 📋 Task Overview
- **Track:** Task 1: BIAI CRM
- **Goal:** Production-grade CRM system capturing multi-channel enquiries (WhatsApp, Facebook, Website, Phone call notes) with native Bangla, Banglish, and English intelligence.
- **Reference Dataset:** `sample-enquiries.csv` (20 sample enquiries with mixed languages and intents).

---

## 🎯 1. Core Requirements

- [ ] **1. Saves each enquiry with required fields**
  - [ ] Sender Name
  - [ ] Phone Number
  - [ ] Channel (`WhatsApp`, `Facebook Messenger`, `Facebook comment`, `Website form`, `Phone call note`)
  - [ ] Program of Interest (`3-Day Bootcamp`, `AI Fellowship`, `Corporate Training`, `General Enquiry`)
  - [ ] Status (`New`, `Contacted`, `Interested`, `Paid`, `Lost`)
  - [ ] Persistent storage using SQLite + Prisma ORM
  - [ ] Direct ingestion and seeding of all 20 rows from `sample-enquiries.csv`
  - [ ] Full CRUD API routes (`GET`, `POST`, `PATCH`, `DELETE`)

- [ ] **2. AI reads pasted message and fills details automatically**
  - [ ] "Quick AI Intake" modal with raw text paste area
  - [ ] Gemini API (`gemini-3.5-flash-lite`) parses unstructured Bangla, Banglish, and English
  - [ ] Extracts: Name, Phone, Channel, Course, Category, and suggested reply
  - [ ] Auto-populates intake form for counselor confirmation & 1-click database save

- [ ] **3. Suggests a reply in English or Banglish matching sender's style**
  - [ ] Tone & language matching (Banglish ➔ Banglish, Bangla ➔ Bangla, English ➔ English)
  - [ ] Contextual consultative reply generated for course inquiries
  - [ ] De-escalating reply for refund/payment issues
  - [ ] Displayed inside Enquiry Detail Modal with 1-click "Copy to Clipboard"
  - [ ] 1-click "Open in WhatsApp" link with pre-filled message

- [ ] **4. Shows a simple pipeline**
  - [ ] 5 distinct columns: `New` ➔ `Contacted` ➔ `Interested` ➔ `Paid` ➔ `Lost`
  - [ ] Drag-and-drop or 1-click stage advancement
  - [ ] Column header badges showing live lead counts

---

## 🧠 2. Smart Triage & Edge-Case Handling (README Hint)

- [ ] **Classifies non-sales enquiries so they don't corrupt sales pipeline:**
  - [ ] 🚨 **Support / Urgent:** Flagged with red badge (e.g., Farzana #7 bKash payment verification, Habibur #16 angry refund)
  - [ ] 🚫 **Spam / Scams:** Quarantined with spam badge and dismiss option (e.g., Earn Crypto Daily #11)
  - [ ] 💼 **Job Seekers:** Flagged with applicant badge and routed to HR (e.g., Arif Hossain #20)
  - [ ] 🔄 **Repeat Contact Detection:** Phone number matching (e.g., Rafi Ahmed #1 and #12)

---

## 🌟 3. Bonus Tasks

- [ ] **Bonus 1: 48-Hour Overdue Follow-up Reminder**
  - [ ] Dynamic calculation: checks if elapsed time since enquiry > 48 hours in `New` or `Contacted`
  - [ ] High-visibility red overdue warning badge on stale cards
  - [ ] Top stats counter tracking total overdue leads needing attention

- [ ] **Bonus 2: AI Weekly Executive Summary**
  - [ ] 1-click "AI Weekly Summary" button in navbar
  - [ ] Gemini analyzes live database distribution, channel volume, and bottlenecks
  - [ ] Generates an executive briefing modal for BIAI management

---

## 🛠️ 4. Professional Developer Hygiene

- [ ] Clean Git commit history tracking every milestone
- [ ] Production-grade `README.md` following standard format (Architecture tradeoffs, API docs, problems faced & solutions)
- [ ] In-app "Reset to Sample Data" button to cleanly refresh database for Loom demos
- [ ] 5-minute Loom video presentation script & preparation guide
