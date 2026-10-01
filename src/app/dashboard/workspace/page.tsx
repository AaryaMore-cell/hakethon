'use client'

import { useState } from 'react'
import {
  Users,
  MessageSquare,
  FileText,
  Share2,
  Sparkles,
  Plus,
  Send,
  MoreVertical,
  CheckCircle2,
  Lock,
  Globe,
  Clock,
  Pin
} from 'lucide-react'

interface SharedNote {
  id: string
  title: string
  content: string
  author: string
  department: string
  updatedAt: string
  isPinned: boolean
}

const initialNotes: SharedNote[] = [
  {
    id: 'n-1',
    title: 'Q4 Enterprise Cloud Infrastructure Architecture Plan',
    content: 'All API routes to be migrated to edge-compatible runtimes. Database replication across us-east and eu-west regions verified for 99.99% availability.',
    author: 'Elena Rostova (VP Eng)',
    department: 'Engineering',
    updatedAt: '10m ago',
    isPinned: true
  },
  {
    id: 'n-2',
    title: 'Customer Onboarding SOP Refinements',
    content: 'Updated SLA for Tier-1 support replies down to 15 minutes. Added automated Copilot ticket triage to reduce manual escalations.',
    author: 'David Kim (Product)',
    department: 'Product',
    updatedAt: '1h ago',
    isPinned: false
  },
  {
    id: 'n-3',
    title: 'SOC2 Type II Vendor Audit Compliance Notes',
    content: 'Audit review scheduled for October 15. Ensure all developer bastions enforce FIDO2 WebAuthn keys and session recording.',
    author: 'Sarah Lin (Legal)',
    department: 'Compliance',
    updatedAt: 'Yesterday',
    isPinned: false
  }
]

export default function TeamWorkspacePage() {
  const [notes, setNotes] = useState<SharedNote[]>(initialNotes)
  const [selectedNote, setSelectedNote] = useState<SharedNote>(initialNotes[0])
  const [commentInput, setCommentInput] = useState('')
  const [comments, setComments] = useState<Array<{ id: number; author: string; text: string; time: string }>>([
    { id: 1, author: 'Alex Morgan', text: 'Looks solid! Checked with the SRE team and the multi-region setup is good to go.', time: '25m ago' },
    { id: 2, author: 'Marcus Vance', text: 'Make sure we review the cross-border data transfer clause before pushing live.', time: '5m ago' },
  ])

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentInput.trim()) return
    setComments([
      ...comments,
      {
        id: Date.now(),
        author: 'Alex (You)',
        text: commentInput.trim(),
        time: 'Just now'
      }
    ])
    setCommentInput('')
  }

  const handleAiPolish = () => {
    setSelectedNote({
      ...selectedNote,
      content: selectedNote.content + '\n\n[AI Executive Synthesis]: Aligns with Q4 enterprise velocity milestones. Recommended next step: Schedule architecture review pre-flight.'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full">
              Team Workspace
            </span>
            <span className="text-xs text-muted-foreground">· Collaborative Real-Time Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Team Collaboration Center
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Collaboratively author company notes, share AI conversations, review cross-functional drafts, and align teams.
          </p>
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20">
          <Plus className="w-4 h-4" />
          <span>New Shared Note</span>
        </button>
      </div>

      {/* Main Workspace Split: Notes List on Left, Active Document & Comments on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Notes Catalog */}
        <div className="glass rounded-2xl p-4 border border-border space-y-3">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-border/60">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Shared Documents</span>
            <span className="text-xs text-muted-foreground font-mono">{notes.length} Active</span>
          </div>

          <div className="space-y-2">
            {notes.map((note) => {
              const isSelected = selectedNote.id === note.id
              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNote(note)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-secondary/70 border-indigo-500/50 shadow-sm'
                      : 'bg-card/60 border-border hover:border-indigo-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-semibold text-foreground text-xs leading-snug">{note.title}</span>
                    {note.isPinned && <Pin className="w-3 h-3 text-indigo-400 flex-shrink-0" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2 leading-relaxed">
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                    <span className="text-indigo-300 font-medium">{note.department}</span>
                    <span>{note.updatedAt}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Active Document Canvas + AI Co-Writer + Comments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Note Canvas */}
          <div className="glass rounded-2xl p-6 border border-border space-y-4">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
              <div>
                <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider block mb-1">
                  {selectedNote.department} · Created by {selectedNote.author}
                </span>
                <h2 className="text-xl font-bold text-foreground">{selectedNote.title}</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAiPolish}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Enhance note with AI synthesis"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Co-Writer</span>
                </button>
                <button className="p-1.5 rounded-xl border border-border text-muted-foreground hover:text-foreground">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Note Editable Content */}
            <textarea
              value={selectedNote.content}
              onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
              rows={8}
              className="w-full bg-transparent text-sm text-foreground/90 leading-relaxed focus:outline-none resize-none font-sans"
            />
          </div>

          {/* Collaborative Comments Feed */}
          <div className="glass rounded-2xl p-6 border border-border space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              Team Discussion & Sign-Offs ({comments.length})
            </h3>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {comments.map((c) => (
                <div key={c.id} className="p-3 rounded-xl bg-card border border-border text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">{c.author}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{c.time}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2 pt-2 border-t border-border/60">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Leave feedback or tag team member (@Elena, @Marcus)..."
                className="flex-1 bg-secondary/40 border border-border rounded-xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
