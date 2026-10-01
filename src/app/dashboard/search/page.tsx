'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  FileText,
  Filter,
  Sparkles,
  BookOpen,
  ArrowRight,
  Shield,
  Bookmark,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  Building2
} from 'lucide-react'

interface SearchResult {
  id: string
  title: string
  docType: 'PDF' | 'SOP' | 'Policy' | 'Report' | 'Manual'
  department: string
  updatedAt: string
  relevance: number
  snippet: string
  sourcePage: string
}

const allDocuments: SearchResult[] = [
  {
    id: '1',
    title: 'Employee-Leave-Travel-Policy-2026.pdf',
    docType: 'Policy',
    department: 'People & HR',
    updatedAt: 'Updated 2 weeks ago',
    relevance: 99.4,
    snippet: 'Remote employees are eligible for an annual remote workspace travel and co-working allowance of up to $2,500 USD per calendar year. Trips require manager pre-approval via the portal 14 days prior to departure.',
    sourcePage: 'Page 14, §7.3 Travel & Expense'
  },
  {
    id: '2',
    title: 'Engineering-RFC-ZeroTrust-Auth.md',
    docType: 'SOP',
    department: 'Engineering',
    updatedAt: 'Updated 3 days ago',
    relevance: 96.1,
    snippet: 'All external API endpoints must enforce JWT token validation with RS256 signing keys. Key rotation occurs automatically every 90 days. Deprecated v1 endpoints must be decommissioned by Q4.',
    sourcePage: 'Section 4.1 Token Specs'
  },
  {
    id: '3',
    title: 'SOC2-TypeII-Security-Audit-Report.pdf',
    docType: 'Report',
    department: 'Security & Legal',
    updatedAt: 'Updated 1 month ago',
    relevance: 92.8,
    snippet: 'Annual third-party audit confirmed zero non-conformities across Trust Services Criteria for Security and Availability. All customer databases are encrypted with AES-256 at rest.',
    sourcePage: 'Page 42, Control Ref CC6.1'
  },
  {
    id: '4',
    title: 'Incident-Response-On-Call-Runbook.pdf',
    docType: 'Manual',
    department: 'DevOps & SRE',
    updatedAt: 'Updated 5 days ago',
    relevance: 89.5,
    snippet: 'Sev-1 incidents require an incident commander to be designated within 5 minutes. PagerDuty auto-escalates to Director of Infrastructure if unacknowledged after 10 minutes.',
    sourcePage: 'Page 3, Emergency Protocols'
  },
  {
    id: '5',
    title: 'Master-Vendor-Services-Agreement.pdf',
    docType: 'PDF',
    department: 'Legal',
    updatedAt: 'Updated 1 week ago',
    relevance: 86.2,
    snippet: 'Standard payment terms are Net 45 days. Vendor indemnifies customer against intellectual property infringement claims with an aggregate liability cap of 2x total contract value.',
    sourcePage: 'Page 8, Clause 12.4'
  }
]

const docTypes = ['All Types', 'PDFs', 'SOPs', 'Policies', 'Reports', 'Manuals']
const departments = ['All Departments', 'Engineering', 'People & HR', 'Security & Legal', 'DevOps & SRE']

