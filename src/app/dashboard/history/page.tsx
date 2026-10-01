'use client'

import { MessageSquare, FileText, Map, CheckSquare, Zap, Clock, Filter } from 'lucide-react'
import { useState } from 'react'
import { formatRelativeTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

const MOCK_HISTORY = [
  { id: '1', type: 'chat', title: 'How do we reduce customer churn in Q4?', preview: 'Based on best practices, here are 5 strategies to reduce churn...', time: new Date(Date.now() - 2 * 60000) },
  { id: '2', type: 'document', title: 'Vendor Contract 2024.pdf', preview: 'Executive Summary: This agreement establishes a 12-month partnership...', time: new Date(Date.now() - 60 * 60000) },
  { id: '3', type: 'plan', title: 'Mobile App Relaunch Roadmap', preview: 'Phase 1: Discovery (2 weeks) — Requirements gathering, stakeholder interviews...', time: new Date(Date.now() - 3 * 60 * 60000) },
  { id: '4', type: 'task', title: 'Q4 Marketing Campaign Tasks', preview: '12 tasks generated — High: 4, Medium: 6, Low: 2. Estimated total: 86h', time: new Date(Date.now() - 5 * 60 * 60000) },
  { id: '5', type: 'meeting', title: 'Q3 All-Hands Meeting Summary', preview: 'Decisions: Budget approved. Action Items: Alex — send vendor contract by Friday...', time: new Date(Date.now() - 24 * 60 * 60000) },
  { id: '6', type: 'chat', title: 'Explain our remote work policy', preview: 'Based on the HR Policy 2024 document, remote employees receive 25 days annual leave...', time: new Date(Date.now() - 2 * 24 * 60 * 60000) },
]

const TYPE_CONFIG = {
  chat: { icon: MessageSquare, label: 'Chat', color: 'text-indigo-400', bg: 'bg-indigo-500/20 border-indigo-500/30' },
  document: { icon: FileText, label: 'Document', color: 'text-purple-400', bg: 'bg-purple-500/20 border-purple-500/30' },
  plan: { icon: Map, label: 'Roadmap', color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30' },
  task: { icon: CheckSquare, label: 'Tasks', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/30' },
  meeting: { icon: Zap, label: 'Meeting', color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/30' },
}

type FilterType = 'all' | 'chat' | 'document' | 'plan' | 'task' | 'meeting'

export default function HistoryPage() {
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = filter === 'all' ? MOCK_HISTORY : MOCK_HISTORY.filter((h) => h.type === filter)

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">History</h1>
        <p className="text-muted-foreground mt-1">All your AI interactions, analyses, and generated plans.</p>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {(['all', 'chat', 'document', 'plan', 'task', 'meeting'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'text-sm px-3 py-1.5 rounded-lg font-medium transition-all capitalize',
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'glass border border-border text-muted-foreground hover:text-foreground hover:border-indigo-500/40'
            )}
          >
            {f === 'all' ? 'All' : TYPE_CONFIG[f as keyof typeof TYPE_CONFIG]?.label || f}
          </button>
        ))}
      </div>

      {/* History items */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const config = TYPE_CONFIG[item.type as keyof typeof TYPE_CONFIG]
          if (!config) return null
          return (
            <div key={item.id} className="glass border border-border rounded-2xl p-5 hover:border-indigo-500/30 transition-all cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border', config.bg)}>
                  <config.icon className={cn('w-4 h-4', config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', config.bg, config.color)}>
                      {config.label}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(item.time)}
                    </div>
                  </div>
                  <h3 className="font-medium text-foreground group-hover:text-indigo-300 transition-colors">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.preview}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Clock className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No history found for this filter.</p>
        </div>
      )}
    </div>
  )
}
