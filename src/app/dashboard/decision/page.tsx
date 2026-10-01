'use client'

import { useState } from 'react'
import {
  Compass,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileCheck2,
  Loader2,
  Download,
  Share2
} from 'lucide-react'

interface DecisionResult {
  topic: string
  strategicScore: number
  executiveSummary: string
  swot: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  riskAnalysis: Array<{
    risk: string
    severity: string
    mitigation: string
  }>
  recommendations: Array<{
    phase: string
    action: string
    impact: string
  }>
}

const exampleTopics = [
  "Migrate core database to distributed Spanner with zero downtime",
  "Implement company-wide autonomous customer support AI agent",
  "Transition engineering team from 2-week sprints to Shape Up methodology",
  "Adopt hybrid multi-cloud disaster recovery architecture (AWS + GCP)"
]

export default function DecisionSupportPage() {
  const [topic, setTopic] = useState('')
  const [context, setContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DecisionResult | null>(null)
  const [error, setError] = useState('')

  const handleGenerate = async (selectedTopic?: string) => {
    const queryTopic = selectedTopic || topic
    if (!queryTopic.trim()) {
      setError('Please provide a decision topic or select one of the suggested initiatives below.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: queryTopic, context }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate decision analysis')

      setResult(data)
    } catch (err: unknown) {
      setError((err as Error).message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-bold tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
            Executive Decision Engine
          </span>
          <span className="text-xs text-muted-foreground">· Powered by Gemini 3.5</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Decision Support Center
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
          Evaluate high-stakes organizational proposals, acquisitions, architecture shifts, and policy changes.
          Generate instant SWOT matrices, risk trade-offs, and phased execution plans.
        </p>
      </div>

      {/* Input Formulation Card */}
      <div className="glass rounded-2xl p-6 border border-border">
        <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
          <Compass className="w-4 h-4 text-purple-400" />
          Define Proposal or Strategic Decision
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
              Strategic Topic or Initiative
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., 'Migrate on-premise Kubernetes clusters to AWS EKS with SOC2 compliance'"
              className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">
              Organizational Constraints / Context (Optional)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              rows={2}
              placeholder="e.g., 6-month budget limit of $250k, 4 DevOps engineers available, zero-downtime SLA mandatory."
              className="w-full bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Quick suggestions */}
          <div>
            <span className="text-xs text-muted-foreground block mb-2 font-medium">Or try an executive scenario:</span>
            <div className="flex flex-wrap gap-2">
              {exampleTopics.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTopic(item)
                    handleGenerate(item)
                  }}
                  className="text-xs px-3 py-1.5 rounded-lg bg-secondary/60 hover:bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all text-left"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Strategic Assessment...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Executive Decision Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Generated Strategic Report */}
      {result && (
        <div className="space-y-6 animate-in fade-in">
          {/* Executive Overview Banner */}
          <div className="glass rounded-2xl p-6 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest block mb-1">
                Strategic Evaluation Result
              </span>
              <h2 className="text-xl font-bold text-foreground">{result.topic}</h2>
              <p className="text-xs text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                {result.executiveSummary}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center px-4 py-2 rounded-xl bg-secondary/60 border border-border">
                <span className="text-2xl font-extrabold text-emerald-400">{result.strategicScore}</span>
                <span className="text-[10px] text-muted-foreground block font-bold uppercase">Feasibility Score</span>
              </div>
            </div>
          </div>

          {/* SWOT MATRIX GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="glass rounded-2xl p-5 border border-emerald-500/30 bg-emerald-500/5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>Strengths (Internal Advantages)</span>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {result.swot.strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="glass rounded-2xl p-5 border border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm mb-3">
                <AlertTriangle className="w-4 h-4" />
                <span>Weaknesses (Internal Gaps)</span>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {result.swot.weaknesses.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="glass rounded-2xl p-5 border border-blue-500/30 bg-blue-500/5">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm mb-3">
                <Lightbulb className="w-4 h-4" />
                <span>Opportunities (Market & Growth)</span>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {result.swot.opportunities.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="glass rounded-2xl p-5 border border-rose-500/30 bg-rose-500/5">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-3">
                <ShieldAlert className="w-4 h-4" />
                <span>Threats (External Risks)</span>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {result.swot.threats.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RISK ANALYSIS & MITIGATIONS TABLE */}
          <div className="glass rounded-2xl p-6 border border-border">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Identified Strategic Risks & Actionable Mitigations
            </h3>

            <div className="space-y-3">
              {result.riskAnalysis.map((risk, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-card border border-border text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        risk.severity === 'critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        risk.severity === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {risk.severity}
                      </span>
                      <span className="font-semibold text-foreground">{risk.risk}</span>
                    </div>
                    <p className="text-muted-foreground text-[11px] mt-1">
                      <strong className="text-indigo-400">Mitigation:</strong> {risk.mitigation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PHASED RECOMMENDATIONS */}
          <div className="glass rounded-2xl p-6 border border-border">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Recommended Execution Path
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {result.recommendations.map((rec, i) => (
                <div key={i} className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-indigo-300 font-mono text-[11px]">{rec.phase}</span>
                    <span className="text-[10px] bg-secondary px-2 py-0.5 rounded font-semibold text-muted-foreground">
                      Impact: {rec.impact}
                    </span>
                  </div>
                  <p className="text-foreground/90 font-medium leading-relaxed">{rec.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
