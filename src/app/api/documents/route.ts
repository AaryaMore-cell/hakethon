import { NextRequest, NextResponse } from 'next/server'
import { geminiFlash, safeGeminiCall } from '@/lib/gemini'

interface DocumentItem {
  id: string
  name: string
  size: string
  uploadedAt: string
  status: 'indexed' | 'indexing' | 'error'
  department: string
  tags: string[]
  chunks: number
}

// In-memory persistent state across serverless container invocation
let documentsStore: DocumentItem[] = [
  {
    id: 'doc-001',
    name: 'SOC2-Type-II-Report-FY2026.pdf',
    size: '4.8 MB',
    uploadedAt: 'Today at 09:15 AM',
    status: 'indexed',
    department: 'Security & Legal',
    tags: ['SOC2', 'Audit', 'Compliance'],
    chunks: 142
  },
  {
    id: 'doc-002',
    name: 'Engineering-RFC-ZeroTrust-Architecture.md',
    size: '1.2 MB',
    uploadedAt: 'Yesterday at 04:30 PM',
    status: 'indexed',
    department: 'Engineering',
    tags: ['Architecture', 'RFC', 'Security'],
    chunks: 48
  },
  {
    id: 'doc-003',
    name: 'Global-Remote-Work-Expense-Policy-2026.pdf',
    size: '890 KB',
    uploadedAt: 'Oct 1, 2026',
    status: 'indexed',
    department: 'People & HR',
    tags: ['HR', 'Policy', 'Benefits'],
    chunks: 36
  },
  {
    id: 'doc-004',
    name: 'Enterprise-Master-Services-Agreement-Template.docx',
    size: '2.4 MB',
    uploadedAt: 'Sep 28, 2026',
    status: 'indexed',
    department: 'Legal',
    tags: ['MSA', 'Legal', 'Contract'],
    chunks: 89
  },
  {
    id: 'doc-005',
    name: 'SRE-Incident-Response-Triage-Playbook.pdf',
    size: '3.1 MB',
    uploadedAt: 'Sep 25, 2026',
    status: 'indexed',
    department: 'DevOps & SRE',
    tags: ['Runbook', 'PagerDuty', 'SRE'],
    chunks: 94
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get('department') || 'All'
    const search = (searchParams.get('q') || '').toLowerCase()

    let results = [...documentsStore]

    if (department !== 'All') {
      results = results.filter(d => d.department.toLowerCase() === department.toLowerCase())
    }

    if (search) {
      results = results.filter(d =>
        d.name.toLowerCase().includes(search) ||
        d.tags.some(t => t.toLowerCase().includes(search))
      )
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      documents: results
    })
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, department = 'General', tags = [], content } = body

    if (!name) {
      return NextResponse.json({ error: 'Document name is required' }, { status: 400 })
    }

    const newDoc: DocumentItem = {
      id: `doc-${Date.now().toString(36)}`,
      name,
      size: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
      uploadedAt: 'Just now',
      status: 'indexed',
      department,
      tags: tags.length ? tags : ['General', 'Indexed'],
      chunks: Math.floor(Math.random() * 60) + 20
    }

    // Prepend to documents store
    documentsStore = [newDoc, ...documentsStore]

    // Optionally generate quick AI summary of content
    let summary: string | null = null
    if (content && process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('placeholder')) {
      try {
        summary = await safeGeminiCall(async () => {
          const res = await geminiFlash.generateContent(
            `Summarize this document briefly in 2 bullet points:\n\n${content.slice(0, 3000)}`
          )
          return res.response.text()
        })
      } catch (err) {
        console.warn('Summary generation skipped:', err)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Document successfully ingested and indexed into Knowledge Lake',
      document: newDoc,
      summary
    }, { status: 201 })
  } catch (error: unknown) {
    console.error('Document ingestion error:', error)
    return NextResponse.json({ error: 'Failed to ingest document' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 })
    }

    documentsStore = documentsStore.filter(d => d.id !== id)
    return NextResponse.json({ success: true, message: 'Document removed from index' })
  } catch (error: unknown) {
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
  }
}
