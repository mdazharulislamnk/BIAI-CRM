# BIAI CRM — AI-Powered Multi-Channel Lead Intelligence System

> An intelligent, production-grade customer relationship management platform engineered to ingest unstructured customer enquiries across WhatsApp, Facebook Messenger, Facebook comments, Website forms, and Phone call notes with native understanding of Bangla, Banglish, and English dialects.

---

## 1. Title & Overview

The **BIAI CRM** is a full-stack, AI-native customer relationship management system purpose-built for the **Bangladesh Institute of Artificial Intelligence (BIAI)**. 

### The Problem
Prospective students and enterprise clients reach out to BIAI through fragmented channels (WhatsApp, Facebook Messenger, Facebook comments, website contact forms, and incoming phone calls). Because these messages are written in a mix of English, formal Bengali script, and Romanized colloquial Banglish (*"Vai class gula live hoy naki recorded?"*), enquiries frequently get lost, response times lag, and sales counselors cannot identify who needs immediate follow-up. Furthermore, non-sales enquiries (such as urgent bKash payment verification, refund demands, spam bots, and job applicants) pollute the sales pipeline, wasting counselor bandwidth.

### The Solution
BIAI CRM delivers:
1. **Persistent Relational CRM:** Full pipeline tracking across 5 defined stages (`New` ➔ `Contacted` ➔ `Interested` ➔ `Paid` ➔ `Lost`) powered by SQLite and Prisma ORM.
2. **AI Quick Intake Engine:** Paste any messy unstructured message in Bangla, Banglish, or English. Google Gemini (`gemini-3.5-flash-lite`) automatically extracts sender identity, contact numbers, source channels, program interest, and intent.
3. **Smart Triage & Quarantine:** Automatically flags **🚨 Urgent Support Issues** (e.g., bKash confirmations, refund demands), quarantines **🚫 Spam/Scams**, and routes **💼 Job Seekers** to HR before they clutter sales queues.
4. **Culturally Authentic Tone-Matched Reply Generator:** Generates context-aware replies matching the customer's exact linguistic tone (natural Banglish for Banglish messages, polite Bengali for Bangla messages, and professional English for English enquiries) with 1-click WhatsApp redirection.
5. **Dynamic 48-Hour Overdue Follow-up Tracker:** Evaluates elapsed time to flag stagnant leads needing immediate attention.
6. **AI Weekly Executive Briefing:** Synthesizes pipeline distribution, conversion velocity, and operational bottlenecks into a markdown report for BIAI leadership.
7. **Dual View Modes:** Seamlessly toggle between a visual **5-Stage Kanban Board** and a high-density **Data Table View**.

---

## 2. Complete Tech Stack

| Layer | Technologies Used | Description & Purpose |
|---|---|---|
| **Frontend** | React 19, Next.js 15 (App Router), Tailwind CSS, Lucide React | Clean, responsive modern SaaS UI with full-screen Kanban pipeline, data table view, and modal drawers. |
| **Backend & API** | Next.js Server Endpoints (Node.js runtime) | Type-safe RESTful API routes for CRUD operations, filtering, and stage transitions. |
| **Database & ORM** | SQLite, Prisma ORM 5.22 | Persistent local relational database stored on disk (`prisma/dev.db`). Provides schema migrations, ACID transactions, and zero-cloud evaluation. |
| **AI / LLM Engine** | Google GenAI SDK (`gemini-3.5-flash-lite`, with `gemini-3.8-flash` fallback) | Fast, free-tier workhorse LLM optimized for structured extraction, multilingual South Asian understanding, and tone synthesis. |
| **Containerization** | Docker, Docker Compose (Alpine Node 22) | Single-command containerized execution on any OS with automated database migration and seeding. |
| **Data Ingestion** | `csv-parse/sync`, TypeScript Seeder (`prisma/seed.ts`) | Automated idempotent ingestion engine parsing `sample-enquiries.csv` directly into the relational database. |

---

## 3. Table of Contents

