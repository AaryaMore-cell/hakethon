import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY!
const genAI = new GoogleGenerativeAI(apiKey)

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
]

// Gemini 3.5 Flash — fast, reliable model for chat, tasks, summaries
export const geminiFlash = genAI.getGenerativeModel({
  model: 'gemini-3.5-flash',
  safetySettings,
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    maxOutputTokens: 4096,
  },
})

// Gemini 3.5 Flash / Pro — high-capability model for document analysis and roadmaps
export const geminiPro = genAI.getGenerativeModel({
  model: 'gemini-3.5-flash',
  safetySettings,
  generationConfig: {
    temperature: 0.6,
    topP: 0.9,
    maxOutputTokens: 8192,
  },
})

// Embedding model for semantic search
export const embeddingModel = genAI.getGenerativeModel({
  model: 'gemini-embedding-001',
})

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const result = await embeddingModel.embedContent(text)
    return result.embedding.values
  } catch (error) {
    console.error('Embedding error:', error)
    throw new Error('Failed to generate embedding')
  }
}

// Robust wrapper with retry on rate limit and temporary 503 service unavailable
export async function safeGeminiCall<T>(
  fn: () => Promise<T>,
  maxRetries: number = 2
): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error: unknown) {
      lastError = error
      const err = error as { status?: number; message?: string }
      if (err?.status === 429 || err?.status === 503) {
        if (attempt < maxRetries) {
          console.warn(`Gemini API returned status ${err.status}, retrying attempt ${attempt + 1}...`)
          await new Promise((r) => setTimeout(r, 1500 * (attempt + 1)))
          continue
        }
      }
      throw error
    }
  }
  throw lastError
}

// System prompt builder
export function buildSystemPrompt(extras?: string): string {
  return `You are an Enterprise AI Copilot — a professional AI assistant for workplace productivity.

PERSONALITY:
- Professional, concise, and action-oriented
- Always provide structured, scannable output
- Use Markdown: headers, bullet points, numbered lists, tables, code blocks where appropriate
- Be direct — skip filler phrases like "Certainly!" or "Of course!"
- If you don't know something, say so clearly rather than guessing

FORMATTING RULES:
- Use **bold** for key terms and important information
- Use \`code\` for technical terms, commands, or file names
- Use tables for comparative or structured data
- For tasks: always include title, description, priority (Low/Medium/High), estimated hours
- For roadmaps: always use phased structure with clear milestones
- For summaries: Key Points → Action Items → Decisions Made

${extras ? `ADDITIONAL CONTEXT:\n${extras}` : ''}
`
}
