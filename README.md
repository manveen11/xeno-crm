<div align="center">
  <img src="./apps/crm/public/xeno-logo.png" alt="Xeno CRM Logo" width="80" />
  <h1>Xeno Mini CRM 🚀</h1>
  <p><strong>An Agentic, Chat-First CRM for D2C Brands</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini 2.5 Flash" />
  </p>
</div>

---

## 💡 The Problem
Modern D2C marketers spend hours navigating clunky, drag-and-drop segment builders. Exporting CSVs, fighting with rule logic (`AND`, `OR`, `NOT`), and manually drafting messages across different channels is incredibly tedious. The tools haven't evolved, but marketing speed needs to.

## ✨ The Solution: Chat-First CRM
**Xeno Mini CRM** replaces the dashboard with an **Agentic AI Assistant**. Simply type what you want in plain English: 

> *"Find my VIP customers who haven't ordered in 90 days and draft an urgent win-back SMS offering 20% off."*

The AI securely queries your database, segments the audience, drafts personalized message variants, and fires the campaign.

---

## 🌟 Core Features

### 🤖 1. Autonomous Agentic Workflow
Powered by **Google Gemini 2.5 Flash** and the Vercel AI SDK v5.
- **Natural Language to ORM**: Translates plain text into strict Prisma queries to find exact user segments without hallucinations.
- **Tool Chaining**: Automatically chains `segment_customers` → `draft_message` → `create_campaign` in a single thought process.
- **Contextual Awareness**: Remembers audience sizes, channel constraints, and selected message variants across turns.

### ⚡ 2. Real-Time Delivery Engine
- **Asynchronous Queues**: Uses **BullMQ** and **Upstash Redis** to process massive campaign sends in the background without blocking the Vercel serverless environment.
- **Mock Channel Stub**: Includes a standalone Express.js service that simulates realistic network delivery delays and randomized customer engagement (Opens/Clicks/Fails).
- **Live Auto-Rolling Stats**: The dashboard uses server-polling and `framer-motion` spring animations to display numbers that roll upwards in real-time as webhooks return from the channel stub.

### 🎨 3. Premium "Glassmorphic" Design
- **Aesthetics First**: A stunning, modern UI built with Tailwind CSS featuring translucent surfaces, rich micro-animations, and the elegant `Raleway` typeface.
- **Generative UI**: The chat interface doesn't just return text; it streams interactive React components (like variant selection cards and statistical breakdowns) directly into the chat flow.

### 🔒 4. Secure & Enterprise-Ready
- **Strict Data Minimization**: The AI executes database queries securely but never leaks bulk PII (Personally Identifiable Information) into the chat context.
- **Authentication**: Fully integrated with NextAuth.js for secure session management and profile access.

---

## 🏗️ Architecture Stack

```mermaid
flowchart TD
    User([Marketer]) --> UI

    subgraph "Application (Next.js 14 App Router)"
        UI["Frontend (Tailwind CSS)"]
        API["API Routes"]
    end

    subgraph "AI Orchestration"
        VercelAI["Vercel AI SDK"]
        Gemini["Google Gemini Model"]
    end

    subgraph "Data Persistence"
        Prisma["Prisma ORM"]
        Postgres[(PostgreSQL)]
    end

    subgraph "Asynchronous Worker Queue"
        BullMQ["BullMQ"]
        Redis[(Upstash Redis)]
        Worker["Background Worker"]
    end

    UI <-->|Chat & Generative UI| API
    API <-->|Tool Calling| VercelAI
    VercelAI <-->|LLM Inference| Gemini

    API -->|Queries| Prisma
    Prisma <--> Postgres

    API -->|Offload Campaign Sending| BullMQ
    BullMQ <--> Redis
    Redis <--> Worker
    Worker -->|Update Delivery Stats| Postgres
```

