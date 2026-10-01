'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MessageSquare,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
  Users,
  Search,
  Check,
  ChevronRight,
  Send,
  Plus,
  Compass,
  FileCheck2,
  BarChart3,
  Activity,
  Target,
  Calendar,
  Cpu,
  Globe,
} from 'lucide-react'

// â”€â”€ Mock data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const kpis = [
  { label: 'Tasks Complete', value: '34', total: '41', pct: 83, delta: '+12%', up: true, color: '#5b6af0' },
  { label: 'Docs Analyzed', value: '218', total: null, pct: null, delta: '+8 today', up: true, color: '#10b981' },
  { label: 'Pending Approvals', value: '3', total: null, pct: null, delta: '2 critical', up: false, color: '#f59e0b' },
  { label: 'AI Queries Today', value: '47', total: null, pct: null, delta: '+23%', up: true, color: '#8b5cf6' },
]

const departments = ['All Departments', 'Engineering & Tech', 'Product Management', 'People & HR Ops', 'Legal & Compliance', 'Finance & Strategy']

const initialTasks = [
  { id: 1, title: 'Review vendor DPA data privacy terms', priority: 'critical', dept: 'Legal', est: '1.5h', done: false, aiSuggested: true },
  { id: 2, title: 'Approve Phase 2 cloud migration architecture', priority: 'high', dept: 'Engineering', est: '2.0h', done: false, aiSuggested: false },
  { id: 3, title: 'Distribute Q4 remote workplace stipend guidelines', priority: 'medium', dept: 'HR Ops', est: '0.5h', done: true, aiSuggested: true },
  { id: 4, title: 'Prepare executive SWOT report for board review', priority: 'high', dept: 'Strategy', est: '3.0h', done: false, aiSuggested: true },
  { id: 5, title: 'Rotate production AWS KMS master keys', priority: 'critical', dept: 'Security', est: '1.0h', done: true, aiSuggested: false },
]

const recentDocs = [
  { id: '1', name: 'Master-Services-Agreement-v3.pdf', type: 'Contract', date: '12m ago', status: 'Analyzed', risk: 'low' },
  { id: '2', name: 'Engineering-RFC-ZeroTrust-Auth.md', type: 'SOP', date: '1h ago', status: 'Indexed', risk: 'none' },
  { id: '3', name: 'Employee-Leave-Travel-Policy-2026.pdf', type: 'Policy', date: '3h ago', status: 'Analyzed', risk: 'none' },
  { id: '4', name: 'SOC2-TypeII-Security-Audit.pdf', type: 'Report', date: 'Yesterday', status: 'Indexed', risk: 'medium' },
]

const pendingApprovals = [
  { id: 1, title: 'Vendor SaaS Annual Renewal ($45,000)', requestedBy: 'Elena R. (Eng)', type: 'Budget', urgency: 'High' },
  { id: 2, title: 'Customer Data Processing Addendum', requestedBy: 'Marcus V. (Legal)', type: 'Compliance', urgency: 'Critical' },
  { id: 3, title: 'Q4 Headcount Allocation â€” 2 Backend Eng', requestedBy: 'Alex K. (Tech)', type: 'Headcount', urgency: 'Medium' },
]

const upcomingMeetings = [
  { id: 1, title: 'Architecture Review: Vector RAG Latency', time: '11:30 AM', note: 'In 25 min', attendees: 5, hasPreBrief: true },
  { id: 2, title: 'Bi-Weekly Enterprise Security Sync', time: '2:00 PM', attendees: 8, hasPreBrief: false },
  { id: 3, title: 'Quarterly OKR Planning & Roadmapping', time: '4:15 PM', attendees: 12, hasPreBrief: true },
]

const teamActivity = [
  { user: 'Sarah Lin', dept: 'Legal', action: 'extracted risks from', target: 'Vendor-NDA-Acme.pdf', time: '4m ago', avatar: 'SL' },
  { user: 'David Kim', dept: 'Product', action: 'generated roadmap for', target: 'Enterprise Mobile App v2', time: '18m ago', avatar: 'DK' },
  { user: 'Alex Morgan', dept: 'Eng', action: 'queried knowledge base for', target: 'OAuth2 Token Expiry Policy', time: '35m ago', avatar: 'AM' },
  { user: 'Priya Shah', dept: 'HR', action: 'summarized compliance docs for', target: 'Remote Work Policy 2026', time: '52m ago', avatar: 'PS' },
]

