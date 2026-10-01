'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Shield,
  FileText,
  Zap,
  CheckCircle2,
  Users,
  Search,
  ChevronDown,
  Building2,
  Lock,
  BarChart3,
  Layers,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Play,
  X,
  Server,
  Headphones,
  GitBranch,
  Database,
  Sliders,
  Sparkles,
  ArrowUpRight,
  FolderGit2
} from 'lucide-react'

// 03. Social Proof Logo Bar
const trustedCompanies = [
  { name: 'Deloitte', domain: 'Professional Services' },
  { name: 'Stripe', domain: 'Financial Infrastructure' },
  { name: 'Atlassian', domain: 'Workplace Software' },
  { name: 'Shopify', domain: 'Commerce Engine' },
  { name: 'GitLab', domain: 'DevSecOps Platform' },
  { name: 'Twilio', domain: 'Communications' },
]

// 04. Pain Points Data
const painPoints = [
  {
    badge: 'Silos',
    color: 'indigo',
    title: 'Fragmented Data Silos',
    desc: 'Knowledge scattered across Confluence, Drive, Slack, Jira, and dozens more. No single source of truth exists.',
    impact: '9.3 hrs/wk lost per employee'
  },
  {
    badge: 'Dependencies',
    color: 'amber',
    title: 'Disconnected Workflows',
    desc: 'Engineering waits on Legal. Product blocks on Design. Dependencies are invisible until deadlines break.',
    impact: '3.4 weeks avg project delay'
  },
  {
    badge: 'Overhead',
    color: 'rose',
    title: 'Manual Repetitive Tasks',
    desc: 'Status reports, meeting prep, and compliance checks consume 12+ hours per person per week.',
    impact: '31% of week spent on admin'
  },
  {
    badge: 'Friction',
    color: 'emerald',
    title: 'Siloed Collaboration',
    desc: 'Every meeting starts with 15 minutes of context-sharing. Teams lack shared situational awareness.',
    impact: '4.5 hrs lost in sync meetings'
  }
]

// 05. Interactive Playground Questions & Answers
const demoQueries = [
  {
    id: 'equipment',
    pill: 'Remote Work Equipment Policy',
    query: 'What is our current policy on remote work equipment reimbursement?',
    answer: 'Remote employees are eligible for up to $2,500/year in equipment reimbursement. Requests require manager approval via the HR Portal with a 14-day processing window.',
    details: [
      { label: 'Budget Cap', val: '$2,500 annual cap per employee' },
      { label: 'Approval Flow', val: 'Direct manager + HR sign-off' },
      { label: 'Timeline', val: '14 business days from submission' },
      { label: 'Eligibility', val: 'Full-time remote (6+ months tenure)' },
    ],
    sources: [
      { name: 'HR-Policy-Remote-Equipment-2026.pdf', type: 'PDF Document', time: 'Indexed 2h ago' },
      { name: 'Finance-Reimbursement-Guidelines.md', type: 'Confluence Wiki', time: 'Indexed 1d ago' },
      { name: '#hr-ops Slack — Sarah L. (Oct 2)', type: 'Verified Slack Thread', time: 'Indexed 3d ago' },
    ],
    confidence: 87,
    updated: '2h ago'
  },
  {
    id: 'soc2',
    pill: 'SOC2 Q3 Compliance Status',
    query: 'What is our current SOC2 Type II audit readiness and open exceptions?',
    answer: 'SOC2 Type II annual audit completed with zero non-conformances across Common Criteria (CC). All 43 continuous security monitoring controls in AWS and GitHub are active.',
    details: [
      { label: 'Audit Status', val: 'Passed with clean opinion' },
      { label: 'Auditor', val: 'Ernst & Young LLP' },
      { label: 'Scope', val: 'Security, Availability & Confidentiality' },
      { label: 'Next Cycle', val: 'Renewal prep scheduled Q4 2026' },
    ],
    sources: [
      { name: 'SOC2-Type-II-Report-FY2026.pdf', type: 'Legal Audit File', time: 'Indexed 4h ago' },
      { name: 'Security-Controls-Matrix-v4.xlsx', type: 'Compliance Sheet', time: 'Indexed 12h ago' },
      { name: 'AWS-IAM-Role-Rotations.log', type: 'Infra Telemetry', time: 'Live sync' },
    ],
    confidence: 96,
    updated: '4h ago'
  },
  {
    id: 'pricing',
    pill: 'Enterprise Tier SLA & Terms',
    query: 'What are the enterprise SLA commitments for data isolation and uptime?',
    answer: 'Enterprise Tier guarantees 99.99% uptime with dedicated Single-Tenant VPC isolation, SOC2/HIPAA compliance, and a dedicated 15-minute response SLA from Principal Solutions Engineers.',
    details: [
      { label: 'Guaranteed SLA', val: '99.99% monthly uptime credit backed' },
      { label: 'Data Residency', val: 'Customer-selected AWS or GCP region' },
      { label: 'Encryption', val: 'AES-256 at rest, TLS 1.3 in transit with BYOK' },
      { label: 'Support Window', val: '24/7/365 with 15-min priority triage' },
    ],
    sources: [
      { name: 'Enterprise-MSA-Standard-Template.docx', type: 'Legal Contract', time: 'Indexed 1d ago' },
      { name: 'Service-Level-Agreement-2026.pdf', type: 'Production SLA', time: 'Indexed 2d ago' },
    ],
    confidence: 94,
    updated: '1d ago'
  }
]