### Project Structure
Xeno CRM is built as a lightweight monorepo containing two core applications:
- `apps/crm`: The main Next.js 14 application containing the AI agent, dashboard, landing page, and Prisma database logic.
- `apps/stub`: An independent Express.js service that acts as a "Mock Channel Delivery Network." It simulates the latency of WhatsApp/SMS networks and fires randomized delivery webhooks back to the CRM.

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router) | Server Components & Client interactivity. |
| **Styling** | Tailwind CSS + Framer Motion | Fluid animations and responsive glassmorphism. |
| **AI Orchestration** | Vercel AI SDK v5 | Streaming generative UI and tool execution. |
| **LLM Inference** | Google Gemini | Blisteringly fast inference using Gemini 2.5 models. |
| **Database** | PostgreSQL + Prisma | Strongly typed relational data modeling. |
| **Task Queue** | BullMQ + Upstash Redis | Serverless background job processing. |
| **Webhook Service** | Express.js | Simulates external API delivery & callback webhooks. |

---

## 🚀 Local Setup & Development

### 1. Prerequisites
- Node.js (v18+)
- A local or remote PostgreSQL database (e.g., Supabase)
- An Upstash Redis database url & token
- - A Google AI Studio API Key

### 2. Environment Configuration
Clone the repository and install dependencies:
\`\`\`bash
git clone https://github.com/manveen11/Xeno-CRM.git
cd Xeno-CRM
npm install
\`\`\`

Rename `.env.example` to `.env` and populate your credentials:
\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/xeno_crm"
UPSTASH_REDIS_URL="rediss://..."
UPSTASH_REDIS_TOKEN="..."
GOOGLE_GENERATIVE_AI_API_KEY="..."
CHANNEL_STUB_URL="http://localhost:3001"
CRM_RECEIPT_URL="http://localhost:3000/api/receipt"
NEXTAUTH_SECRET="your_secret"
GOOGLE_CLIENT_ID="your_google_oauth_client_id"
GOOGLE_CLIENT_SECRET="your_google_oauth_client_secret"
\`\`\`

### 3. Database Initialization
Push the schema and seed the database with mock customers (including VIPs and dormant users):
\`\`\`bash
npx prisma migrate dev
npx tsx scripts/seed.ts
\`\`\`

### 4. Running the Application
To see the full lifecycle (including live webhooks), you must run both the CRM and the mock channel service.

**Terminal 1 (The CRM):**
\`\`\`bash
npm run dev
\`\`\`

**Terminal 2 (The Channel Webhook Stub):**
\`\`\`bash
node apps/stub/server.js
\`\`\`

Visit \`http://localhost:3000\` to interact with the agent!

## 🌍 Deployment Guide
Because this project utilizes both serverless edge functions and continuous background processes, it cannot be deployed entirely on a single serverless platform.

### 1. The Core CRM App (Vercel)
Deploy the Next.js application (`apps/crm`) to **Vercel**.
- Vercel perfectly handles the Next.js App Router, Edge API routes, and Server Components.
- Make sure to add all environment variables to your Vercel project settings.
- We have added a `postinstall: "prisma generate"` script, so Vercel will build successfully!

### 2. The Worker & Stub Services (Render / Railway / Fly.io)
Vercel kills serverless functions after 10-15 seconds. It **cannot** run persistent background processes. You must deploy the BullMQ Worker and the Express Stub Service to a persistent host like **Railway, Render, or Fly.io**.
- Simply create a Dockerfile or use the Node.js buildpacks on those platforms to run:
  - `node apps/stub/server.js` (Expose port `3001` or map it to `80`)
  - `npx tsx apps/crm/workers/campaignWorker.ts` (This is a background worker, it does not need a public port)
- *Don't forget to update your `CHANNEL_STUB_URL` and `CRM_RECEIPT_URL` environment variables across all services once deployed!*

---

## 🏆 Hackathon Highlights
- **Zero-Hallucination Fallbacks**: We engineered strict Zod schemas for the AI tools. If the model attempts to invent parameter names, the SDK auto-normalizes them to guarantee execution.
- **Serverless Async Workarounds**: Vercel kills functions after 10-15s. We bypassed this entirely by offloading campaign sends to BullMQ/Redis, enabling infinite scalability for campaign processing.
- **Generative UI**: We moved beyond standard text-based Chatbots by streaming fully functional, interactive React components directly into the chat stream.

<br/>
<div align="center">
  <i>Built with ❤️ by Manveen</i>
</div>
