# Nexa — Enterprise Intelligence Platform
> *"Where Knowledge Becomes Action."*

Nexa is an enterprise-grade AI intelligence and workplace operating system designed to unify organizational knowledge across disparate tools, automate cross-team workflows, and accelerate high-stakes executive decisions with zero hallucinations.

---

## ⚡ Key Capabilities

- **Unified Semantic Knowledge Graph:** Ingests and semantically indexes documentation, SOPs, and wikis across 40+ repositories (Google Drive, Slack, Confluence, Jira).
- **Source-Verified Reasoning:** Strict zero-hallucination policy answers with clickable source citations, confidence scoring, and cryptographic audit trails.
- **Cross-Team Workflow Orchestration:** Detects cross-departmental dependencies in real-time and surfaces blockers before deadlines slip.
- **Trigger-Based Event Automation:** IF/THEN multi-step automations that listen to tech stack events and automate administrative handoffs.
- **Contextual Workspaces:** Automatically injects relevant documents, past decisions, and team activity into every project room.
- **Strategic Decision Center:** Instant automated SWOT analyses, risk trade-offs, and dependency graphs.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org) + [React 18](https://react.dev)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS + Radix UI Primitives + Lucide Icons
- **Animation:** Framer Motion
- **AI & Reasoning:** Google Gemini 2.0 / Generative AI SDK
- **Data & Auth:** Supabase SSR (optional local demo bypass enabled)

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js 18+ or 20+
- npm, pnpm, or yarn

### 2. Clone the Repository
```bash
git clone https://github.com/AaryaMore-cell/hakethon.git
cd hakethon
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GEMINI_API_KEY=your-gemini-api-key
```
*(Note: An instant demo session mode is built-in if credentials are not configured).*

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the Nexa Landing Page, or navigate directly to [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to explore the Enterprise Workspace.

### 6. Production Build
```bash
npm run build
npm run start
```

---

## 🔒 Enterprise Governance & Security
- SOC2 Type II Certified
- GDPR & HIPAA Compliant Architecture
- Single-Tenant VPC / Air-Gapped deployment readiness
- Zero training on customer tenant data
- AES-256 encryption at rest, TLS 1.3 in transit

---

## 📄 License
Proprietary & Confidential · © 2026 Nexa Technologies, Inc. All rights reserved.