// 07. Workflow Steps
const workflowSteps = [
  {
    num: '01',
    name: 'ASK',
    title: 'Natural Query',
    desc: 'Employee asks in plain English via web app, Slack, Microsoft Teams, or API endpoint.',
    highlight: 'Multi-channel ingestion'
  },
  {
    num: '02',
    name: 'CONNECT',
    title: 'Vector Graph',
    desc: 'Semantic engine traverses unified index across 40+ repositories with permission filters.',
    highlight: 'Permission-aware indexing'
  },
  {
    num: '03',
    name: 'ANALYZE',
    title: 'Grounded Reasoning',
    desc: 'Cross-verifies claims against original documents with zero hallucination tolerance.',
    highlight: 'Source-verified synthesis'
  },
  {
    num: '04',
    name: 'ACT',
    title: 'Autonomous Action',
    desc: 'Returns cited answer, triggers dependent workflows, drafts tickets, or routes approvals.',
    highlight: 'Instant automated hand-off'
  }
]

export default function LandingPage() {
  const [activeQueryIndex, setActiveQueryIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(2) // 03 ANALYZE active by default
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const activeQuery = demoQueries[activeQueryIndex]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] selection:bg-indigo-100 selection:text-indigo-900 font-sans antialiased">
      {/* ─────────────────────────────────────────────────────────────
          SECTION 01: NAVIGATION BAR
      ───────────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled
            ? 'bg-[#F8FAFC]/90 backdrop-blur-xl border-b border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
            : 'bg-[#F8FAFC]/80 backdrop-blur-md border-b border-transparent'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-base shadow-sm group-hover:shadow-indigo-500/25 transition-shadow">
              N
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-[19px] tracking-tight text-[#0F172A]">Nexa</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-600 bg-indigo-50 border border-indigo-200/60 px-1.5 py-0.5 rounded">
                Enterprise
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[14px] font-medium text-slate-600">
            <a href="#problems" className="hover:text-slate-900 transition-colors">Problems</a>
            <a href="#interface" className="hover:text-slate-900 transition-colors">Platform Demo</a>
            <a href="#capabilities" className="hover:text-slate-900 transition-colors">Capabilities</a>
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How It Works</a>
            <a href="#compliance" className="hover:text-slate-900 transition-colors">Security</a>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-[14px] font-medium text-slate-700 hover:text-slate-900 px-3.5 py-2 rounded-lg hover:bg-slate-100/80 transition-colors hidden sm:inline-block"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="text-[14px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md hover:shadow-indigo-600/20 transition-all flex items-center gap-1.5 active:scale-[0.98]"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 02: HERO SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Subtle radial ambient gradients (restrained, per spec) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-indigo-500/[0.07] via-violet-500/[0.03] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-[1280px] mx-auto px-6 text-center">
          {/* Label Pill */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200/80 rounded-full px-4 py-1.5 mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[12px] font-semibold text-indigo-700 uppercase tracking-[0.08em]">
              Enterprise Intelligence Platform
            </span>
          </div>

          {/* Headline H1 */}
          <h1 className="text-4xl sm:text-6xl md:text-[64px] font-extrabold text-[#0F172A] tracking-[-0.03em] leading-[1.1] max-w-[840px] mx-auto mb-6">
            Stop searching. <br className="hidden sm:inline" />
            <span className="text-indigo-600">Start knowing.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-[20px] text-slate-600 max-w-[700px] mx-auto mb-10 leading-[1.6] font-normal">
            Nexa connects every document, conversation, and workflow across your organization into one intelligent layer — so your teams spend less time searching and more time building.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-8">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto text-[15px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3.5 rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 group"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full sm:w-auto text-[15px] font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 px-7 py-3.5 rounded-xl shadow-sm hover:border-slate-300 transition-all flex items-center justify-center gap-2.5"
            >
              <Play className="w-4 h-4 text-indigo-600 fill-indigo-600/20" />
              Watch 2-Min Demo
            </button>
          </div>

          {/* Micro trust-line */}
          <p className="text-[12px] text-slate-500 font-medium tracking-tight">
            No credit card required &nbsp;·&nbsp; SOC2 Type II certified &nbsp;·&nbsp; Free for teams up to 10
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 03: SOCIAL PROOF LOGO BAR
      ───────────────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-slate-200/60 bg-white/70 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500 mb-8">
            Trusted by operations & engineering teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {trustedCompanies.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-200 group cursor-default"
              >
                <div className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {c.name.charAt(0)}
                </div>
                <div className="text-left">
                  <span className="font-bold text-[16px] tracking-tight text-slate-800 block leading-none">
                    {c.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {c.domain}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 04: THE PROBLEM STATEMENT
      ───────────────────────────────────────────────────────────── */}
      <section id="problems" className="py-24 bg-white">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="text-center max-w-[720px] mx-auto mb-16">
            <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-indigo-600 block mb-3">
              The Problem
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-[-0.02em] mb-5">
              Your organization's knowledge is trapped.
            </h2>
            <p className="text-[17px] text-slate-600 leading-relaxed">
              Critical information lives in 40+ disconnected tools. Your teams waste 30% of their week searching, re-creating, and re-explaining what already exists somewhere in the company. This isn't a search problem — it's a structural one.
            </p>
          </div>

          {/* 2x2 Pain Point Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {painPoints.map((item, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 rounded-2xl p-7 hover:border-indigo-300 hover:shadow-[0_4px_20px_rgba(79,70,229,0.06)] transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-[11px] font-mono font-semibold uppercase px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                    P-{idx + 1} &nbsp;·&nbsp; {item.badge}
                  </span>
                  <span className="text-[12px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    {item.impact}
                  </span>
                </div>
                <h3 className="text-[19px] font-semibold text-[#0F172A] mb-2.5 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[15px] text-slate-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 05: AI INTERACTION INTERFACE (ASK & ANSWER)
      ───────────────────────────────────────────────────────────── */}
      <section id="interface" className="py-24 bg-[#F8FAFC] border-t border-slate-200/70 relative">
        <div className="max-w-[1040px] mx-auto px-6">
          <div className="text-center max-w-[700px] mx-auto mb-12">
            <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-indigo-600 block mb-3">
              Nexa In Action
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-[-0.02em] mb-4">
              Ask anything. Get answers with verified sources.
            </h2>
            <p className="text-[17px] text-slate-600 leading-relaxed">
              Nexa doesn't just search — it reasons across your entire knowledge base and delivers structured, cited answers your team can stake decisions on.
            </p>
          </div>

          {/* Interactive Query Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="text-[12px] font-medium text-slate-500 mr-2">Try enterprise queries:</span>
            {demoQueries.map((dq, idx) => (
              <button
                key={dq.id}
                onClick={() => setActiveQueryIndex(idx)}
                className={`text-[13px] font-medium px-3.5 py-1.5 rounded-full transition-all ${
                  activeQueryIndex === idx
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {dq.pill}
              </button>
            ))}
          </div>

          {/* The Nexa Interface Mockup */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
            {/* Top Bar / Search Input */}
            <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-inner">
                <Search className="w-5 h-5 text-indigo-600 shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={activeQuery.query}
                  className="w-full bg-transparent text-[15px] font-medium text-slate-900 focus:outline-none"
                />
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-[11px] font-mono text-slate-500">
                  <span>Enter</span>
                </div>
              </div>
            </div>

            {/* Response Area */}
            <div className="p-6 sm:p-8">
              {/* Answer Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-[11px] font-bold">
                    ◆
                  </div>
                  <span className="text-[13px] font-bold uppercase tracking-wider text-indigo-700">
                    Nexa Synthesized Answer
                  </span>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full">
                    Grounded & Verified
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(activeQuery.answer)}
                  className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 hover:text-slate-800 transition-colors bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {/* Main Executive Summary */}
              <div className="border-l-4 border-indigo-500 pl-4 py-1 mb-6 bg-indigo-50/30 rounded-r-lg">
                <p className="text-[16px] text-slate-800 leading-relaxed font-normal">
                  {activeQuery.answer}
                </p>
              </div>

              {/* Structured Key Details Grid */}
              <div className="mb-6">
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Structured Extraction
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeQuery.details.map((d, i) => (
                    <div
                      key={i}
                      className="bg-slate-50/80 border border-slate-200/60 rounded-lg p-3 flex items-start justify-between"
                    >
                      <span className="text-[13px] font-medium text-slate-500">{d.label}</span>
                      <span className="text-[13px] font-semibold text-slate-900 text-right">{d.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Source Documents Cited */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70 mb-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    Citations & Source Verification ({activeQuery.sources.length})
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Strict zero-hallucination model</span>
                </div>
                <div className="space-y-2">
                  {activeQuery.sources.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white border border-slate-200/70 rounded-lg px-3 py-2 text-[13px] hover:border-indigo-300 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                        <span className="font-mono text-slate-800 font-medium">{s.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-400">{s.type}</span>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {s.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confidence & Telemetry Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-100 text-[12px] text-slate-500 gap-3">
                <div className="flex items-center gap-3">
                  <span>Confidence Score:</span>
                  <div className="w-28 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${activeQuery.confidence}%` }}
                    />
                  </div>
                  <span className="font-semibold text-slate-700">{activeQuery.confidence}%</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>Audit Trail: <strong className="text-slate-700">SHA-256 Verified</strong></span>
                  <span>Sync: <strong className="text-slate-700">{activeQuery.updated}</strong></span>
                  <Link
                    href="/dashboard"
                    className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1"
                  >
                    Open in Workspace <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 06: CAPABILITY GRID (4 PILLARS)
      ───────────────────────────────────────────────────────────── */}
      <section id="capabilities" className="py-24 bg-white border-t border-slate-200/70">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="text-center max-w-[720px] mx-auto mb-16">
            <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-indigo-600 block mb-3">
              Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-[-0.02em] mb-4">
              Four pillars of organizational intelligence.
            </h2>
            <p className="text-[17px] text-slate-600 leading-relaxed">
              Every tool modern enterprises need to transform stagnant document silos into an active, automated engine for cross-functional execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Knowledge Graph */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all group">
              {/* Illustration Top (220px) */}
              <div className="h-56 bg-slate-50/80 border-b border-slate-100 p-6 flex flex-col justify-center relative overflow-hidden">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="text-[11px] font-semibold text-slate-700">Google Drive</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">1,420 files indexed</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[11px] font-semibold text-slate-700">Slack Channels</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">84 active syncs</p>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-[11px] font-semibold text-slate-700">Jira & Confluence</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono">12k tickets linked</p>
                  </div>
                </div>
                {/* Visual connectors */}
                <div className="mt-4 bg-indigo-50/70 border border-indigo-200/60 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-600" />
                    <span className="text-[12px] font-semibold text-indigo-900">Unified Knowledge Graph</span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-600 bg-white px-2 py-0.5 rounded shadow-2xs">
                    Continuous Graph Sync
                  </span>
                </div>
              </div>
              {/* Text Bottom */}
              <div className="p-7">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[19px] font-semibold text-[#0F172A]">Unified Knowledge Graph</h3>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    150+ Integrations
                  </span>
                </div>
                <p className="text-[15px] text-slate-600 leading-relaxed mb-4">
                  Connect 40+ data sources without migrating files. Every document, thread, and policy is automatically indexed, linked, and searchable under your strict enterprise RBAC.
                </p>
                <Link href="/dashboard/documents" className="text-[13px] font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">
                  Explore Document Lake <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 2: Workflow Orchestration */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all group">
              <div className="h-56 bg-slate-50/80 border-b border-slate-100 p-6 flex flex-col justify-center relative overflow-hidden">
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Workflow: Legal Vendor Review</span>
                    <span className="text-amber-600 font-semibold">Active Dependency</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-emerald-50 border border-emerald-200 p-2 rounded text-center">
                      <span className="text-[10px] font-semibold text-emerald-800 block">1. Security Signoff</span>
                      <span className="text-[9px] text-emerald-600 font-mono">Completed</span>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-200 p-2 rounded text-center">
                      <span className="text-[10px] font-semibold text-indigo-800 block">2. Redline Review</span>
                      <span className="text-[9px] text-indigo-600 font-mono">In Progress</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-2 rounded text-center">
                      <span className="text-[10px] font-semibold text-slate-600 block">3. CFO Approval</span>
                      <span className="text-[9px] text-slate-400 font-mono">Queued</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-7">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[19px] font-semibold text-[#0F172A]">Cross-Team Workflows</h3>
                  <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                    Real-time Signals
                  </span>
                </div>
                <p className="text-[15px] text-slate-600 leading-relaxed mb-4">
                  Detect cross-team bottlenecks automatically. When engineering touches code that impacts compliance, Nexa proactively flags the dependency before deadlines slip.
                </p>
                <Link href="/dashboard/workflows" className="text-[13px] font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">
                  View Workflows <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3: Trigger Automation */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all group">
              <div className="h-56 bg-slate-50/80 border-b border-slate-100 p-6 flex flex-col justify-center relative overflow-hidden">
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs space-y-2">
                  <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-800">
                    <span className="w-5 h-5 rounded bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px]">IF</span>
                    <span>New vendor contract PDF uploaded to Drive</span>
                  </div>
                  <div className="flex items-center gap-2 pl-3 border-l-2 border-slate-200 ml-2.5 text-[12px] font-semibold text-slate-800">
                    <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">THEN</span>
                    <span>Extract indemnification & SLA clauses</span>
                  </div>
                  <div className="flex items-center gap-2 pl-3 border-l-2 border-slate-200 ml-2.5 text-[12px] font-semibold text-slate-800">
                    <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">DO</span>
                    <span>Post risk summary to #legal-review</span>
                  </div>
                </div>
              </div>
              <div className="p-7">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[19px] font-semibold text-[#0F172A]">Intelligent Automation</h3>
                  <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                    No-code Builder
                  </span>
                </div>
                <p className="text-[15px] text-slate-600 leading-relaxed mb-4">
                  Event-driven multi-step automations that listen to your tech stack and execute administrative handoffs with zero human babysitting required.
                </p>
                <Link href="/dashboard/workflows" className="text-[13px] font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">
                  Configure Triggers <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 4: Contextual Workspaces */}
            <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:border-slate-300 hover:shadow-lg transition-all group">
              <div className="h-56 bg-slate-50/80 border-b border-slate-100 p-6 flex flex-col justify-center relative overflow-hidden">
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-semibold text-slate-900">Project Apollo · Q4 Launch</span>
                    <span className="text-[10px] text-violet-600 bg-violet-50 px-2 py-0.5 rounded font-medium">8 Members</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="bg-slate-50 p-1.5 rounded flex items-center justify-between text-[11px] text-slate-600">
                      <span>📌 Product Requirements Doc (Final)</span>
                      <span className="text-[10px] text-slate-400">Notion</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded flex items-center justify-between text-[11px] text-slate-600">
                      <span>📌 Security Architecture Diagram</span>
                      <span className="text-[10px] text-slate-400">Miro</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-7">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[19px] font-semibold text-[#0F172A]">Contextual Workspaces</h3>
                  <span className="text-[11px] font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                    AI-Curated Context
                  </span>
                </div>
                <p className="text-[15px] text-slate-600 leading-relaxed mb-4">
                  Every project channel surfaces relevant past decisions, customer tickets, and engineering designs automatically so new team members onboard in minutes, not months.
                </p>
                <Link href="/dashboard/workspace" className="text-[13px] font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">
                  Open Workspaces <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 07: WORKFLOW VISUALIZATION (THE ONLY DARK SECTION)
      ───────────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-[#0F172A] text-white relative overflow-hidden">
        <div className="max-w-[1120px] mx-auto px-6 relative z-10">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-indigo-400 block mb-3">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] mb-4 text-white">
              From question to action in seconds.
            </h2>
            <p className="text-[17px] text-slate-300 leading-relaxed">
              Behind Nexa's simple interface sits a high-throughput enterprise intelligence pipeline engineered for accuracy, governance, and speed.
            </p>
          </div>

          {/* 4-Step Interactive Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowSteps.map((step, idx) => {
              const isActive = activeWorkflowStep === idx
              return (
                <div
                  key={step.num}
                  onClick={() => setActiveWorkflowStep(idx)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-200 border ${
                    isActive
                      ? 'bg-white/[0.09] border-indigo-400 shadow-[0_0_24px_rgba(99,102,241,0.25)] ring-1 ring-indigo-400/40'
                      : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.14]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[13px] font-semibold text-indigo-400">
                      STEP {step.num}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded tracking-wide ${
                        isActive
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  <h3 className="text-[18px] font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-slate-400 leading-relaxed mb-4">
                    {step.desc}
                  </p>
                  <div className="pt-3 border-t border-white/[0.08]">
                    <span className="text-[11px] font-mono text-indigo-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      {step.highlight}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Flow Indicator Bar */}
          <div className="mt-12 bg-white/[0.05] border border-white/[0.08] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[13px] text-slate-300 font-mono">
                Average pipeline latency: <strong className="text-white">1.82 seconds</strong> from query to cited resolution
              </span>
            </div>
            <Link
              href="/dashboard/search"
              className="text-[13px] font-semibold text-indigo-300 hover:text-white flex items-center gap-1.5"
            >
              Test Live Query Engine <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 08: METRICS / ROI
      ───────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-slate-200/70">
        <div className="max-w-[1120px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-200/70 text-center">
            <div className="pt-6 md:pt-0 md:px-6">
              <span className="block text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-2">
                73%
              </span>
              <p className="text-[14px] text-slate-500 font-medium">
                Less time searching for information
              </p>
            </div>
            <div className="pt-6 md:pt-0 md:px-6">
              <span className="block text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-2">
                4.2×
              </span>
              <p className="text-[14px] text-slate-500 font-medium">
                Faster cross-team decision-making
              </p>
            </div>
            <div className="pt-6 md:pt-0 md:px-6">
              <span className="block text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-2">
                12 hrs
              </span>
              <p className="text-[14px] text-slate-500 font-medium">
                Saved per employee per week
              </p>
            </div>
            <div className="pt-6 md:pt-0 md:px-6">
              <span className="block text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight mb-2">
                94%
              </span>
              <p className="text-[14px] text-slate-500 font-medium">
                Active adoption within 90 days
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 09: TESTIMONIAL
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-[800px] mx-auto px-6 text-center">
          <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600 font-bold mx-auto mb-8 shadow-xs">
            “
          </div>
          <blockquote className="text-xl sm:text-2xl font-normal text-[#0F172A] leading-relaxed mb-8 italic">
            "We replaced 6 disconnected internal tools with Nexa. Our teams went from spending 12 hours a week hunting down answers to resolving operational questions in under 30 seconds. It fundamentally changed our velocity."
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              SC
            </div>
            <div className="text-left">
              <div className="font-semibold text-[15px] text-[#0F172A]">Sarah Chen</div>
              <div className="text-[13px] text-slate-500">VP of Global Operations, TechScale Inc.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 10: ENTERPRISE TRUST & COMPLIANCE
      ───────────────────────────────────────────────────────────── */}
      <section id="compliance" className="py-24 bg-white border-t border-slate-200/70">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="text-center max-w-[640px] mx-auto mb-16">
            <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-indigo-600 block mb-3">
              Trust & Governance
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-[-0.02em] mb-4">
              Built for the world’s strictest security standards.
            </h2>
            <p className="text-[16px] text-slate-600">
              Zero training on customer data. Full customer isolation. End-to-end cryptographic audit trails.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Col 1: Security */}
            <div className="text-center p-6 rounded-2xl bg-slate-50/60 border border-slate-200/70">
              <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2">
                Enterprise-Grade Security
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed font-mono">
                SOC2 Type II &nbsp;·&nbsp; GDPR &nbsp;·&nbsp; HIPAA &nbsp;·&nbsp; SSO / SAML 2.0 &nbsp;·&nbsp; AES-256
              </p>
            </div>

            {/* Col 2: Deployment */}
            <div className="text-center p-6 rounded-2xl bg-slate-50/60 border border-slate-200/70">
              <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2">
                Flexible Deployment
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed font-mono">
                Multi-Tenant Cloud &nbsp;·&nbsp; Dedicated VPC &nbsp;·&nbsp; Hybrid &nbsp;·&nbsp; Air-Gapped
              </p>
            </div>

            {/* Col 3: Support */}
            <div className="text-center p-6 rounded-2xl bg-slate-50/60 border border-slate-200/70">
              <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="text-[17px] font-semibold text-[#0F172A] mb-2">
                Dedicated Support
              </h3>
              <p className="text-[13px] text-slate-600 leading-relaxed font-mono">
                99.99% SLA &nbsp;·&nbsp; Dedicated CSM &nbsp;·&nbsp; 24/7/365 Escalation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 11: FINAL CALL TO ACTION
      ───────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-b from-[#F8FAFC] to-white border-t border-slate-200/70 text-center">
        <div className="max-w-[700px] mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] tracking-[-0.02em] mb-4">
            Ready to unify your organization's intelligence?
          </h2>
          <p className="text-lg text-slate-600 mb-8 font-normal">
            Start free. Deploy in minutes. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-5">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto text-[15px] font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 group"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <p className="text-[13px] text-slate-500">
            Need an enterprise evaluation plan?{' '}
            <Link href="/dashboard" className="text-indigo-600 font-semibold hover:underline">
              Schedule demo with solutions team →
            </Link>
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          SECTION 12: FOOTER (DEEP NAVY)
      ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#0F172A] text-slate-400 py-16 text-[13px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            {/* Col 1: Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-base shadow-sm">
                  N
                </div>
                <span className="font-bold text-[19px] tracking-tight text-white">Nexa</span>
              </div>
              <p className="text-slate-400 italic text-[14px] max-w-sm mb-4">
                "Where Knowledge Becomes Action."
              </p>
              <p className="text-[12px] text-slate-500 max-w-sm">
                The enterprise operating system for organizational knowledge — unifying documents, automating cross-team workflows, and accelerating high-stakes decisions.
              </p>
            </div>

            {/* Col 2: Product */}
            <div>
              <span className="font-semibold text-white uppercase text-[11px] tracking-wider block mb-3">
                Platform
              </span>
              <ul className="space-y-2">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Overview</Link></li>
                <li><Link href="/dashboard/documents" className="hover:text-white transition-colors">Knowledge Lake</Link></li>
                <li><Link href="/dashboard/workflows" className="hover:text-white transition-colors">Workflow Engine</Link></li>
                <li><Link href="/dashboard/search" className="hover:text-white transition-colors">Semantic Search</Link></li>
                <li><Link href="/dashboard/decision" className="hover:text-white transition-colors">Decision Center</Link></li>
              </ul>
            </div>

            {/* Col 3: Company */}
            <div>
              <span className="font-semibold text-white uppercase text-[11px] tracking-wider block mb-3">
                Company
              </span>
              <ul className="space-y-2">
                <li><a href="#problems" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#compliance" className="hover:text-white transition-colors">Security & Trust</a></li>
                <li><a href="#capabilities" className="hover:text-white transition-colors">Customers</a></li>
                <li><a href="#interface" className="hover:text-white transition-colors">Changelog</a></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Careers (We're Hiring)</Link></li>
              </ul>
            </div>

            {/* Col 4: Legal & Governance */}
            <div>
              <span className="font-semibold text-white uppercase text-[11px] tracking-wider block mb-3">
                Governance
              </span>
              <ul className="space-y-2">
                <li><a href="#compliance" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#compliance" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#compliance" className="hover:text-white transition-colors">SOC2 Compliance</a></li>
                <li><a href="#compliance" className="hover:text-white transition-colors">GDPR & HIPAA</a></li>
                <li><a href="#compliance" className="hover:text-white transition-colors">Security Disclosures</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[12px]">
            <div>
              © 2026 Nexa Technologies, Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                All systems operational (99.998%)
              </span>
              <Link href="/dashboard" className="hover:text-slate-300">Privacy</Link>
              <Link href="/dashboard" className="hover:text-slate-300">Terms</Link>
              <Link href="/dashboard" className="hover:text-slate-300">Status</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          MODAL: INTERACTIVE PLATFORM DEMO
      ───────────────────────────────────────────────────────────── */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                  N
                </div>
                <span className="font-semibold text-slate-900 text-sm">Nexa Platform Interactive Tour</span>
              </div>
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200/60 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-4">
                <h4 className="font-semibold text-indigo-950 text-sm mb-1">
                  Ready to experience Nexa in real-time?
                </h4>
                <p className="text-xs text-indigo-800/80 leading-relaxed">
                  You can explore the fully functional dashboard, semantic search with source citations, document intelligence pipeline, and autonomous workflow engine right now.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <Link
                  href="/dashboard/search"
                  className="p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all block"
                >
                  <strong className="block text-slate-900 font-semibold mb-0.5">Semantic Search</strong>
                  <span className="text-slate-500">Grounded answers with source citations</span>
                </Link>
                <Link
                  href="/dashboard/documents"
                  className="p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all block"
                >
                  <strong className="block text-slate-900 font-semibold mb-0.5">Knowledge Lake</strong>
                  <span className="text-slate-500">Auto-extracted SOPs and policies</span>
                </Link>
                <Link
                  href="/dashboard/workflows"
                  className="p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all block"
                >
                  <strong className="block text-slate-900 font-semibold mb-0.5">Workflows</strong>
                  <span className="text-slate-500">Dependency detection and triggers</span>
                </Link>
                <Link
                  href="/dashboard/decision"
                  className="p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all block"
                >
                  <strong className="block text-slate-900 font-semibold mb-0.5">Decision Center</strong>
                  <span className="text-slate-500">Automated SWOT & trade-off graphs</span>
                </Link>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsDemoModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-200/60 transition-colors"
              >
                Close
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1.5"
              >
                Launch Live Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