export default function EnterpriseKnowledgeSearchPage() {
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All Types')
  const [selectedDept, setSelectedDept] = useState('All Departments')
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  // Filtered results
  const filteredResults = allDocuments.filter(doc => {
    const matchesQuery = query === '' ||
      doc.title.toLowerCase().includes(query.toLowerCase()) ||
      doc.snippet.toLowerCase().includes(query.toLowerCase()) ||
      doc.department.toLowerCase().includes(query.toLowerCase())

    const matchesType = selectedType === 'All Types' ||
      (selectedType === 'PDFs' && doc.docType === 'PDF') ||
      (selectedType === 'SOPs' && doc.docType === 'SOP') ||
      (selectedType === 'Policies' && doc.docType === 'Policy') ||
      (selectedType === 'Reports' && doc.docType === 'Report') ||
      (selectedType === 'Manuals' && doc.docType === 'Manual')

    const matchesDept = selectedDept === 'All Departments' || doc.department.includes(selectedDept)

    return matchesQuery && matchesType && matchesDept
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-2xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
            Knowledge Lake
          </span>
          <span className="text-xs text-muted-foreground">· Semantic Vector Retrieval</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Enterprise Knowledge Search
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Search across 14,000+ indexed company PDFs, SOPs, HR policies, compliance reports, and architecture manuals.
        </p>
      </div>

      {/* Main Search Input & Filters */}
      <div className="glass rounded-2xl p-5 border border-border space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-indigo-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search keywords, natural questions, or policy clauses (e.g. 'travel allowance', 'zero trust', 'Sev-1 on-call')..."
            className="w-full bg-secondary/40 border border-border rounded-xl pl-12 pr-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          {/* Doc Type Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground mr-1">Type:</span>
            {docTypes.map((type, i) => (
              <button
                key={i}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedType === type
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-secondary/60 text-muted-foreground hover:text-foreground'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Dept:</span>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-secondary/60 border border-border text-xs rounded-lg px-2.5 py-1 text-foreground focus:outline-none"
            >
              {departments.map((d, i) => (
                <option key={i} value={d} className="bg-card">{d}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* AI Executive Synthesis Banner (if query exists) */}
      {query.length > 2 && filteredResults.length > 0 && (
        <div className="glass rounded-2xl p-5 border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-card to-purple-500/10 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-2">
            <Sparkles className="w-4 h-4" />
            <span>AI Knowledge Lake Synthesis for "{query}"</span>
          </div>
          <p className="text-xs text-foreground/90 leading-relaxed">
            Found {filteredResults.length} verified references. The highest confidence match is located in{' '}
            <strong className="text-indigo-300">{filteredResults[0].title}</strong> ({filteredResults[0].sourcePage}).
          </p>
          <div className="mt-3">
            <Link
              href={`/dashboard/chat?q=${encodeURIComponent(`Explain this from our company knowledge: ${query}`)}`}
              className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              Deep-dive conversation with Copilot on this topic <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Search Results List */}
      <div className="space-y-4">
        {filteredResults.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center border border-border">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-bold text-foreground text-sm">No matching documents found</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search terms or resetting the department filter.
            </p>
          </div>
        ) : (
          filteredResults.map((doc) => {
            const isBookmarked = bookmarkedIds.includes(doc.id)
            return (
              <div
                key={doc.id}
                className="glass rounded-2xl p-5 border border-border hover:border-indigo-500/40 transition-all space-y-3"
              >
                {/* Result Top Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm hover:text-indigo-400 cursor-pointer transition-colors">
                        {doc.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                        <span className="text-indigo-300 font-semibold">{doc.department}</span>
                        <span>·</span>
                        <span>{doc.updatedAt}</span>
                        <span>·</span>
                        <span className="font-mono text-emerald-400 font-bold">{doc.relevance}% Match</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                      {doc.docType}
                    </span>
                    <button
                      onClick={() => toggleBookmark(doc.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-border text-muted-foreground hover:text-foreground'
                      }`}
                      title="Bookmark Document"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Highlighted Snippet */}
                <div className="p-3.5 rounded-xl bg-card border border-border/70 text-xs text-foreground/90 leading-relaxed font-sans">
                  <p>"{doc.snippet}"</p>
                  <span className="text-[10px] text-muted-foreground font-mono block mt-2">
                    Source: {doc.sourcePage}
                  </span>
                </div>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <Link
                    href={`/dashboard/chat?q=${encodeURIComponent(`Tell me more about ${doc.title} and summarize the key clauses.`)}`}
                    className="text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Ask Copilot about this document
                  </Link>
                  <Link
                    href="/dashboard/documents"
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium"
                  >
                    <span>View Document Analysis</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
