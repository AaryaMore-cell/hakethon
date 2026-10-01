'use client'

import { useState } from 'react'
import {
  Zap,
  Play,
  CheckCircle2,
  Clock,
  Plus,
  ArrowRight,
  Sparkles,
  Layers,
  Send,
  Bell,
  FileText,
  Users,
  Settings2,
  Check,
  Pause,
  RotateCcw
} from 'lucide-react'

interface WorkflowItem {
  id: string
  name: string
  trigger: string
  action: string
  dept: string
  status: 'active' | 'paused'
  runs: number
  lastRun: string
}

const initialWorkflows: WorkflowItem[] = [
  {
    id: 'wf-1',
    name: 'Auto-Summarize & Risk Extraction for Contracts',
    trigger: 'When a new document (Contract/SOP) is uploaded',
    action: 'Generate 3-sentence summary, extract liabilities, and alert #legal-ops',
    dept: 'Legal & Compliance',
    status: 'active',
    runs: 48,
    lastRun: '14 mins ago'
  },
  {
    id: 'wf-2',
    name: 'Meeting Transcript to Jira Task Pipeline',
    trigger: 'When raw meeting notes are saved in Planner',
    action: 'Extract decisions, auto-generate prioritized tasks with estimated hours',
    dept: 'Product & Eng',
    status: 'active',
    runs: 112,
    lastRun: '1 hour ago'
  },
  {
    id: 'wf-3',
    name: 'New Hire Personalized Onboarding Concierge',
    trigger: 'When a new employee profile is provisioned',
    action: 'Generate tailored 7-day reading list from company handbook & assign mentor',
    dept: 'People & HR',
    status: 'active',
    runs: 23,
    lastRun: 'Yesterday'
  },
  {
    id: 'wf-4',
    name: 'Weekly Security Compliance Triage',
    trigger: 'Every Friday at 5:00 PM UTC',
    action: 'Scan open architecture RFCs for SOC2 compliance gaps & notify CTO',
    dept: 'Security',
    status: 'paused',
    runs: 12,
    lastRun: '5 days ago'
  },
]

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>(initialWorkflows)
  const [simulatingId, setSimulatingId] = useState<string | null>(null)
  const [simulationLog, setSimulationLog] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newTrigger, setNewTrigger] = useState('When a document is uploaded')
  const [newAction, setNewAction] = useState('Extract action items and notify team')

  const toggleStatus = (id: string) => {
    setWorkflows(workflows.map(wf =>
      wf.id === id ? { ...wf, status: wf.status === 'active' ? 'paused' : 'active' } : wf
    ))
  }

  const runSimulation = (wf: WorkflowItem) => {
    setSimulatingId(wf.id)
    setSimulationLog([`[${new Date().toLocaleTimeString()}] Trigger event fired: "${wf.trigger}"`])

    setTimeout(() => {
      setSimulationLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Ingested payload into Gemini 3.5 Agent...`])
    }, 400)

    setTimeout(() => {
      setSimulationLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] AI execution: "${wf.action}" completed successfully.`])
    }, 900)

    setTimeout(() => {
      setSimulationLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] Event dispatched to internal webhooks and team notifications.`])
      setSimulatingId(null)
      setWorkflows(prev => prev.map(w => w.id === wf.id ? { ...w, runs: w.runs + 1, lastRun: 'Just now' } : w))
    }, 1400)
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const newWf: WorkflowItem = {
      id: `wf-${Date.now()}`,
      name: newTitle.trim(),
      trigger: newTrigger,
      action: newAction,
      dept: 'Cross-Functional',
      status: 'active',
      runs: 0,
      lastRun: 'Never'
    }

    setWorkflows([newWf, ...workflows])
    setNewTitle('')
    setShowCreateModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
              Autonomous Workflows
            </span>
            <span className="text-xs text-muted-foreground">· Event-Driven Multi-Agent Automation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Workflow Automation Assistant
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Configure automated pipelines that react when documents are uploaded, meetings end, or policies update.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Workflow</span>
        </button>
      </div>

      {/* Live Simulation Monitor if running */}
      {simulationLog.length > 0 && (
        <div className="glass rounded-2xl p-5 border border-indigo-500/30 bg-card/90">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 font-mono">
              <Zap className="w-3.5 h-3.5" /> Live Agent Execution Log
            </span>
            <button
              onClick={() => setSimulationLog([])}
              className="text-[11px] text-muted-foreground hover:text-foreground"
            >
              Clear Log
            </button>
          </div>
          <div className="font-mono text-xs text-muted-foreground space-y-1 bg-secondary/30 p-3 rounded-lg border border-border">
            {simulationLog.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">›</span>
                <span className="text-foreground/90">{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workflows List */}
      <div className="space-y-4">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className="glass rounded-2xl p-6 border border-border hover:border-indigo-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  wf.status === 'active' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-secondary text-muted-foreground'
                }`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-sm">{wf.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span>{wf.dept}</span>
                    <span>·</span>
                    <span className="font-mono">{wf.runs} total runs</span>
                    <span>·</span>
                    <span>Last run: {wf.lastRun}</span>
                  </div>
                </div>
              </div>

              {/* Trigger & Action Pipeline Visual */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3 rounded-xl bg-secondary/40 border border-border">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                    Trigger Event
                  </span>
                  <p className="text-foreground/90 font-medium">{wf.trigger}</p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20">
                  <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">
                    Automated Agent Action
                  </span>
                  <p className="text-indigo-200 font-medium">{wf.action}</p>
                </div>
              </div>
            </div>

            {/* Actions & Toggles */}
            <div className="flex items-center gap-3 self-end md:self-center">
              <button
                onClick={() => runSimulation(wf)}
                disabled={simulatingId === wf.id}
                className="px-3 py-2 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs font-semibold text-foreground flex items-center gap-1.5 transition-all"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Test Run</span>
              </button>

              <button
                onClick={() => toggleStatus(wf.id)}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  wf.status === 'active'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-secondary text-muted-foreground border-border'
                }`}
              >
                {wf.status === 'active' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Paused</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE WORKFLOW MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass border border-border rounded-2xl max-w-lg w-full p-6 text-left animate-in zoom-in-95">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-400" />
              Configure Autonomous Workflow
            </h2>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Workflow Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. When PRD uploaded, generate sprint tasks"
                  className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Trigger Event</label>
                <select
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none"
                >
                  <option value="When a document is uploaded">When a document is uploaded</option>
                  <option value="When meeting notes are saved">When meeting notes are saved</option>
                  <option value="When project roadmap is finalized">When project roadmap is finalized</option>
                  <option value="On weekly schedule (Every Monday 9 AM)">On weekly schedule (Every Monday 9 AM)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">Automated Action</label>
                <select
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-xs text-foreground focus:outline-none"
                >
                  <option value="Extract action items and notify team">Extract action items and notify team</option>
                  <option value="Generate executive SWOT & email leadership">Generate executive SWOT & email leadership</option>
                  <option value="Generate Jira sprint backlog">Generate Jira sprint backlog</option>
                  <option value="Audit for SOC2 security compliance gaps">Audit for SOC2 security compliance gaps</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-muted-foreground hover:bg-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                >
                  Save & Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
