import { NextRequest, NextResponse } from 'next/server'
import { geminiPro, safeGeminiCall } from '@/lib/gemini'

function buildPlanPrompt(data: { name: string; goal: string; timeline: string; teamSize: string; constraints?: string }) {
  return `You are an expert project manager. Generate a detailed project roadmap.

Project Details:
- Name: ${data.name}
- Goal: ${data.goal}
- Timeline: ${data.timeline}
- Team size: ${data.teamSize} people
- Constraints: ${data.constraints || 'None specified'}

Return ONLY a valid JSON object with this exact structure:
{
  "phases": [
    {
      "name": "Phase Name",
      "duration": "X weeks",
      "milestones": ["milestone 1", "milestone 2"],
      "tasks": [
        {
          "title": "Task title",
          "description": "Brief description of what to do",
          "priority": "high",
          "estimated_hours": 8,
          "assignee_suggestion": "Frontend Developer"
        }
      ]
    }
  ],
  "risks": ["risk 1", "risk 2", "risk 3"],
  "success_metrics": ["metric 1", "metric 2", "metric 3"]
}

Rules:
- Create 3-5 phases appropriate for the timeline
- Each phase should have 2-4 milestones and 4-8 tasks
- priority must be: "low", "medium", "high", or "critical"
- estimated_hours must be a number (integer)
- risks: 3-5 key project risks
- success_metrics: 3-5 measurable success criteria
- Return ONLY the JSON, no markdown, no explanation`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, goal, timeline, teamSize, constraints } = body

    if (!name || !goal || !timeline) {
      return NextResponse.json({ error: 'Name, goal, and timeline are required' }, { status: 400 })
    }

    const prompt = buildPlanPrompt({ name, goal, timeline, teamSize: teamSize || '4', constraints })
    const result = await safeGeminiCall(() =>
      geminiPro.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      })
    )
    const responseText = result.response.text()

    let roadmap
    try {
      const cleaned = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
      roadmap = JSON.parse(cleaned)
    } catch {
      const match = responseText.match(/\{[\s\S]*\}/)
      if (match) {
        roadmap = JSON.parse(match[0])
      } else {
        return NextResponse.json(
          { error: 'Failed to generate a valid roadmap. Please try again with more specific details.' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ roadmap, projectName: name })
  } catch (error: unknown) {
    console.error('Plan API error:', error)
    return NextResponse.json({ error: 'Failed to generate project plan' }, { status: 500 })
  }
}
