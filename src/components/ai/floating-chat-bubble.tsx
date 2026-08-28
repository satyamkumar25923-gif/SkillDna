"use client"

import React, { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { cn } from "@/lib/utils"
import {
  Sparkles,
  Send,
  X,
  Minus,
  Maximize2,
  RotateCcw,
  Bot
} from "lucide-react"
import Link from "next/link"

interface MessageItem {
  role: "user" | "assistant"
  content: string
  suggestedActions?: string[]
}

const DEFAULT_GREETING: MessageItem = {
  role: "assistant",
  content: "Hey there! I'm **T800**, your personal AI Mentor. I have your full Skill DNA profile loaded.\n\nAsk me anything about your learning roadmap, technical concepts, skill gaps, or interview preparation. How can I help you today?",
}

// Exactly 4 quick action prompts: 2 above and 2 below in a clean 2x2 grid
const QUICK_PROMPTS = [
  "What should I study today?",
  "Explain my critical ML gap",
  "How to prep for AI interviews?",
  "Review my active roadmap",
]

export function FloatingChatBubble() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [showTeaser, setShowTeaser] = useState(false)
  const [teaserDismissed, setTeaserDismissed] = useState(false)
  const [messages, setMessages] = useState<MessageItem[]>([DEFAULT_GREETING])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Don't show floating widget if already on full mentor page
  const isFullMentorPage = pathname === "/dashboard/mentor"

  // Show teaser after a short delay on mount
  useEffect(() => {
    if (isFullMentorPage) return

    const timer = setTimeout(() => {
      if (!teaserDismissed && !isOpen) {
        setShowTeaser(true)
      }
    }, 1800)

    return () => clearTimeout(timer)
  }, [teaserDismissed, isOpen, isFullMentorPage])

  // Scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen, isLoading])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setShowTeaser(false)
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  if (isFullMentorPage) return null

  const handleSend = async (customText?: string) => {
    const text = (customText || input).trim()
    if (!text || isLoading) return

    const newMessages: MessageItem[] = [...messages, { role: "user", content: text }]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/ai/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: text,
          mentorPersona: "T800",
          history: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error("API request failed")

      const data = await res.json()
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.response || "I'm right here with you! What else would you like to explore?",
          suggestedActions: data.suggestedActions || [],
        },
      ])
    } catch (err) {
      console.error("Floating mentor error:", err)
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Let's focus on your primary goal: closing your **Machine Learning (43%)** gap with hands-on practice. What specific question do you have?",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setMessages([DEFAULT_GREETING])
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end print:hidden pointer-events-none">
      {/* 1. Teaser Message Popup */}
      {showTeaser && !isOpen && (
        <div className="mb-3 animate-in fade-in slide-in-from-bottom-3 duration-300 relative group max-w-xs pointer-events-auto">
          <div
            onClick={() => setIsOpen(true)}
            className="cursor-pointer bg-card/95 backdrop-blur-md text-foreground px-4 py-3 rounded-2xl shadow-xl border border-primary/30 hover:border-primary/60 transition-all flex items-center gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-primary">T800</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-sm font-medium text-foreground leading-snug">
                Hey, how can I help you?
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowTeaser(false)
                setTeaserDismissed(true)
              }}
              className="text-muted-foreground hover:text-foreground p-1 rounded-md opacity-70 hover:opacity-100 transition-opacity"
              aria-label="Close teaser"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          {/* Speech bubble arrow */}
          <div className="absolute right-6 -bottom-1.5 w-3 h-3 bg-card/95 border-r border-b border-primary/30 rotate-45" />
        </div>
      )}

      {/* 2. Floating Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[350px] sm:w-[390px] h-[520px] max-h-[82vh] bg-card/98 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 pointer-events-auto">
          {/* Header */}
          <div className="bg-muted/60 border-b border-border/50 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/20">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">T800</span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Restart conversation"
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <Link
                href="/dashboard/mentor"
                title="Open full studio"
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Area (Zero sideways scroll) */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 space-y-3 text-xs sm:text-sm">
            {messages.map((msg, i) => {
              const isUser = msg.role === "user"
              return (
                <div key={i} className={cn("flex gap-2 max-w-full overflow-hidden", isUser && "justify-end")}>
                  {!isUser && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 flex-shrink-0 text-xs mt-0.5">
                      <Bot className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div className={cn("max-w-[85%] overflow-hidden", isUser && "text-right")}>
                    <div
                      className={cn(
                        "inline-block rounded-2xl px-3.5 py-2.5 text-left text-xs sm:text-sm leading-relaxed shadow-xs break-words",
                        isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/40 border border-border/50 text-foreground"
                      )}
                    >
                      {isUser ? (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      ) : (
                        <MarkdownRenderer content={msg.content} />
                      )}

                      {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-border/30 space-y-1">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Suggested follow-ups:
                          </p>
                          <div className="grid grid-cols-1 gap-1">
                            {msg.suggestedActions.slice(0, 2).map((act, aIdx) => (
                              <button
                                key={aIdx}
                                onClick={() => handleSend(act)}
                                className="text-[11px] bg-background/80 hover:bg-background text-foreground px-2 py-1 rounded border border-border/50 transition-colors text-left truncate"
                              >
                                👉 {act}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}

            {isLoading && (
              <div className="flex items-start gap-2 animate-pulse">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 text-xs">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="bg-muted/40 rounded-2xl px-3.5 py-2.5 border border-border/50 text-xs text-muted-foreground flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 animate-spin text-primary" />
                  T800 is thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions (2 above, 2 down - 2x2 grid, no sideways scroll) */}
          {messages.length <= 2 && (
            <div className="p-2 border-t border-border/40 bg-muted/20">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-1.5">
                Quick Actions:
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {QUICK_PROMPTS.map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSend(prompt)}
                    className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-background hover:bg-muted border border-border/60 text-foreground transition-colors truncate"
                    title={prompt}
                  >
                    👉 {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="border-t border-border/50 p-2.5 bg-background/60">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-end gap-2"
            >
              <Textarea
                ref={inputRef}
                placeholder="Ask T800 a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                rows={1}
                className="min-h-[40px] max-h-24 resize-none text-xs sm:text-sm py-2 px-3 bg-muted/30 focus-visible:ring-primary/40 rounded-xl"
              />
              <Button
                type="submit"
                size="icon"
                variant="premium"
                disabled={!input.trim() || isLoading}
                className="h-10 w-10 rounded-xl flex-shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Floating Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen)
          if (!isOpen) setShowTeaser(false)
        }}
        aria-label="Open T800 AI Mentor"
        className={cn(
          "relative flex h-14 w-14 items-center justify-center rounded-2xl shadow-xl transition-all duration-200 group pointer-events-auto",
          "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white",
          "hover:brightness-110 hover:shadow-blue-500/30 active:scale-95",
          isOpen && "rotate-90 bg-muted text-foreground border border-border"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <Bot className="h-7 w-7 transition-transform group-hover:scale-105" />
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-background" />
            </span>
          </>
        )}
      </button>
    </div>
  )
}
