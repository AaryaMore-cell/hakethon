import { NextRequest, NextResponse } from 'next/server'
import { geminiPro, safeGeminiCall } from '@/lib/gemini'

function buildDecisionPrompt(topic: string, context?: string) {
  return `You are an elite Enterprise Strategy Consultant and Solutions Architect.
Perform a rigorous strategic analysis and decision evaluation for the following organizational proposal or initiative.

Initiative/Topic: ${topic}
Additional Enterprise Context: ${context || 'Standard high-growth tech/enterprise environment with SOC2 compliance requirements.'}

Return ONLY a valid JSON object with this exact structure:
{
  "topic": "${topic}",
  "strategicScore": 88,
  "executiveSummary": "Concise 2-3 sentence strategic executive summary.",
  "swot": {
    "strengths": ["Strength 1", "Strength 2", "Strength 3"],
    "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
    "opportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"],
    "threats": ["Threat 1", "Threat 2", "Threat 3"]
  },
  "riskAnalysis": [
    {
      "risk": "Description of risk",
      "severity": "high",
      "mitigation": "Concrete actionable mitigation strategy"
    }
  ],
  "recommendations": [
    {
      "phase": "Immediate (30 Days)",
      "action": "Concrete tactical step",
      "impact": "High"
    },
    {
      "phase": "Medium Term (60 Days)",
      "action": "Concrete strategic milestone",
      "impact": "Medium"
    }
  ]
}

Rules:
- severity must be: "low", "medium", "high", or "critical"
- Provide 3-4 items for each SWOT category
- Provide 3-4 specific risks with mitigation
- strategicScore must be a number between 60 and 98
- Return ONLY valid JSON, no markdown codeblocks, no conversational filler.`
}

export async function POST(request: NextRequest) {
  try {
    const { topic, context } = await request.json()

    if (!topic || topic.trim().length < 5) {
      return NextResponse.json({ error: 'Please provide a valid strategic decision or project topic' }, { status: 400 })
    }

    const prompt = buildDecisionPrompt(topic, context)
    const result = await safeGeminiCall(() =>
      geminiPro.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      })
    )

    const responseText = result.response.text()

    let parsed
    try {
      const cleaned = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim()
      parsed = JSON.parse(cleaned)
    } catch {
      const match = responseText.match(/\{[\s\S]*\}/)
      if (match) {
        parsed = JSON.parse(match[0])
      } else {
        return NextResponse.json({ error: 'Failed to generate strategic analysis JSON' }, { status: 500 })
      }
    }

    return NextResponse.json(parsed)
  } catch (error: unknown) {
    console.error('Decision API error:', error)
    return NextResponse.json({ error: 'Failed to generate strategic decision report' }, { status: 500 })
  }
}
