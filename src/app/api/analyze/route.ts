import { NextRequest, NextResponse } from 'next/server'
import { geminiPro } from '@/lib/gemini'

const ANALYSIS_PROMPT = `You are an expert document analyst. Analyze the following document and provide a structured analysis.

Return your response as a valid JSON object with exactly this structure:
{
  "summary": "3-5 sentence executive summary of the document",
  "keyPoints": ["point 1", "point 2", "point 3", ...],
  "actionItems": ["action 1", "action 2", ...],
  "risks": ["risk 1", "risk 2", ...]
}

Rules:
- keyPoints: 5-10 most important points
- actionItems: concrete next steps (empty array [] if none)
- risks: potential risks or red flags (empty array [] if none)
- All values must be strings in the arrays
- Return ONLY the JSON, no markdown, no explanation

Document to analyze:
`

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB.' }, { status: 400 })
    }

    // Read file content
    const text = await file.text()

    if (!text || text.trim().length < 10) {
      return NextResponse.json(
        { error: 'Could not extract text from this file. Please try a plain text or readable PDF.' },
        { status: 400 }
      )
    }

    // Truncate to avoid token limits (approx 100k chars = ~25k tokens)
    const truncated = text.slice(0, 100000)

    const result = await geminiPro.generateContent({
      contents: [{ role: 'user', parts: [{ text: ANALYSIS_PROMPT + truncated }] }],
      generationConfig: { responseMimeType: 'application/json' },
    })
    const responseText = result.response.text()

    // Parse JSON from response
    let parsed
    try {
      // Strip markdown code blocks if present
      const cleaned = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
      parsed = JSON.parse(cleaned)
    } catch {
      const match = responseText.match(/\{[\s\S]*\}/)
      if (match) {
        try {
          parsed = JSON.parse(match[0])
        } catch {
          parsed = null
        }
      }
      if (!parsed) {
        parsed = {
          summary: responseText.slice(0, 500),
          keyPoints: ['Unable to parse structured output. See summary above.'],
          actionItems: [],
          risks: [],
        }
      }
    }

    return NextResponse.json({
      fileName: file.name,
      summary: parsed.summary || '',
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints : [],
      actionItems: Array.isArray(parsed.actionItems) ? parsed.actionItems : [],
      risks: Array.isArray(parsed.risks) ? parsed.risks : [],
    })
  } catch (error: unknown) {
    console.error('Document analysis error:', error)
    const msg = (error as Error).message || 'Failed to analyze document'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