const priorityStyle: Record<string, string> = {
  critical: 'badge-critical',
  high:     'badge-high',
  medium:   'badge-medium',
  low:      'badge-low',
}

const riskColor: Record<string, string> = {
  low:    'text-emerald-600 bg-emerald-50 border-emerald-200',
  medium: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
  high:   'text-rose-400 bg-rose-500/10 border-rose-500/20',
  none:   'text-slate-500 bg-white/[0.04] border-white/[0.06]',
}

// â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function NexaDashboardPage() {
  const [selectedDept, setSelectedDept] = useState('All Departments')
  const [tasks, setTasks] = useState(initialTasks)
  const [newTaskInput, setNewTaskInput] = useState('')
  const [quickQuery, setQuickQuery] = useState('')

  const toggleTask = (id: number) =>
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskInput.trim()) return
    setTasks([{ id: Date.now(), title: newTaskInput.trim(), priority: 'medium', dept: 'General', est: '1.0h', done: false, aiSuggested: false }, ...tasks])
    setNewTaskInput('')
  }

  return (
    <div className="space-y-5 animate-fade-up">

      {/* â”€â”€ 1. WORKSPACE COMMAND BAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full">
              <Activity className="w-3 h-3" />
              Live Workspace
            </span>
            <span className="text-[11px] text-slate-400">Â·</span>
            <span className="text-[11px] text-slate-500">Sprint 14 Â· Week 3</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-[-0.02em]">
            Workplace Overview
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            <span className="text-slate-400 font-medium">3 items</span> require your attention across Legal, Engineering, and Strategy.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0">
          <select
            value={selectedDept}
            onChange={e => setSelectedDept(e.target.value)}
            className="text-[12px] text-slate-300 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
          >
            {departments.map((d, i) => <option key={i} value={d} className="bg-[#0d0e1a]">{d}</option>)}
          </select>

          <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#5b6af0] hover:bg-[#4e5de0] text-slate-800 text-[12px] font-semibold transition-colors shadow-md shadow-indigo-500/20">
            <Plus className="w-3.5 h-3.5" />
            New Task
          </button>
        </div>
      </div>

      {/* â”€â”€ 2. KPI METRICS ROW â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="glass-card rounded-xl p-4 hover:border-white/[0.08] transition-all duration-200 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-[11px] text-slate-500 font-medium">{kpi.label}</span>
              <span className={`flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${kpi.up ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-500/10'}`}>
                {kpi.up ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                {kpi.delta}
              </span>
            </div>
            <div className="flex items-end gap-2 mb-2.5">
              <span className="text-2xl font-bold text-slate-800 tracking-tight leading-none">{kpi.value}</span>
              {kpi.total && <span className="text-sm text-slate-600 mb-0.5">/ {kpi.total}</span>}
            </div>
            {kpi.pct !== null && (
              <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${kpi.pct}%`, background: kpi.color }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* â”€â”€ 3. QUICK COMMAND SEARCH â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="glass-card rounded-xl flex items-center gap-3 px-4 py-3">
        <Search className="w-4 h-4 text-indigo-600 flex-shrink-0" />
        <input
          type="text"
          value={quickQuery}
          onChange={e => setQuickQuery(e.target.value)}
          placeholder="Ask Nexa across all company knowledge, documents, SOPs, and workflows..."
          className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
        />
        <Link
          href={`/dashboard/chat?q=${encodeURIComponent(quickQuery || 'Help me prioritize today')}`}
          className="flex items-center gap-2 text-[12px] font-semibold px-3.5 py-1.5 rounded-lg bg-[#5b6af0] hover:bg-[#4e5de0] text-slate-800 transition-colors"
        >
          <span>Ask Nexa</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* â”€â”€ 4. MAIN 3-COLUMN GRID â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* â”€â”€ LEFT: TASKS + APPROVALS â”€â”€ */}
        <div className="space-y-4">

          {/* Tasks widget */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                </div>
                <span className="text-[13px] font-semibold text-slate-800">Smart Tasks</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {tasks.filter(t => t.done).length}/{tasks.length} done
              </span>
            </div>

            {/* Add task */}
            <form onSubmit={handleAddTask} className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTaskInput}
                onChange={e => setNewTaskInput(e.target.value)}
                placeholder="Add a task..."
                className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-[12px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/40"
              />
              <button type="submit" className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-[12px] font-semibold text-slate-300 border border-white/[0.08] transition-colors">
                Add
              </button>
            </form>

            <div className="space-y-2 max-h-[280px] overflow-y-auto pr-0.5">
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all duration-150 ${
                    task.done
                      ? 'opacity-45 border-white/[0.04] bg-white/[0.02]'
                      : 'border-white/[0.07] bg-white/[0.03] hover:border-indigo-400 hover:bg-indigo-500/[0.04]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-[5px] border mt-0.5 flex items-center justify-center flex-shrink-0 transition-all ${
                    task.done ? 'bg-[#5b6af0] border-[#5b6af0]' : 'border-slate-300'
                  }`}>
                    {task.done && <Check className="w-2.5 h-2.5 text-slate-800" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[12px] font-medium leading-snug ${task.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                      <Clock className="w-2.5 h-2.5" />
                      <span className="font-mono">{task.est}</span>
                      <span>Â·</span>
                      <span>{task.dept}</span>
                      {task.aiSuggested && (
                        <span className="text-indigo-600 flex items-center gap-0.5 font-semibold">
                          <Sparkles className="w-2 h-2" /> AI
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${priorityStyle[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>

            <Link href="/dashboard/planner" className="mt-4 pt-3 flex items-center justify-between text-[12px] font-semibold text-indigo-600 hover:text-indigo-500 transition-colors" style={{ borderTop: '1px solid rgba(255,255,255,0.055)' }}>
              <span>Auto-generate task list with AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pending Approvals */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-50 flex items-center justify-center">
                  <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />
                </div>
                <span className="text-[13px] font-semibold text-slate-800">Pending Approvals</span>
              </div>
              <span className="text-[10px] font-mono text-purple-500 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                {pendingApprovals.length} items
              </span>
            </div>

            <div className="space-y-2.5">
              {pendingApprovals.map(app => (
                <div key={app.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <p className="text-[12px] font-medium text-slate-700 leading-snug">{app.title}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 uppercase ${
                      app.urgency === 'Critical' ? 'badge-critical' : app.urgency === 'High' ? 'badge-high' : 'badge-medium'
                    }`}>
                      {app.urgency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">{app.requestedBy}</span>
                    <div className="flex gap-1.5">
                      <button className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 transition-colors">Approve</button>
                      <button className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-white/[0.05] text-slate-400 border border-white/[0.08] hover:bg-white/[0.08] transition-colors">Review</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* â”€â”€ CENTER: DOCUMENTS + MEETINGS â”€â”€ */}
        <div className="space-y-4">

          {/* Recent Documents */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <span className="text-[13px] font-semibold text-slate-800">Recent Documents</span>
              </div>
              <Link href="/dashboard/documents" className="text-[11px] text-indigo-600 hover:text-indigo-500 font-semibold transition-colors">
                View all â†’
              </Link>
            </div>

            <div className="space-y-2.5">
              {recentDocs.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-300 hover:bg-indigo-500/[0.04] transition-all cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-slate-700 truncate">{doc.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{doc.type} Â· {doc.date}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md uppercase border ${riskColor[doc.risk]}`}>
                      {doc.status}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/dashboard/documents"
              className="mt-4 block w-full py-2.5 rounded-xl border border-dashed text-center text-[12px] font-semibold text-slate-600 hover:text-slate-400 hover:border-indigo-400 transition-all"
              style={{ borderColor: 'rgba(255,255,255,0.07)' }}
            >
              + Upload & Analyze Document
            </Link>
          </div>

          {/* Upcoming Meetings */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-sky-50 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-sky-600" />
                </div>
                <span className="text-[13px] font-semibold text-slate-800">Today's Schedule</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="space-y-3">
              {upcomingMeetings.map(m => (
                <div key={m.id} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-[12px] font-medium text-slate-700 leading-snug">{m.title}</p>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-[11px] font-bold text-sky-600 font-mono">{m.time}</p>
                      {m.note && <p className="text-[10px] text-amber-600">{m.note}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">{m.attendees} attendees</span>
                    <div className="flex gap-2">
                      {m.hasPreBrief && (
                        <Link href="/dashboard/chat?q=Give+me+a+pre-briefing+for+my+meeting" className="text-[10px] text-indigo-600 hover:text-indigo-500 font-semibold flex items-center gap-1 transition-colors">
                          <Sparkles className="w-3 h-3" /> Pre-brief
                        </Link>
                      )}
                      <Link href="/dashboard/planner" className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors">
                        Summarize
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* â”€â”€ RIGHT: AI INSIGHTS + ACTIVITY â”€â”€ */}
        <div className="space-y-4">

          {/* AI Strategic Insights */}
          <div className="glass-card rounded-2xl p-5" style={{ background: 'rgba(91,106,240,0.04)', border: '1px solid rgba(91,106,240,0.12)' }}>
            <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid rgba(91,106,240,0.12)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <span className="text-[13px] font-semibold text-slate-800">Nexa Insights</span>
              </div>
              <span className="text-[9px] font-semibold text-indigo-500 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full uppercase tracking-wide">Live</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-amber-600 text-[11px] font-bold mb-1.5">
                  <AlertTriangle className="w-3 h-3" /> Cross-Team Blocker
                </div>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  Phase 2 Cloud Migration is blocked by Legal's pending DPA review. Resolving unlocks <span className="text-slate-800 font-semibold">4 engineering tasks</span>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-emerald-600 text-[11px] font-bold mb-1.5">
                  <Zap className="w-3 h-3" /> Knowledge Gap Detected
                </div>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  <span className="text-slate-800 font-semibold">12 employees</span> asked about remote equipment stipends this week. Consider publishing a refreshed HR FAQ.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-1.5 text-blue-600 text-[11px] font-bold mb-1.5">
                  <Target className="w-3 h-3" /> OKR Progress Update
                </div>
                <p className="text-[12px] text-slate-500 leading-relaxed">
                  Q4 goal "Ship v2 Mobile" is at <span className="text-slate-800 font-semibold">67% completion</span> with 3 weeks remaining. On track.
                </p>
              </div>
            </div>

            <Link href="/dashboard/decision" className="mt-4 pt-3 flex items-center justify-between text-[12px] font-semibold text-indigo-600 hover:text-indigo-500 transition-colors" style={{ borderTop: '1px solid rgba(91,106,240,0.12)' }}>
              <span>Open Decision Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Recent AI Chats */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-violet-50 flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5 text-violet-600" />
                </div>
                <span className="text-[13px] font-semibold text-slate-800">Recent Chats</span>
              </div>
              <Link href="/dashboard/chat" className="text-[11px] text-indigo-600 hover:text-indigo-500 font-semibold transition-colors">
                New â†’
              </Link>
            </div>

            <div className="space-y-2">
              {[
                { q: 'Remote travel reimbursement policy', a: '"Eligible for up to $2,500/year with 14-day pre-approval..."', time: '1h ago' },
                { q: 'OAuth2 Token Expiry Architecture', a: '"Recommended JWT access token lifetime is 15 minutes with rolling refresh..."', time: 'Yesterday' },
              ].map((chat, i) => (
                <Link key={i} href="/dashboard/chat" className="block p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-300 hover:bg-indigo-500/[0.03] transition-all">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-[12px] font-semibold text-slate-700 truncate">{chat.q}</p>
                    <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">{chat.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{chat.a}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Team Activity */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.055)' }}>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                </div>
                <span className="text-[13px] font-semibold text-slate-800">Team Activity</span>
              </div>
              <span className="w-2 h-2 rounded-full status-online animate-pulse-ring flex-shrink-0" />
            </div>

            <div className="space-y-3">
              {teamActivity.map((act, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 border border-white/[0.08] flex items-center justify-center text-[10px] font-bold text-slate-300 flex-shrink-0 mt-0.5">
                    {act.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] text-slate-500 leading-snug">
                      <span className="text-slate-700 font-semibold">{act.user}</span>
                      {' '}<span className="text-slate-400">({act.dept})</span>{' '}
                      {act.action}{' '}
                      <span className="text-indigo-600 font-medium">{act.target}</span>
                    </p>
                    <span className="text-[10px] text-slate-400">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
