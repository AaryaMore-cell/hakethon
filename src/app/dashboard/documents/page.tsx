'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, Loader2, CheckCircle, AlertCircle, Eye, X, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/utils'

interface DocResult {
  summary: string
  keyPoints: string[]
  actionItems: string[]
  risks: string[]
  fileName: string
}

export default function DocumentsPage() {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DocResult | null>(null)
  const [error, setError] = useState('')
  const [question, setQuestion] = useState('')
  const [qaLoading, setQaLoading] = useState(false)
  const [qaAnswer, setQaAnswer] = useState('')

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }, [])

  const handleAnalyze = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Analysis failed')
      setResult(data)
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleQA = async () => {
    if (!question.trim() || !result) return
    setQaLoading(true)
    setQaAnswer('')
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          history: [],
          context: `Document: ${result.fileName}\n\nSummary: ${result.summary}\n\nKey Points:\n${result.keyPoints.join('\n')}`,
        }),
      })
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let text = ''
      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          for (const line of chunk.split('\n')) {
            if (line.startsWith('data: ') && line.slice(6) !== '[DONE]') {
              try { text += JSON.parse(line.slice(6)).text } catch {}
            }
          }
          setQaAnswer(text)
        }
      }
    } catch { setQaAnswer('Failed to answer. Please try again.') }
    finally { setQaLoading(false) }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Document Analysis</h1>
        <p className="text-muted-foreground mt-1">Upload any document — AI extracts summaries, key points, risks, and action items.</p>
      </div>

      {/* Upload Zone */}
      {!result && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer',
            dragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-border hover:border-indigo-500/50 hover:bg-secondary/50'
          )}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <input
            id="file-input"
            type="file"
            className="hidden"
            accept=".pdf,.txt,.md,.docx,.doc"
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
          />
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Drop your document here</h3>
          <p className="text-sm text-muted-foreground mb-4">Supports PDF, DOCX, TXT, MD — up to 10MB</p>
          {file && (
            <div className="inline-flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 rounded-lg px-4 py-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-indigo-300 font-medium">{file.name}</span>
              <button onClick={(e) => { e.stopPropagation(); setFile(null) }} className="text-muted-foreground hover:text-foreground ml-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {file && !result && (
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {loading ? 'Analyzing document...' : 'Analyze with AI'}
        </button>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="font-semibold">Analysis complete: <span className="text-indigo-300">{result.fileName}</span></span>
            </div>
            <button
              onClick={() => { setResult(null); setFile(null); setQaAnswer('') }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Upload className="w-3.5 h-3.5" /> Analyze another
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Summary */}
            <div className="glass border border-border rounded-2xl p-5 md:col-span-2">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><Eye className="w-4 h-4 text-indigo-400" /> Executive Summary</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>
            </div>

            {/* Key Points */}
            <div className="glass border border-border rounded-2xl p-5">
              <h3 className="font-semibold mb-3 text-sm">📌 Key Points</h3>
              <ul className="space-y-2">
                {result.keyPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-indigo-400 font-mono mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Items */}
            <div className="glass border border-border rounded-2xl p-5">
              <h3 className="font-semibold mb-3 text-sm">✅ Action Items</h3>
              {result.actionItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No specific action items identified.</p>
              ) : (
                <ul className="space-y-2">
                  {result.actionItems.map((a, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-4 h-4 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald-400 text-xs">→</span>
                      </span>
                      {a}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Risks */}
            {result.risks.length > 0 && (
              <div className="glass border border-amber-500/20 rounded-2xl p-5 md:col-span-2">
                <h3 className="font-semibold mb-3 text-sm text-amber-300">⚠️ Risks & Red Flags</h3>
                <ul className="space-y-2">
                  {result.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-amber-200/70">
                      <span className="text-amber-400 mt-0.5">•</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Q&A Section */}
          <div className="glass border border-indigo-500/20 rounded-2xl p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> Ask about this document
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQA()}
                placeholder="What are the payment terms? What risks should we watch for?"
                className="flex-1 bg-secondary border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleQA}
                disabled={qaLoading || !question.trim()}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all"
              >
                {qaLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Ask'}
              </button>
            </div>
            {qaAnswer && (
              <div className="mt-4 p-4 bg-secondary/50 rounded-xl">
                <div className="prose-dark text-sm">
                  <ReactMarkdown>{qaAnswer}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
