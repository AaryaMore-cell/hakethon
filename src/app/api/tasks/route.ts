import { NextRequest, NextResponse } from 'next/server'
import { geminiFlash, safeGeminiCall } from '@/lib/gemini'

function buildTaskPrompt(goal: string) {
  return `You are an expert project manager. Generate a comprehensive task list for the following goal.

Goal: ${goal}

Return ONLY a valid JSON object with this structure:
{
  "tasks": [
    {
      "title": "Concise task title",
      "description": "Clear description of what needs to be done and why",
      "priority": "high",
      "estimated_hours": 4
    }
  ]
}

Rules:
- Generate 8-15 tasks that cover the full scope of the goal
- priority must be exactly: "low", "medium", "high", or "critical"
- estimated_hours must be a realistic number (0.5 to 40)
- Order tasks logically (dependencies first)
- Be specific and actionable — avoid vague tasks
- Return ONLY the JSON, no markdown, no explanation`
}

export async function POST(request: NextRequest) {
  try {
    const { goal } = await request.json()

    if (!goal || goal.trim().length < 5) {
      return NextResponse.json({ error: 'Please provide a project goal' }, { status: 400 })
    }

    const result = await safeGeminiCall(() =>
      geminiFlash.generateContent({
        contents: [{ role: 'user', parts: [{ text: buildTaskPrompt(goal) }] }],
        generationConfig: { responseMimeType: 'application/json' },
      })
    )
    const responseText = result.response.text()

    let parsed
    try {
      const cleaned = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
      parsed = JSON.parse(cleaned)
    } catch {
      // If regex extraction needed
      const match = responseText.match(/\{[\s\S]*\}/)
      if (match) {
        parsed = JSON.parse(match[0])
      } else {
        return NextResponse.json({ error: 'Failed to parse generated tasks.' }, { status: 500 })
      }
    }

    return NextResponse.json({ tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [] })
  } catch (error: unknown) {
    console.error('Tasks API error:', error)
    return NextResponse.json({ error: 'Failed to generate task list' }, { status: 500 })
  }
}
