'use client'

import { useState } from 'react'
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Plus,
  Filter,
  Check,
  MoreVertical,
  Calendar,
  AlertCircle,
  Loader2,
  LayoutGrid,
  List,
  Layers,
  ArrowRight
} from 'lucide-react'

interface TaskItem {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'todo' | 'in_progress' | 'review' | 'done'
  estimated_hours: number
  assignee: string
  aiGenerated: boolean
}

const initialTaskList: TaskItem[] = [
  {
    id: 't-1',
    title: 'Review vendor DPA data privacy terms',
    description: 'Ensure third-party AI provider complies with GDPR Article 28 and SOC2 Type II.',
    priority: 'critical',
    status: 'in_progress',
    estimated_hours: 2.0,
    assignee: 'Sarah L.',
    aiGenerated: true
  },
  {
    id: 't-2',
    title: 'Audit Phase 2 cloud migration architecture spec',
    description: 'Validate zero-downtime database replication schema between AWS Aurora and Spanner.',
    priority: 'high',
    status: 'todo',
    estimated_hours: 4.0,
    assignee: 'Alex K.',
    aiGenerated: false
  },
  {
    id: 't-3',
    title: 'Distribute Q4 remote workplace stipend guidelines',
    description: 'Publish verified HR policy memo to all distributed engineering teams.',
    priority: 'medium',
    status: 'done',
    estimated_hours: 1.0,
    assignee: 'Marcus V.',
    aiGenerated: true
  },
  {
    id: 't-4',
    title: 'Implement OAuth2 refresh token rotation',
    description: 'Enforce 15-minute access token lifespan with single-use refresh token exchange.',
    priority: 'high',
    status: 'review',
    estimated_hours: 6.0,
    assignee: 'Elena R.',
    aiGenerated: false
  },
  {
    id: 't-5',
    title: 'Prepare executive SWOT report for board review',
    description: 'Synthesize organizational advantages and competitive landscape for AI copilot.',
    priority: 'high',
    status: 'in_progress',
    estimated_hours: 3.5,
    assignee: 'David K.',
    aiGenerated: true
  }
]

