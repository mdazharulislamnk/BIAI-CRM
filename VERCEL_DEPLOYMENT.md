# Vercel 1-Click Deployment Guide ($0 Free Tier)

This guide walks you through deploying the **BIAI CRM** to Vercel's global edge network completely free of charge ($0).

---

## 🚀 1. Quick Deployment Steps

### Step 1: Push Your Code to GitHub
Ensure your local project is pushed to your GitHub repository:
```bash
git push origin main
```

---

### Step 2: Import into Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard) using your GitHub account.
2. Click **"Add New..."** ➔ **"Project"**.
3. Locate your **`BIAI-CRM`** repository and click **"Import"**.

---

### Step 3: Project Configuration
Vercel automatically detects the Next.js framework preset:

| Field | Recommended Value |
|---|---|
| **Project Name** | `biai-crm` (or your preferred subdomain) |
| **Framework Preset** | **Next.js** *(Auto-detected)* |
| **Root Directory** | `./` |
| **Build Command** | `npm run build` *(Auto-runs Prisma generation, migration, seeding & Next.js compilation)* |
| **Output Directory** | `.next` *(Auto-detected)* |

---

### Step 4: Environment Variables (Required)
Under the **"Environment Variables"** dropdown, add the following two keys:

| Key | Value | Description |
|---|---|---|
| `GEMINI_API_KEY` | `AIzaSy...` | Your Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/). |
| `DATABASE_URL` | `file:./dev.db` | SQLite database connection string for serverless deployment. |

---

### Step 5: Click "Create Project"
Click the black **"Create Project"** (or **"Deploy"**) button.

---

## ⚙️ 2. What Happens During Deployment

Vercel's automated CI/CD pipeline will:
1. **Install Dependencies:** Installs packages using `npm ci`.
2. **Generate Database Client:** Executes `prisma generate` to bind TypeScript typings.
3. **Synchronize Schema:** Executes `prisma db push` to initialize the database tables.
4. **Seed Sample Data:** Executes `tsx prisma/seed.ts` to populate the 20 sample enquiries from `sample-enquiries.csv`.
5. **Optimize Pages:** Generates static pages and serverless API functions.
6. **Assign Free Domain:** Issues a free SSL-secured production URL (e.g. `https://biai-crm.vercel.app`).

---

## 🌐 3. Post-Deployment Verification

Once the deployment completes (~60 seconds), verify the following:

1. **Dashboard Access:** Open your assigned `.vercel.app` URL.
2. **Sample Leads Loaded:** Verify all 5 Kanban stages (`New`, `Contacted`, `Interested`, `Paid`, `Lost`) show the 20 pre-loaded enquiries.
3. **AI Quick Intake:** Click **"AI Quick Intake"**, select a sample preset, and verify Gemini extracts the fields in real time.
4. **AI Weekly Summary:** Click **"AI Weekly Summary"** and ensure the executive markdown report generates smoothly.
5. **Stage Progression:** Move a lead from `New` to `Contacted` to test live database updates.

---

## 🛠️ 4. Connecting a Cloud Database (Optional for Enterprise Scaling)

While the default SQLite configuration works seamlessly for evaluations and demos, you can scale to an external cloud PostgreSQL database with zero code changes:

1. In your Vercel Dashboard, navigate to the **"Storage"** tab.
2. Click **"Create Database"** ➔ Select **Vercel Postgres (Neon)**.
3. Click **"Connect to Project"** ➔ Select `biai-crm`.
4. Vercel automatically populates `DATABASE_URL` with a live PostgreSQL connection string.
5. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
6. Redeploy!
