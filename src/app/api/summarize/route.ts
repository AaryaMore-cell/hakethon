import { NextRequest, NextResponse } from 'next/server'
import { geminiFlash, safeGeminiCall } from '@/lib/gemini'

const SUMMARIZE_PROMPT = `You are an expert meeting facilitator. Analyze the following meeting notes and create a structured summary.

Format your response in clean Markdown with these sections:

## 📋 Meeting Summary

**Date:** [Extract if mentioned, otherwise "Not specified"]  
**Attendees:** [List if mentioned, otherwise "Not specified"]

## ✅ Key Decisions
[Bulleted list of decisions made]

## 📌 Action Items
| Task | Owner | Due Date |
|------|-------|----------|
[Fill in the table]

## 💡 Key Discussion Points
[Bulleted list of main topics discussed]

## ❓ Open Questions
[Unresolved questions that need follow-up]

## 📅 Next Steps
[What happens next]

---
Be concise. If information is not available in the notes, write "Not mentioned" for that field.

Meeting notes:
`

export async function POST(request: NextRequest) {
  try {
    const { notes } = await request.json()

    if (!notes || notes.trim().length < 10) {
      return NextResponse.json({ error: 'Please provide meeting notes to summarize' }, { status: 400 })
    }

    const result = await safeGeminiCall(() => geminiFlash.generateContent(SUMMARIZE_PROMPT + notes))
    const summary = result.response.text()

    return NextResponse.json({ summary })
  } catch (error: unknown) {
    console.error('Summarize API error:', error)
    return NextResponse.json({ error: 'Failed to summarize meeting notes' }, { status: 500 })
  }
}