export default function SmartTasksPage() {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTaskList)
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board')
  const [showAiModal, setShowAiModal] = useState(false)
  const [aiGoal, setAiGoal] = useState('')
  const [loadingAi, setLoadingAi] = useState(false)
  const [filterPriority, setFilterPriority] = useState<string>('all')

  const handleGenerateAiTasks = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!aiGoal.trim()) return

    setLoadingAi(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: aiGoal }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate tasks')

      const generated = (data.tasks || []).map((t: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        title: t.title,
        description: t.description,
        priority: t.priority || 'medium',
        status: 'todo' as const,
        estimated_hours: t.estimated_hours || 2,
        assignee: 'Unassigned',
        aiGenerated: true,
      }))

      setTasks([...generated, ...tasks])
      setAiGoal('')
      setShowAiModal(false)
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to generate tasks')
    } finally {
      setLoadingAi(false)
    }
  }

  const updateStatus = (id: string, newStatus: TaskItem['status']) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t))
  }

  const filteredTasks = tasks.filter(t => filterPriority === 'all' || t.priority === filterPriority)

  const columns: Array<{ id: TaskItem['status']; label: string; count: number }> = [
    { id: 'todo', label: 'To Do', count: filteredTasks.filter(t => t.status === 'todo').length },
    { id: 'in_progress', label: 'In Progress', count: filteredTasks.filter(t => t.status === 'in_progress').length },
    { id: 'review', label: 'Review', count: filteredTasks.filter(t => t.status === 'review').length },
    { id: 'done', label: 'Completed', count: filteredTasks.filter(t => t.status === 'done').length },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              Smart Task Center
            </span>
            <span className="text-xs text-muted-foreground">· AI Decomposition Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Smart Task Manager
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Track team execution, prioritize bottlenecks, or generate an entire project task breakdown using Gemini 3.5.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-secondary/60 rounded-xl p-1 border border-border">
            <button
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'board' ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list' ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowAiModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Auto-Breakdown</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-muted-foreground">Filter Priority:</span>
          {['all', 'critical', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 rounded-lg uppercase tracking-wider font-bold text-[10px] transition-all ${
                filterPriority === p
                  ? 'bg-secondary text-foreground border border-border'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <span className="text-muted-foreground font-mono">
          Total: {filteredTasks.length} tasks ({filteredTasks.reduce((acc, t) => acc + (t.status !== 'done' ? t.estimated_hours : 0), 0)}h remaining)
        </span>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {columns.map((col) => (
            <div key={col.id} className="glass rounded-2xl p-4 border border-border flex flex-col min-h-[500px]">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">{col.label}</span>
                <span className="text-xs bg-secondary px-2 py-0.5 rounded font-mono text-muted-foreground">
                  {col.count}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {filteredTasks
                  .filter((t) => t.status === col.id)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-card border border-border hover:border-indigo-500/40 transition-all space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                          task.priority === 'critical' ? 'bg-rose-500/20 text-rose-400' :
                          task.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {task.priority}
                        </span>
                        {task.aiGenerated && (
                          <span className="text-[10px] text-indigo-400 font-semibold flex items-center gap-0.5">
                            <Sparkles className="w-3 h-3" /> AI
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-foreground leading-snug">{task.title}</p>
                      {task.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2">{task.description}</p>
                      )}

                      <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="font-mono">{task.estimated_hours}h</span>
                        <span>{task.assignee}</span>

                        {/* Status Mover */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {col.id !== 'todo' && (
                            <button
                              onClick={() => updateStatus(task.id, 'todo')}
                              className="px-1.5 py-0.5 rounded bg-secondary hover:bg-secondary/80 text-[9px]"
                              title="Move to Todo"
                            >
                              Todo
                            </button>
                          )}
                          {col.id !== 'in_progress' && (
                            <button
                              onClick={() => updateStatus(task.id, 'in_progress')}
                              className="px-1.5 py-0.5 rounded bg-secondary hover:bg-secondary/80 text-[9px]"
                              title="Move to In Progress"
                            >
                              Prog
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button
                              onClick={() => updateStatus(task.id, 'done')}
                              className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[9px]"
                              title="Complete"
                            >
                              Done
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="glass rounded-2xl border border-border divide-y divide-border">
          {filteredTasks.map((task) => (
            <div key={task.id} className="p-4 flex items-center justify-between gap-4 text-xs hover:bg-secondary/20 transition-colors">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <button
                  onClick={() => updateStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                    task.status === 'done' ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-border'
                  }`}
                >
                  {task.status === 'done' && <Check className="w-3 h-3" />}
                </button>
                <div className="min-w-0">
                  <p className={`font-semibold ${task.status === 'done' ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                    {task.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground truncate">{task.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <span className="font-mono text-muted-foreground">{task.estimated_hours}h</span>
                <span className="text-muted-foreground">{task.assignee}</span>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                  task.priority === 'critical' ? 'bg-rose-500/20 text-rose-400' :
                  task.priority === 'high' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {task.priority}
                </span>
                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task.id, e.target.value as any)}
                  className="bg-secondary border border-border text-[11px] rounded-lg px-2 py-1 text-foreground"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI GENERATE MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass border border-border rounded-2xl max-w-lg w-full p-6 text-left animate-in zoom-in-95">
            <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              AI Project Task Breakdown
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Describe your project goal. Gemini 3.5 Flash will decompose it into 8-12 prioritized, estimated tasks.
            </p>

            <form onSubmit={handleGenerateAiTasks} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Project Goal / Epic Description
                </label>
                <textarea
                  value={aiGoal}
                  onChange={(e) => setAiGoal(e.target.value)}
                  rows={3}
                  placeholder="e.g. Launch an enterprise document intelligence portal with role-based access control and Slack notifications"
                  className="w-full bg-secondary/50 border border-border rounded-xl p-3 text-sm text-foreground focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-muted-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingAi}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2"
                >
                  {loadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Generate Backlog</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
