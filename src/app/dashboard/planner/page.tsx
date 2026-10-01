'use client'

import { useState } from 'react'
import { Map, Loader2, Sparkles, CheckSquare, AlertTriangle, Target, Copy, Check, RefreshCw } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface RoadmapPhase {
  name: string
  duration: string
  milestones: string[]
  tasks: Array<{ title: string; description: string; priority: string; estimated_hours: number; assignee_suggestion: string }>
}

interface Roadmap {
  phases: RoadmapPhase[]
  risks: string[]
  success_metrics: string[]
}

const PRIORITY_COLOR: Record<string, string> = {
  high: 'bg-red-500/20 text-red-300 border-red-500/30',
  medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  low: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  critical: 'bg-red-600/30 text-red-200 border-red-600/40',
}

export default function PlannerPage() {
  const [form, setForm] = useState({ name: '', goal: '', timeline: '', teamSize: '4', constraints: '' })
  const [activeTab, setActiveTab] = useState<'planner' | 'meeting' | 'tasks'>('planner')
  const [loading, setLoading] = useState(false)
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  // Meeting summarizer
  const [meetingNotes, setMeetingNotes] = useState('')
  const [meetingSummary, setMeetingSummary] = useState('')
  const [meetingLoading, setMeetingLoading] = useState(false)
  // Task generator
  const [taskGoal, setTaskGoal] = useState('')
  const [tasks, setTasks] = useState<Array<{ title: string; description: string; priority: string; estimated_hours: number }>>([])
  const [tasksLoading, setTasksLoading] = useState(false)

  const generateRoadmap = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setRoadmap(null)
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate roadmap')
      setRoadmap(data.roadmap)
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const summarizeMeeting = async () => {
    if (!meetingNotes.trim()) return
    setMeetingLoading(true)
    setMeetingSummary('')
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: meetingNotes }),
      })
      const data = await res.json()
      setMeetingSummary(data.summary || data.error)
    } catch { setMeetingSummary('Failed to summarize. Please try again.') }
    finally { setMeetingLoading(false) }
  }

  const generateTasks = async () => {
    if (!taskGoal.trim()) return
    setTasksLoading(true)
    setTasks([])
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: taskGoal }),
      })
      const data = await res.json()
      setTasks(data.tasks || [])
    } catch { }
    finally { setTasksLoading(false) }
  }

  const copyRoadmap = () => {
    if (!roadmap) return
    const text = roadmap.phases.map(p =>
      `## ${p.name} (${p.duration})\n\n**Milestones:**\n${p.milestones.map(m => `- ${m}`).join('\n')}\n\n**Tasks:**\n${p.tasks.map(t => `- [${t.priority.toUpperCase()}] ${t.title} (${t.estimated_hours}h)`).join('\n')}`
    ).join('\n\n---\n\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tabs = [
    { id: 'planner', label: '🗺️ Roadmap Generator' },
    { id: 'meeting', label: '📝 Meeting Summarizer' },
    { id: 'tasks', label: '✅ Task Generator' },
  ]

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">AI Planning Suite</h1>
        <p className="text-muted-foreground mt-1">Generate roadmaps, summarize meetings, and create task lists with AI.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass border border-border rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 text-sm font-medium px-4 py-2.5 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Roadmap Generator */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          {!roadmap ? (
            <div className="glass border border-border rounded-2xl p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Map className="w-4 h-4 text-indigo-400" /> Project Details
              </h2>
              <form onSubmit={generateRoadmap} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Project name *</label>
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Mobile CRM App Relaunch" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Timeline *</label>
                    <input value={form.timeline} onChange={(e) => setForm({ ...form, timeline: e.target.value })} required placeholder="3 months" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Project goal *</label>
                  <textarea value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} required placeholder="Rebuild our mobile CRM app to increase sales team productivity by 30% and reduce onboarding time for new reps." rows={3} className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Team size</label>
                    <select value={form.teamSize} onChange={(e) => setForm({ ...form, teamSize: e.target.value })} className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500">
                      {[1,2,3,4,5,6,8,10,15,20].map(n => <option key={n} value={n}>{n} people</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Key constraints (optional)</label>
                    <input value={form.constraints} onChange={(e) => setForm({ ...form, constraints: e.target.value })} placeholder="Limited budget, no new hires" className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
                {error && <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>}
                <button type="submit" disabled={loading} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-all">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {loading ? 'Generating roadmap...' : 'Generate Roadmap'}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">📋 {form.name} Roadmap</h2>
                <div className="flex gap-2">
                  <button onClick={copyRoadmap} className="flex items-center gap-1.5 text-sm glass border border-border hover:border-indigo-500/40 px-3 py-2 rounded-lg transition-all text-muted-foreground hover:text-foreground">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button onClick={() => { setRoadmap(null); setError('') }} className="flex items-center gap-1.5 text-sm glass border border-border hover:border-indigo-500/40 px-3 py-2 rounded-lg transition-all text-muted-foreground hover:text-foreground">
                    <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                  </button>
                </div>
              </div>

              {/* Phases */}
              {roadmap.phases.map((phase, pi) => (
                <div key={pi} className="glass border border-border rounded-2xl overflow-hidden">
                  <div className="bg-indigo-600/20 border-b border-indigo-500/20 px-5 py-3 flex items-center justify-between">
                    <h3 className="font-semibold text-indigo-300">{phase.name}</h3>
                    <span className="text-xs text-muted-foreground">{phase.duration}</span>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Milestones</p>
                      <ul className="space-y-1">
                        {phase.milestones.map((m, mi) => (
                          <li key={mi} className="flex items-center gap-2 text-sm text-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />{m}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Tasks ({phase.tasks.length})</p>
                      <div className="space-y-2">
                        {phase.tasks.map((task, ti) => (
                          <div key={ti} className="flex items-start gap-3 bg-secondary/50 rounded-xl p-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 mt-0.5 ${PRIORITY_COLOR[task.priority] || PRIORITY_COLOR.medium}`}>
                              {task.priority}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{task.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <p className="text-xs text-muted-foreground">{task.estimated_hours}h</p>
                              <p className="text-xs text-muted-foreground">{task.assignee_suggestion}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Risks & Metrics */}
              <div className="grid md:grid-cols-2 gap-4">
                {roadmap.risks.length > 0 && (
                  <div className="glass border border-amber-500/20 rounded-2xl p-5">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-amber-300"><AlertTriangle className="w-4 h-4" /> Risks</h3>
                    <ul className="space-y-1">{roadmap.risks.map((r, i) => <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-amber-400">•</span>{r}</li>)}</ul>
                  </div>
                )}
                {roadmap.success_metrics.length > 0 && (
                  <div className="glass border border-emerald-500/20 rounded-2xl p-5">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-emerald-300"><Target className="w-4 h-4" /> Success Metrics</h3>
                    <ul className="space-y-1">{roadmap.success_metrics.map((m, i) => <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-emerald-400">✓</span>{m}</li>)}</ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Meeting Summarizer */}
      {activeTab === 'meeting' && (
        <div className="space-y-4">
          <div className="glass border border-border rounded-2xl p-6">
            <h2 className="font-semibold mb-4">📝 Paste your meeting notes</h2>
            <textarea
              value={meetingNotes}
              onChange={(e) => setMeetingNotes(e.target.value)}
              placeholder="Paste raw meeting notes, transcript, or bullet points here..."
              rows={10}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <button
              onClick={summarizeMeeting}
              disabled={meetingLoading || !meetingNotes.trim()}
              className="mt-4 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-all"
            >
              {meetingLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {meetingLoading ? 'Summarizing...' : 'Summarize Meeting'}
            </button>
          </div>
          {meetingSummary && (
            <div className="glass border border-border rounded-2xl p-6 animate-fade-in">
              <h3 className="font-semibold mb-4">Meeting Summary</h3>
              <div className="prose-dark text-sm">
                <ReactMarkdown>{meetingSummary}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Task Generator */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="glass border border-border rounded-2xl p-6">
            <h2 className="font-semibold mb-4">✅ Describe your project or goal</h2>
            <textarea
              value={taskGoal}
              onChange={(e) => setTaskGoal(e.target.value)}
              placeholder="e.g. Launch a new marketing campaign for our SaaS product targeting mid-market companies in Q4..."
              rows={4}
              className="w-full bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <button
              onClick={generateTasks}
              disabled={tasksLoading || !taskGoal.trim()}
              className="mt-4 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-all"
            >
              {tasksLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckSquare className="w-4 h-4" />}
              {tasksLoading ? 'Generating tasks...' : 'Generate Task List'}
            </button>
          </div>
          {tasks.length > 0 && (
            <div className="glass border border-border rounded-2xl p-6 animate-fade-in">
              <h3 className="font-semibold mb-4">Generated Tasks ({tasks.length})</h3>
              <div className="space-y-3">
                {tasks.map((task, i) => (
                  <div key={i} className="flex items-start gap-3 bg-secondary/50 rounded-xl p-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 mt-0.5 ${PRIORITY_COLOR[task.priority] || PRIORITY_COLOR.medium}`}>
                      {task.priority}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{task.estimated_hours}h</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
