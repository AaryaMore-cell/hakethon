import { NextRequest, NextResponse } from 'next/server'
import { geminiFlash, safeGeminiCall } from '@/lib/gemini'

interface IndexedDocument {
  id: string
  title: string
  docType: 'PDF' | 'SOP' | 'Policy' | 'Report' | 'Manual'
  department: string
  updatedAt: string
  relevance: number
  snippet: string
  sourcePage: string
  fullContent?: string
}

const enterpriseKnowledgeBase: IndexedDocument[] = [
  {
    id: 'doc-1',
    title: 'Employee-Leave-Travel-Policy-2026.pdf',
    docType: 'Policy',
    department: 'People & HR',
    updatedAt: 'Updated 2 weeks ago',
    relevance: 99.4,
    snippet: 'Remote employees are eligible for an annual remote workspace travel and co-working allowance of up to $2,500 USD per calendar year. Trips require manager pre-approval via the portal 14 days prior to departure.',
    sourcePage: 'Page 14, §7.3 Travel & Expense',
    fullContent: 'Annual stipend for full-time remote staff covers ergonomic equipment, shared office spaces, and co-working subscriptions. Maximum reimbursement limit is $2,500 annually with 14-day manager approval window.'
  },
  {
    id: 'doc-2',
    title: 'Engineering-RFC-ZeroTrust-Auth.md',
    docType: 'SOP',
    department: 'Engineering',
    updatedAt: 'Updated 3 days ago',
    relevance: 96.1,
    snippet: 'All external API endpoints must enforce JWT token validation with RS256 signing keys. Key rotation occurs automatically every 90 days. Deprecated v1 endpoints must be decommissioned by Q4.',
    sourcePage: 'Section 4.1 Token Specs',
    fullContent: 'Engineering Zero-Trust standard: Strict mutual TLS (mTLS) for microservice communication, RS256 JWT tokens with 15-minute expiration, and automated AWS KMS key rotation every 90 days.'
  },
  {
    id: 'doc-3',
    title: 'SOC2-TypeII-Security-Audit-Report.pdf',
    docType: 'Report',
    department: 'Security & Legal',
    updatedAt: 'Updated 1 month ago',
    relevance: 92.8,
    snippet: 'Annual third-party audit confirmed zero non-conformities across Trust Services Criteria for Security and Availability. All customer databases are encrypted with AES-256 at rest.',
    sourcePage: 'Page 42, Control Ref CC6.1',
    fullContent: 'Independent SOC2 Type II audit conducted by EY. Examined 43 control objectives across security, availability, and confidential data storage. Zero exceptions noted.'
  },
  {
    id: 'doc-4',
    title: 'Incident-Response-On-Call-Runbook.pdf',
    docType: 'Manual',
    department: 'DevOps & SRE',
    updatedAt: 'Updated 5 days ago',
    relevance: 89.5,
    snippet: 'Sev-1 incidents require an incident commander to be designated within 5 minutes. PagerDuty auto-escalates to Director of Infrastructure if unacknowledged after 10 minutes.',
    sourcePage: 'Page 3, Emergency Protocols',
    fullContent: 'On-call emergency triage procedure: 5-minute initial response SLA, war room creation in Slack #incident-triage, status page update within 15 minutes.'
  },
  {
    id: 'doc-5',
    title: 'Master-Vendor-Services-Agreement.pdf',
    docType: 'PDF',
    department: 'Legal',
    updatedAt: 'Updated 1 week ago',
    relevance: 86.2,
    snippet: 'Standard payment terms are Net 45 days. Vendor indemnifies customer against intellectual property infringement claims with an aggregate liability cap of 2x total contract value.',
    sourcePage: 'Page 8, Clause 12.4',
    fullContent: 'Commercial terms: Net 45 invoices, mutual confidentiality for 5 years, dispute arbitration under Delaware law, and liability cap of 2x fees paid.'
  }
]

export async function POST(request: NextRequest) {
  try {
    const { query = '', department = 'All Departments', docType = 'All Types' } = await request.json()

    // 1. Filter documents by department and docType
    let results = enterpriseKnowledgeBase.filter(doc => {
      const matchDept = department === 'All Departments' || doc.department === department
      const matchType =
        docType === 'All Types' ||
        (docType === 'PDFs' && doc.docType === 'PDF') ||
        (docType === 'SOPs' && doc.docType === 'SOP') ||
        (docType === 'Policies' && doc.docType === 'Policy') ||
        (docType === 'Reports' && doc.docType === 'Report') ||
        (docType === 'Manuals' && doc.docType === 'Manual')
      return matchDept && matchType
    })

    // 2. Score relevance if query is provided
    if (query.trim()) {
      const lowerQuery = query.toLowerCase()
      const queryTerms = lowerQuery.split(/\s+/).filter(Boolean)

      results = results.map(doc => {
        let score = 50
        const text = `${doc.title} ${doc.snippet} ${doc.fullContent || ''}`.toLowerCase()

        queryTerms.forEach((term: string) => {
          if (doc.title.toLowerCase().includes(term)) score += 25
          if (doc.snippet.toLowerCase().includes(term)) score += 15
          if ((doc.fullContent || '').toLowerCase().includes(term)) score += 10
        })

        return {
          ...doc,
          relevance: Math.min(99.9, Math.max(65.0, score + Math.floor(Math.random() * 5)))
        }
      }).sort((a, b) => b.relevance - a.relevance)
    }

    // 3. Generate AI synthesis if query has substantive intent
    let aiSynthesis: string | null = null
    if (query.trim() && process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('placeholder')) {
      try {
        const topDocs = results.slice(0, 3)
        const contextStr = topDocs.map(d => `Source: ${d.title} (${d.sourcePage})\nContent: ${d.snippet}`).join('\n\n')

        const prompt = `You are Nexa Enterprise Intelligence Engine.
Answer this internal employee question using ONLY the provided verified documentation.
Question: "${query}"

Verified Documentation Context:
${contextStr}

Requirements:
- Provide a direct, professional, factual answer (2-4 sentences).
- Explicitly cite the source document.
- Zero hallucinations. If the documents don't have the answer, state that clearly.`

        aiSynthesis = await safeGeminiCall(async () => {
          const res = await geminiFlash.generateContent(prompt)
          return res.response.text()
        })
      } catch (err) {
        console.warn('AI synthesis fallback:', err)
      }
    }

    return NextResponse.json({
      success: true,
      query,
      totalCount: results.length,
      aiSynthesis,
      results
    })
  } catch (error: unknown) {
    console.error('Search API error:', error)
    return NextResponse.json({ error: 'Failed to process semantic search' }, { status: 500 })
  }
}
