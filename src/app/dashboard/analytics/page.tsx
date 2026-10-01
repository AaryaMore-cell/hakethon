'use client'

import { useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  Clock,
  FileText,
  Search,
  Users,
  Shield,
  Zap,
  ArrowUpRight,
  Sparkles,
  Download
} from 'lucide-react'

export default function AnalyticsDashboardPage() {
  const [timeRange, setTimeRange] = useState('30d')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
              Enterprise Telemetry
            </span>
            <span className="text-xs text-muted-foreground">· Real-Time ROI & Knowledge Utilization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Analytics & Team Performance
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Monitor organizational productivity gains, knowledge query volumes, and department adoption metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-secondary/60 rounded-xl p-1 border border-border text-xs font-semibold">
            {['7d', '30d', '90d', 'All Time'].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === r ? 'bg-card text-foreground shadow' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button className="glass border border-border hover:border-indigo-500/40 text-foreground px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Hours Saved</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-3xl font-extrabold text-foreground block">1,840 hrs</span>
          <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +28% vs previous period
          </span>
        </div>

        <div className="glass rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Knowledge Queries</span>
            <Search className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="text-3xl font-extrabold text-foreground block">34,120</span>
          <span className="text-xs text-indigo-400 flex items-center gap-1 mt-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +15% query volume
          </span>
        </div>

        <div className="glass rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Document Coverage</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-3xl font-extrabold text-foreground block">99.2%</span>
          <span className="text-xs text-purple-400 flex items-center gap-1 mt-1 font-semibold">
            14,280 pages indexed
          </span>
        </div>

        <div className="glass rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground">Median Response Latency</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-3xl font-extrabold text-foreground block">1.18s</span>
          <span className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-semibold">
            Gemini 3.5 Flash Streaming
          </span>
        </div>
      </div>

      {/* DEPARTMENT ADOPTION & TOP QUERIED DOCS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Breakdown */}
        <div className="glass rounded-2xl p-6 border border-border">
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            Adoption by Department
          </h2>

          <div className="space-y-4 text-xs">
            {[
              { name: 'Engineering & Technology', queries: 14200, pct: 85, color: 'bg-indigo-500' },
              { name: 'People & HR Operations', queries: 8100, pct: 68, color: 'bg-purple-500' },
              { name: 'Product Management', queries: 6300, pct: 54, color: 'bg-blue-500' },
              { name: 'Legal & Compliance', queries: 3800, pct: 42, color: 'bg-emerald-500' },
              { name: 'Finance & Strategy', queries: 1720, pct: 30, color: 'bg-amber-500' },
            ].map((d, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between font-medium">
                  <span className="text-foreground">{d.name}</span>
                  <span className="text-muted-foreground font-mono">{d.queries.toLocaleString()} queries</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full ${d.color} rounded-full transition-all duration-500`} style={{ width: `${d.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Most Accessed Documents */}
        <div className="glass rounded-2xl p-6 border border-border">
          <h2 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-400" />
            Top 5 Most Consulted Knowledge Documents
          </h2>

          <div className="space-y-3 text-xs">
            {[
              { title: 'Employee-Leave-Travel-Policy-2026.pdf', dept: 'HR Ops', citations: 412 },
              { title: 'Engineering-RFC-ZeroTrust-Auth.md', dept: 'Engineering', citations: 320 },
              { title: 'SOC2-TypeII-Security-Audit.pdf', dept: 'Security', citations: 245 },
              { title: 'Master-Vendor-Services-Agreement.pdf', dept: 'Legal', citations: 180 },
              { title: 'Incident-Response-On-Call-Runbook.pdf', dept: 'DevOps', citations: 142 },
            ].map((doc, i) => (
              <div key={i} className="p-3 rounded-xl bg-card border border-border flex items-center justify-between">
                <div>
                  <span className="font-semibold text-foreground block">{doc.title}</span>
                  <span className="text-[11px] text-muted-foreground">{doc.dept}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="text-indigo-400 font-bold text-sm block">{doc.citations}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Citations</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
