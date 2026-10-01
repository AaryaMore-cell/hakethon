'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Plus, Brain, User, Loader2, Trash2, MessageSquare, Sparkles, Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { generateId, formatRelativeTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

const SUGGESTED_PROMPTS = [
  'What are the key enterprise use cases for AI?',
  'Create a Q4 project plan for our mobile app launch',
  'Summarize best practices for remote team management',
  'What are the main risks in vendor contract negotiations?',
  'Generate a task list for a website redesign project',
]

function ChatMessage({ message }: { message: Message }) {
  const [copied, setCopied] = useState(false)
  const isUser = message.role === 'user'

  const copy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('flex gap-3 group', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1',
        isUser ? 'bg-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
      )}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Brain className="w-4 h-4 text-white" />}
      </div>
      <div className={cn('max-w-[75%] space-y-1', isUser ? 'items-end flex flex-col' : '')}>
        <div className={cn(
          'rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-indigo-600 text-white rounded-tr-none'
            : 'glass border border-border text-foreground rounded-tl-none'
        )}>
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose-dark">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
        <div className={cn('flex items-center gap-2', isUser ? 'flex-row-reverse' : '')}>
          <span className="text-xs text-muted-foreground">{formatRelativeTime(message.timestamp)}</span>
          {!isUser && (
            <button onClick={copy} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
        <Brain className="w-4 h-4 text-white" />
      </div>
      <div className="glass border border-border rounded-2xl rounded-tl-none px-4 py-3">
        <div className="flex gap-1.5 items-center h-4">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const activeConversation = conversations.find((c) => c.id === activeId)

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => { scrollToBottom() }, [activeConversation?.messages])

  const newConversation = useCallback(() => {
    const id = generateId()
    const conv: Conversation = { id, title: 'New conversation', messages: [], createdAt: new Date() }
    setConversations((prev) => [conv, ...prev])
    setActiveId(id)
  }, [])

  useEffect(() => { if (conversations.length === 0) newConversation() }, [])

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !activeId) return

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    const messageText = input.trim()
    setInput('')
    setIsLoading(true)

    // Add user message and update title on first message
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? {
              ...c,
              title: c.messages.length === 0 ? messageText.slice(0, 50) : c.title,
              messages: [...c.messages, userMessage],
            }
          : c
      )
    )

    try {
      const history = activeConversation?.messages.map((m) => ({ role: m.role, content: m.content })) ?? []

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText, history }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }

      setConversations((prev) =>
        prev.map((c) => c.id === activeId ? { ...c, messages: [...c.messages, assistantMessage] } : c)
      )

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') break
              try {
                const { text } = JSON.parse(data)
                fullText += text
                setConversations((prev) =>
                  prev.map((c) =>
                    c.id === activeId
                      ? { ...c, messages: c.messages.map((m) => m.id === assistantMessage.id ? { ...m, content: fullText } : m) }
                      : c
                  )
                )
              } catch {}
            }
          }
        }
      }
    } catch (error) {
      const errMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: '⚠️ Sorry, I encountered an error. Please check your API configuration and try again.',
        timestamp: new Date(),
      }
      setConversations((prev) =>
        prev.map((c) => c.id === activeId ? { ...c, messages: [...c.messages, errMsg] } : c)
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id))
    if (activeId === id) {
      const remaining = conversations.filter((c) => c.id !== id)
      setActiveId(remaining[0]?.id ?? null)
      if (remaining.length === 0) newConversation()
    }
  }

  return (
    <div className="flex h-full">
      {/* Conversations sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-border flex flex-col bg-background/50 hidden md:flex">
        <div className="p-4 border-b border-border">
          <button
            onClick={newConversation}
            className="w-full flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {conversations.map((c) => (
            <div
              key={c.id}
              className={cn(
                'group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all',
                c.id === activeId ? 'bg-indigo-600/20 border border-indigo-500/30' : 'hover:bg-secondary'
              )}
              onClick={() => setActiveId(c.id)}
            >
              <MessageSquare className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-foreground truncate flex-1">{c.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); deleteConversation(c.id) }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border glass flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-sm">Enterprise AI Copilot</h1>
            <p className="text-xs text-muted-foreground">Powered by Gemini 1.5 Flash</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">How can I help you today?</h2>
              <p className="text-muted-foreground text-sm mb-8 max-w-sm">
                Ask me anything about your projects, company knowledge, or workflow optimization.
              </p>
              <div className="grid grid-cols-1 gap-2 w-full max-w-lg">
                {SUGGESTED_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => { setInput(p); textareaRef.current?.focus() }}
                    className="flex items-center gap-2 text-left text-sm glass border border-border hover:border-indigo-500/40 rounded-xl px-4 py-3 text-muted-foreground hover:text-foreground transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {activeConversation.messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border glass">
          <div className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything... (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all max-h-32"
              style={{ minHeight: '46px' }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-11 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all"
            >
              {isLoading ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">AI can make mistakes. Verify important information.</p>
        </div>
      </div>
    </div>
  )
}