- [1. Title & Overview](#1-title--overview)
- [2. Complete Tech Stack](#2-complete-tech-stack)
- [3. Table of Contents](#3-table-of-contents)
- [4. Project Directory Structure](#4-project-directory-structure)
- [5. Prerequisites](#5-prerequisites)
- [6. Environment Variables](#6-environment-variables)
- [7. A to Z Setup Guide (Manual Installation)](#7-a-to-z-setup-guide-manual-installation)
- [8. A to Z Setup Guide (Docker Compose)](#8-a-to-z-setup-guide-docker-compose)
- [9. 100% Free Cloud Deployment (Vercel Guide)](#9-100-free-cloud-deployment-vercel-guide)
- [10. Architecture & Design Tradeoffs](#10-architecture--design-tradeoffs)
- [11. Relational Data Model (Prisma / SQLite)](#11-relational-data-model-prisma--sqlite)
- [12. Feature Matrix & Task Completion](#12-feature-matrix--task-completion)
- [13. Complete API Reference](#13-complete-api-reference)
- [14. Problems Faced & Solutions](#14-problems-faced--solutions)
- [15. 5-Minute Loom Presentation Script](#15-5-minute-loom-presentation-script)
- [16. Developer Signature](#16-developer-signature)

---

## 4. Project Directory Structure

```text
BIAI-CRM/
├── sample-enquiries.csv                # Source reference dataset (20 sample enquiries)
├── DONE.md                             # Live task & deliverable tracking checklist
├── README.md                           # Comprehensive documentation & engineering report
├── Dockerfile                          # Multi-stage production container build (Node 22 Alpine)
├── docker-compose.yml                  # Single-command container orchestration
├── .dockerignore                       # Exclusions for Docker context
├── .env                                # Local environment config (DATABASE_URL & GEMINI_API_KEY)
├── .env.example                        # Template for evaluators
├── .gitignore                          # Git exclusions (node_modules, dev.db, .env)
├── package.json                        # Dependencies, scripts, and build pipeline
├── tsconfig.json                       # Strict TypeScript compiler options
├── tailwind.config.ts                  # Design tokens, color palette, and UI theme
├── next.config.ts                      # Next.js bundler and server external configurations
│
├── prisma/
│   ├── schema.prisma                  # Prisma ORM relational schema (Enquiry model)
│   ├── seed.ts                        # Production dynamic CSV seeder
│   └── dev.db                         # Persistent SQLite database file
│
└── src/
    ├── app/
    │   ├── api/
    │   │   ├── enquiries/
    │   │   │   ├── route.ts           # GET (filtered list) | POST (create lead)
    │   │   │   └── [id]/
    │   │   │       └── route.ts       # PATCH (stage updates & counselor notes) | DELETE
    │   │   │
    │   │   ├── ai/
    │   │   │   ├── parse-message/
    │   │   │   │   └── route.ts       # POST: Gemini 3 extraction + intent classification + reply
    │   │   │   └── weekly-summary/
    │   │   │       └── route.ts       # POST: Gemini 3 executive pipeline briefing
    │   │   │
    │   │   └── seed/
    │   │       └── route.ts           # POST: 1-click database reset to sample data
    │   │
    │   ├── globals.css                # Base Tailwind styles & custom scrollbars
    │   ├── layout.tsx                 # Root layout with font configuration & metadata
    │   └── page.tsx                   # Main Dashboard (Kanban Pipeline, Stats, Filter bar, Table View)
    │
    ├── components/
    │   ├── Navbar.tsx                 # Floating top header with "AI Quick Intake" & "AI Weekly Summary"
    │   ├── StatsOverview.tsx          # Compact metrics: Total, Overdue (>48h), Paid, Support/Spam
    │   ├── FilterBar.tsx              # Multi-channel, program, intent toolbar + Board/Table switcher
    │   ├── PipelineBoard.tsx          # 5-stage Kanban board (New, Contacted, Interested, Paid, Lost)
    │   ├── PipelineColumn.tsx         # Column wrapper with independent inner box scrolling
    │   ├── TableView.tsx              # High-density data table view for power counselors
    │   ├── EnquiryCard.tsx            # Compact card with channel icons, overdue badges, stage advancers
    │   ├── AIIntakeModal.tsx          # "Paste Raw Message" drawer with Gemini extraction & demo presets
    │   ├── EnquiryDetailModal.tsx     # Inspector: message, 1-click copy AI reply, WhatsApp link, notes
    │   └── WeeklySummaryModal.tsx     # Modal displaying AI-generated executive briefing with rich formatting
    │
    └── lib/
        ├── db.ts                      # Prisma client singleton (connection pooling)
        ├── gemini.ts                  # Google GenAI client with model fallback & prompt templates
        ├── types.ts                   # Domain TypeScript interfaces (Enquiry, Stage, Channel, Intent)
        └── utils.ts                   # 48-hour overdue time calculation & badge formatting
```

---

## 5. Prerequisites

- **Node.js:** `v20.x` or `v22.x` (Recommended: `v22.11.0` or higher)
- **npm:** `v10.x` or higher
- **Docker & Docker Compose:** Optional (For containerized deployment)
- **Google Gemini API Key:** Free key obtainable in 1 minute from [Google AI Studio](https://aistudio.google.com/) *(optional for basic offline evaluation; app includes intelligent rule fallback)*

---

## 6. Environment Variables

Create a `.env` file in the root directory:

```env
# ========================================================
# BIAI CRM Environment Variables
# ========================================================

# Google Gemini API Key (Get free key from https://aistudio.google.com/)
GEMINI_API_KEY="your_gemini_api_key_here"

# Persistent SQLite database location
DATABASE_URL="file:./dev.db"
```

---

## 7. A to Z Setup Guide (Manual Installation)

### Step 1: Clone or Navigate to the Repository
```bash
git clone https://github.com/mdazharulislamnk/BIAI-CRM.git
cd BIAI-CRM
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `.env` and insert your Gemini API Key:
```env
GEMINI_API_KEY="AIzaSy..."
DATABASE_URL="file:./dev.db"
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Synchronize Database & Seed Sample Data
Initialize the SQLite database and ingest the 20 enquiries from `sample-enquiries.csv`:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### Step 5: Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser. The CRM will load populated with all 20 sample enquiries.

---

## 8. A to Z Setup Guide (Docker Compose)

For a fully isolated environment without installing Node.js, Prisma, or local dependencies:

### Step 1: Install Docker Desktop
Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/).

### Step 2: Configure Environment Variables
Ensure `.env` exists in the root directory with your `GEMINI_API_KEY`.

### Step 3: Build and Run
```bash
docker compose up --build
```
Docker will build the multi-stage Alpine Node 22 container, run Prisma migrations, seed the sample dataset, and launch the production server.

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 4: Stopping the Container
```bash
docker compose down
```

---

## 9. 100% Free Cloud Deployment (Vercel Guide)

Next.js is developed by Vercel, making Vercel the premier zero-cost hosting platform for this application.

> 📖 **Full Step-by-Step Guide:** See [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md) for detailed deployment walkthrough and post-deployment checklist.

### Do You Need Docker for Vercel?
**No.** Vercel uses serverless edge infrastructure that natively compiles Next.js repositories directly from your GitHub account without Docker.

### Step-by-Step Vercel Deployment ($0 Free):
1. **Push your code to GitHub:**
   ```bash
   git push -u origin main
   ```
2. **Import into Vercel:**
   - Go to [vercel.com](https://vercel.com) and log in with GitHub.
   - Click **"Add New Project"** ➔ Select your **`BIAI-CRM`** repository.
3. **Configure Environment Variables:**
   Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Google Gemini API Key.
   - `DATABASE_URL`: `file:./dev.db` *(or connect a free PostgreSQL database like Supabase or Neon)*.
4. **Deploy:**
   - Click **"Deploy"**.
   - In ~60 seconds, Vercel gives you a live production URL: `https://biai-crm.vercel.app`.

---

## 10. Architecture & Design Tradeoffs

### 1. SQLite with Prisma ORM vs. In-Memory Mockup
- **The Tradeoff:** Some prototypes store leads in temporary JavaScript memory (`useState` or browser `localStorage`), which vanishes upon page refresh or across different team members. 
- **The Decision:** We implemented a real relational SQLite database managed through Prisma ORM (`prisma/dev.db`). This ensures true ACID persistence, relational querying, and index-accelerated filters. If BIAI chooses to deploy to PostgreSQL/Supabase, changing `provider = "sqlite"` to `"postgresql"` takes one line of code.

### 2. Multi-Tier Intelligent Triage
- **The Problem:** Incoming enquiries contain non-sales items: crypto scams, urgent bKash payment verification, refund demands, and job applicants. Dumping these into "New Sales Leads" wastes counselor time.
- **The Solution:** Our AI extraction pipeline classifies incoming messages into 4 distinct intent categories:
  - `LEAD`: Enters the active sales pipeline (`New` ➔ `Contacted` ➔ `Interested` ➔ `Paid` ➔ `Lost`).
  - `SUPPORT`: Flagged with **🚨 Urgent Support** badge for accounts/counselor escalation.
  - `SPAM`: Flagged with **🚫 Quarantined Spam** badge and filtered out of active sales calculations.
  - `JOB_SEEKER`: Routed to HR with an automated careers referral.

### 3. Gemini 3.5 Flash-Lite as Primary Workhorse
- **The Tradeoff:** Frontier models have high latency and strict free-tier rate limits. 
- **The Decision:** We configured `gemini-3.5-flash-lite` with fallback to `gemini-3.8-flash` and `gemini-2.0-flash`. Flash-Lite provides sub-second latency (~800ms), zero token waste on internal reasoning overhead, and native comprehension of mixed South Asian languages (Bangla, Banglish, and English).

### 4. Dynamic 48-Hour Overdue Date Math
- **The Implementation:** Any lead residing in `New` or `Contacted` with more than 48 hours elapsed since `receivedAt` is dynamically tagged with an overdue badge, both on the card and in the top stats bar.

---

## 11. Relational Data Model (Prisma / SQLite)

```prisma
model Enquiry {
  id              String    @id @default(cuid())
  csvId           Int?      // Original row ID from sample-enquiries.csv (1 to 20)
  channel         String    // WhatsApp, Facebook Messenger, Facebook comment, Website form, Phone call note
  receivedAt      DateTime  // Original intake timestamp
  senderName      String?
  phone           String?
  message         String    // Raw message payload
  
  // Categorization & Intent
  interest        String    // 3-Day Bootcamp, AI Fellowship, Corporate Training, General Enquiry
  status          String    @default("New") // New, Contacted, Interested, Paid, Lost
  category        String    @default("LEAD") // LEAD, SUPPORT, SPAM, JOB_SEEKER
  
  // AI Outputs
  detectedLang    String?   // Banglish, Bangla, English
  suggestedReply  String?   // AI-drafted reply matching sender tone
  
  // Audit & Workflow
  lastContactedAt DateTime?
  notes           String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([status])
  @@index([category])
  @@index([phone])
}
```

---

## 12. Feature Matrix & Task Completion

| Requirement | Implementation Details | Status |
|---|---|---|
| **1. Saves each enquiry** | Captures Name, Phone, Channel, Course Interest, and Status in persistent SQLite via Prisma ORM. | ✅ Complete |
| **2. Reads pasted message via AI** | "Quick AI Intake" modal uses Gemini to extract fields automatically from raw unstructured text. | ✅ Complete |
| **3. Suggests tone-matched reply** | Generates authentic replies in Banglish, Bangla, or English matching the customer's dialect. Includes 1-click copy & WhatsApp link. | ✅ Complete |
| **4. Simple 5-stage pipeline** | Kanban board displaying `New`, `Contacted`, `Interested`, `Paid`, and `Lost` with quick stage advancement. | ✅ Complete |
| **Handling of 20 Sample Enquiries** | All 20 enquiries from `sample-enquiries.csv` loaded, typed, and triaged. | ✅ Complete |
| **Triage Non-Sales Enquiries** | Distinguishes Sales Leads from Support Issues (bKash/refund), Spam (crypto), and Job Seekers. | ✅ Complete |
| **Bonus 1: 48-Hour Overdue Reminder** | Real-time calculation flags leads in `New`/`Contacted` older than 48h with a visual indicator and counter. | ✅ Complete |
| **Bonus 2: AI Weekly Summary** | 1-click executive briefing synthesizing live pipeline distribution, conversions, and bottlenecks. | ✅ Complete |
| **Bonus: Dual View Mode** | Instant toggle between Kanban Board View and High-Density Table View. | ✅ Complete |
| **Bonus: Containerization** | Single-command startup via `Dockerfile` and `docker-compose.yml`. | ✅ Complete |
| **In-App Reset Capability** | 1-click "Reset Sample Data" button to restore database to original 20 records for repeated demos. | ✅ Complete |

---

## 13. Complete API Reference

### 1. List Enquiries (with Search & Filters)
- **Endpoint:** `GET /api/enquiries`
- **Query Parameters:**
  - `search`: string (matches name, phone, or message)
  - `channel`: string (`WhatsApp`, `Facebook Messenger`, `Website form`, `Phone call note`, `Facebook comment`)
  - `status`: string (`New`, `Contacted`, `Interested`, `Paid`, `Lost`)
  - `interest`: string (`3-Day Bootcamp`, `AI Fellowship`, `Corporate Training`, `General Enquiry`)
  - `category`: string (`LEAD`, `SUPPORT`, `SPAM`, `JOB_SEEKER`)
- **Response:** JSON `{ success: true, count: 20, enquiries: [...] }`

### 2. Create Enquiry
- **Endpoint:** `POST /api/enquiries`
- **Payload:** `{ senderName, phone, channel, interest, category, status, message, suggestedReply, detectedLang }`
- **Response:** JSON `{ success: true, enquiry: { ... } }`

### 3. Update Enquiry Stage / Notes
- **Endpoint:** `PATCH /api/enquiries/[id]`
- **Payload:** `{ status: "Contacted", notes: "Called applicant at 5 PM." }`
- **Response:** JSON `{ success: true, enquiry: { ... } }`

### 4. Delete Enquiry
- **Endpoint:** `DELETE /api/enquiries/[id]`
- **Response:** JSON `{ success: true, message: "Enquiry deleted" }`

### 5. Parse Raw Message (AI Quick Intake)
- **Endpoint:** `POST /api/ai/parse-message`
- **Payload:** `{ rawMessage: "Assalamualaikum, apnader 3 day bootcamp er price koto?..." }`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "senderName": "Rafi Ahmed",
      "phone": "01711000001",
      "channel": "WhatsApp",
      "interest": "3-Day Bootcamp",
      "category": "LEAD",
      "detectedLang": "Banglish",
      "suggestedReply": "Walaikumassalam Rafi bhai! Amader 3-day AI Bootcamp er regular fee 3,500 BDT...",
      "summaryReasoning": "Legitimate course fee inquiry in Banglish."
    }
  }
  ```

### 6. AI Weekly Executive Summary
- **Endpoint:** `POST /api/ai/weekly-summary`
- **Response:** JSON `{ success: true, report: "### BIAI CRM Weekly Executive Briefing...", metrics: { ... } }`

### 7. Reset Database to Sample Data
- **Endpoint:** `POST /api/seed`
- **Response:** JSON `{ success: true, message: "Database successfully reset to original 20 sample enquiries." }`

---

## 14. Problems Faced & Solutions

### 1. Dialect Mixing & Romanized Banglish Parsing
- **Problem:** Many Bangladeshi students write in colloquial Romanized Banglish (e.g., *"Vai class gula live hoy naki recorded? Recording pawa jay?"*). Traditional NLP classifiers fail because English tokenizers misclassify Banglish words as typos or gibberish.
- **Solution:** We structured our Gemini prompts with explicit South Asian linguistic context and phonetic dialect examples. Gemini natively parses Romanized Bengali vocabulary (`apnader`, `koto`, `kibhabe`, `vai`, `pawa jay`) and generates culturally natural responses that match the customer's conversational style.

### 2. Triage of Non-Sales Enquiries (Preventing Sales Pipeline Clutter)
- **Problem:** Standard CRMs treat every row in `sample-enquiries.csv` as a new sales prospect. However, Row 7 is a student worried about a bKash confirmation; Row 16 is an angry caller demanding a refund; Row 11 is a crypto scam; Row 20 is an intern job seeker. If a sales counselor calls Habibur Rahman trying to sell a course, customer trust is severely damaged.
- **Solution:** Engineered an intent classification layer (`LEAD`, `SUPPORT`, `SPAM`, `JOB_SEEKER`). Urgent customer service queries are flagged with **🚨 Urgent Support** badges with calming de-escalation responses, while spam is quarantined.

### 3. 48-Hour Overdue Follow-up Accuracy
- **Problem:** Calculating overdue leads using static database fields can become stale as time elapses.
- **Solution:** Implemented dynamic date math computed on every read request. If a lead in `New` or `Contacted` has an elapsed time exceeding 48 hours relative to its creation, the system flags it with an animated warning indicator.

### 4. Zero-Friction Demo Testing (Idempotent Seeder)
- **Problem:** While recording a live Loom video or during technical interviews, moving cards or deleting test entries permanently alters data.
- **Solution:** Built an in-app "Reset Sample Data" button that executes `prisma/seed.ts` via an internal API endpoint, cleanly resetting the database to the 20 sample records in under 2 seconds without restarting the server.

---

## 15. 5-Minute Loom Presentation Script

Use this exact flow when recording your Loom video:

- **Minute 0:00 - 1:00: Problem & Core Idea**
  - Introduce yourself and state the problem: BIAI receives unstructured messages across WhatsApp, Facebook, phone calls, and forms in mixed Bangla and Banglish. Leads get lost and counselors miss follow-ups.
  - State your core solution: An AI-native CRM that extracts details automatically, suggests tone-matched replies, and triages sales from support and spam.

- **Minute 1:00 - 2:30: Live Pipeline Demo on Sample Data**
  - Show the 5-stage Kanban board loaded with the 20 sample enquiries from `sample-enquiries.csv`.
  - Highlight the **48h Overdue** badge on stale leads.
  - Click on **Row 7 (Farzana Rahman)** and show how the AI classified it as **🚨 Urgent Support (bKash verification)** rather than a sales lead.
  - Click on **Row 16 (Habibur Rahman)** and show the empathetic refund de-escalation reply.
  - Advance a card from `New` ➔ `Contacted` ➔ `Interested`.
  - Switch to **Table View** to show high-density sorting.

- **Minute 2:30 - 3:45: AI Quick Intake Demo**
  - Click the **"AI Quick Intake"** button.
  - Click the preset for **Rafi Ahmed (Banglish)**: *"Assalamualaikum, apnader 3 day bootcamp er price koto?..."*
  - Click **"Extract with AI"**. Show how Gemini in under 1 second extracts:
    - Name: `Rafi Ahmed`
    - Phone: `01711000001`
    - Channel: `WhatsApp`
    - Program: `3-Day Bootcamp`
    - Tone: `Banglish`
    - Suggested Reply: A polite, natural Banglish response.
  - Click **"Save to CRM"** and show it immediately appear in the pipeline.

- **Minute 3:45 - 4:30: AI Weekly Executive Summary (Bonus)**
  - Click **"AI Weekly Summary"**.
  - Show Gemini generating an executive report with rendered markdown, analyzing lead distribution, corporate training inquiries, and the list of overdue follow-ups.

- **Minute 4:30 - 5:00: Architecture Decisions & Wrap-up**
  - Explain why you chose Next.js 15, SQLite with Prisma, Docker containerization, and Gemini 3.5 Flash-Lite (zero-cost, sub-second speed, local database persistence).
  - Conclude with your readiness for questions and live modifications.

---

## 16. Developer Signature

| Information | Details |
|---|---|
| **Developer** | **Md. Azharul Islam** |
| **GitHub Profile** | [@mdazharulislamnk](https://github.com/mdazharulislamnk) |
| **Project Repository** | [BIAI-CRM](https://github.com/mdazharulislamnk/BIAI-CRM) |
