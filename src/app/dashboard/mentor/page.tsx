"use client"

import React, { useState, useRef, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"
import { cn } from "@/lib/utils"
import {
  Bot,
  Sparkles,
  Brain,
  Target,
  BookOpen,
  Code,
  Briefcase,
  TrendingUp,
  Settings,
  Copy,
  Plus,
  History,
  Send,
  AlertTriangle,
  Award,
  Calendar,
  Check,
  Trash2,
  Clock,
  ChevronRight,
  MessageSquare
} from "lucide-react"

const studentContext = {
  targetCareer: "AI Engineer",
  skills: [
    { name: "Python", proficiency: 85 },
    { name: "Machine Learning", proficiency: 45 },
    { name: "Deep Learning", proficiency: 35 },
    { name: "SQL & Databases", proficiency: 80 },
    { name: "Git & Version Control", proficiency: 90 },
  ],
  skillGaps: [
    { skill: "Machine Learning", gapType: "critical", priority: 1 },
    { skill: "Deep Learning / PyTorch", gapType: "major", priority: 2 },
    { skill: "MLOps & Docker", gapType: "major", priority: 3 },
  ],
  roadmap: [
    { week: 1, title: "Deep Learning Foundations (PyTorch)", status: "in-progress" },
    { week: 2, title: "CNNs and Computer Vision", status: "pending" },
    { week: 3, title: "Transformers and Hugging Face", status: "pending" },
  ],
  projects: [
    { name: "Full-Stack Task Manager", techStack: ["Next.js", "TypeScript", "Prisma"] },
    { name: "Sentiment Analysis API", techStack: ["Python", "FastAPI", "Scikit-Learn"] },
  ],
}

interface MessageItem {
  role: "user" | "assistant"
  content: string
  suggestedActions?: string[]
}

interface ChatSession {
  id: string
  title: string
  timestamp: number
  messages: MessageItem[]
}

const DEFAULT_WELCOME_MSG: MessageItem = {
  role: "assistant",
  content: "Hey there! I'm **T800**, your personal AI Mentor & Career Guide. I have your full Skill DNA profile loaded.\n\nWhether you want to break down a tough ML concept with simple analogies, review your PyTorch roadmap, or practice interview questions—I'm right here with you. What would you like to explore today?",
}

// Exactly 4 quick actions: 2 on row 1, 2 on row 2
const QUICK_PROMPTS = [
  "What should I study today?",
  "Explain my critical ML gap",
  "How to prep for AI interviews?",
  "Review my active roadmap",
]

const STORAGE_KEY = "skilldna_mentor_sessions_v2"
const ACTIVE_SESSION_KEY = "skilldna_mentor_active_id_v2"

export default function MentorPage() {
  const [activeTab, setActiveTab] = useState("chat")
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>("")
  const [messages, setMessages] = useState<MessageItem[]>([DEFAULT_WELCOME_MSG])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 1. Load sessions from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      const savedActiveId = localStorage.getItem(ACTIVE_SESSION_KEY)
      if (saved) {
        const parsed: ChatSession[] = JSON.parse(saved)
        if (parsed && parsed.length > 0) {
          setSessions(parsed)
          const active = parsed.find(s => s.id === savedActiveId) || parsed[0]
          setCurrentSessionId(active.id)
          setMessages(active.messages.length > 0 ? active.messages : [DEFAULT_WELCOME_MSG])
          setIsLoaded(true)
          return
        }
      }
    } catch (e) {
      console.warn("Could not parse saved chat sessions:", e)
    }

    const newId = "session_" + Date.now()
    const initialSession: ChatSession = {
      id: newId,
      title: "New Conversation",
      timestamp: Date.now(),
      messages: [DEFAULT_WELCOME_MSG],
    }
    setSessions([initialSession])
    setCurrentSessionId(newId)
    setMessages([DEFAULT_WELCOME_MSG])
    setIsLoaded(true)
  }, [])

  // 2. Persist sessions to localStorage
  useEffect(() => {
    if (!isLoaded || !currentSessionId) return
    try {
      setSessions(prevSessions => {
        const updated = prevSessions.map(session => {
          if (session.id === currentSessionId) {
            const firstUserMsg = messages.find(m => m.role === "user")
            const title = firstUserMsg
              ? (firstUserMsg.content.length > 32 ? firstUserMsg.content.slice(0, 32) + "..." : firstUserMsg.content)
              : session.title

            return {
              ...session,
              title,
              timestamp: Date.now(),
              messages,
            }
          }
          return session
        })

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
          localStorage.setItem(ACTIVE_SESSION_KEY, currentSessionId)
        } catch (_) {}

        return updated
      })
    } catch (err) {
      console.error("Error saving sessions:", err)
    }
  }, [messages, currentSessionId, isLoaded])

  // 3. Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleNewChat = () => {
    const newId = "session_" + Date.now()
    const newSession: ChatSession = {
      id: newId,
      title: "New Conversation",
      timestamp: Date.now(),
      messages: [DEFAULT_WELCOME_MSG],
    }
    setSessions(prev => [newSession, ...prev])
    setCurrentSessionId(newId)
    setMessages([DEFAULT_WELCOME_MSG])
    setActiveTab("chat")
    setTimeout(() => textareaRef.current?.focus(), 150)
  }

  const handleSelectSession = (sessionId: string) => {
    const selected = sessions.find(s => s.id === sessionId)
    if (selected) {
      setCurrentSessionId(selected.id)
      setMessages(selected.messages.length > 0 ? selected.messages : [DEFAULT_WELCOME_MSG])
      setActiveTab("chat")
    }
  }

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation()
    const filtered = sessions.filter(s => s.id !== sessionId)
    setSessions(filtered)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    } catch (_) {}

    if (currentSessionId === sessionId) {
      if (filtered.length > 0) {
        setCurrentSessionId(filtered[0].id)
        setMessages(filtered[0].messages)
      } else {
        handleNewChat()
      }
    }
  }

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim()
    if (!textToSend || isLoading) return

    const updatedMessages: MessageItem[] = [...messages, { role: "user", content: textToSend }]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/ai/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToSend,
          userContext: studentContext,
          mentorPersona: "T800",
          history: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) throw new Error(`Server error: ${res.status}`)

      const data = await res.json()
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.response || "I have reviewed your request. What would you like to explore next?",
          suggestedActions: data.suggestedActions || [],
        },
      ])
    } catch (err) {
      console.error("Failed to fetch mentor response:", err)
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

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">AI Career Mentor</h1>
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                <Bot className="h-3 w-3 mr-1" />
                T800
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Personalized career advisor connected to your Skill DNA
            </p>
          </div>
          <Button variant="premium" size="sm" onClick={handleNewChat} className="w-full sm:w-auto h-9">
            <Plus className="mr-1.5 h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-10 p-1 bg-muted/60">
            <TabsTrigger value="chat" className="text-xs sm:text-sm">
              <MessageSquare className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs sm:text-sm">
              <History className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
              History ({sessions.length})
            </TabsTrigger>
            <TabsTrigger value="context" className="text-xs sm:text-sm">
              <Brain className="h-3.5 w-3.5 mr-1.5 hidden sm:inline" />
              My Context
            </TabsTrigger>
          </TabsList>

          {/* CHAT TAB */}
          <TabsContent value="chat" className="space-y-4 mt-0">
            <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Chat Window Column */}
              <div className="lg:col-span-3 flex flex-col h-[calc(100dvh-15.5rem)] sm:h-[620px] lg:h-[680px]">
                <Card className="bg-card border-border/60 flex-1 flex flex-col overflow-hidden shadow-sm">
                  {/* Chat Header */}
                  <CardHeader className="border-b border-border/50 py-2.5 px-3 sm:px-4 bg-muted/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                          <Bot className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-semibold">T800</span>
                            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-500 font-medium">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              Active
                            </span>
                          </div>
                        </div>
                      </div>

                      <Badge variant="secondary" className="text-[10px] sm:text-xs">
                        Target: AI Engineer
                      </Badge>
                    </div>
                  </CardHeader>

                  {/* Messages Scroll Area */}
                  <CardContent className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-3.5">
                    {messages.map((msg, i) => (
                      <MessageBubble
                        key={i}
                        message={msg}
                        index={i}
                        isCopied={copiedIndex === i}
                        onCopy={() => copyToClipboard(msg.content, i)}
                        onActionClick={(action) => handleSend(action)}
                      />
                    ))}
                    <div ref={messagesEndRef} />

                    {isLoading && (
                      <div className="flex items-start gap-2.5 animate-pulse">
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 flex-shrink-0">
                          <Bot className="h-3.5 w-3.5" />
                        </div>
                        <div className="bg-muted/40 rounded-2xl px-3.5 py-2.5 border border-border/50 text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                          <Sparkles className="h-3.5 w-3.5 animate-spin text-primary" />
                          T800 is thinking...
                        </div>
                      </div>
                    )}
                  </CardContent>

                  {/* Quick Actions (2 above, 2 down) on initial chat state */}
                  {messages.length <= 2 && (
                    <div className="px-3 py-2 border-t border-border/40 bg-muted/20">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Quick Suggestions:
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {QUICK_PROMPTS.map((prompt, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSend(prompt)}
                            className="text-left text-[11px] sm:text-xs px-2.5 py-1.5 rounded-lg bg-card hover:bg-muted border border-border/60 text-foreground transition-all hover:border-primary/40 truncate flex items-center gap-1"
                            title={prompt}
                          >
                            <span className="text-primary text-[10px]">👉</span>
                            <span className="truncate">{prompt}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input Footer */}
                  <CardFooter className="border-t border-border/50 p-2.5 sm:p-3 bg-background/50">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        handleSend()
                      }}
                      className="flex items-end gap-2 w-full"
                    >
                      <Textarea
                        ref={textareaRef}
                        placeholder="Ask T800 about roadmaps, interviews, or concepts..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSend()
                          }
                        }}
                        rows={1}
                        className="min-h-[42px] max-h-28 resize-none text-xs sm:text-sm py-2.5 px-3 bg-muted/30 focus-visible:ring-primary/40 rounded-xl"
                      />
                      <Button
                        type="submit"
                        size="icon"
                        variant="premium"
                        disabled={!input.trim() || isLoading}
                        className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl flex-shrink-0"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </CardFooter>
                </Card>
              </div>

              {/* Sidebar: Profile Context & Quick Info (Hidden on small screens, shown on desktop) */}
              <div className="hidden lg:flex flex-col gap-4">
                <Card className="bg-card border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Brain className="h-4 w-4 text-primary" />
                      Live Skill DNA Context
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40">
                      <p className="text-muted-foreground text-[10px]">Target Career</p>
                      <p className="font-semibold text-foreground mt-0.5">AI Engineer</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40">
                      <p className="text-muted-foreground text-[10px]">Top Skill Gap</p>
                      <p className="font-semibold text-amber-400 mt-0.5">Machine Learning (43%)</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40">
                      <p className="text-muted-foreground text-[10px]">Active Roadmap Week</p>
                      <p className="font-semibold text-foreground mt-0.5">Week 1: PyTorch Foundations</p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40">
                      <p className="text-muted-foreground text-[10px]">Strongest Skill</p>
                      <p className="font-semibold text-emerald-400 mt-0.5">Python (85%)</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border/50 flex-1">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Actions & Prompts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {QUICK_PROMPTS.map((prompt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(prompt)}
                        className="w-full text-left text-xs p-2.5 rounded-lg bg-muted/40 hover:bg-muted border border-border/40 hover:border-primary/40 text-foreground transition-all flex items-center justify-between"
                      >
                        <span className="truncate pr-2">{prompt}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* HISTORY TAB */}
          <TabsContent value="history" className="space-y-4 mt-0">
            <Card className="bg-card border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  Conversation History
                </CardTitle>
                <p className="text-xs text-muted-foreground">All your mentoring sessions are saved locally</p>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {sessions.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-6 text-center">No past conversations yet.</p>
                ) : (
                  sessions.map((sess) => (
                    <div
                      key={sess.id}
                      onClick={() => handleSelectSession(sess.id)}
                      className={cn(
                        "p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3",
                        sess.id === currentSessionId
                          ? "bg-primary/10 border-primary/40 text-foreground"
                          : "bg-muted/40 border-border/50 hover:bg-muted/70 text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary flex-shrink-0">
                          <MessageSquare className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium truncate">{sess.title}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {new Date(sess.timestamp).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {sess.id === currentSessionId && (
                          <Badge variant="outline" className="text-[10px] hidden sm:inline-flex">Active</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-destructive"
                          onClick={(e) => handleDeleteSession(e, sess.id)}
                          title="Delete session"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CONTEXT TAB */}
          <TabsContent value="context" className="space-y-4 mt-0">
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  Skill DNA Parameters
                </CardTitle>
                <p className="text-xs text-muted-foreground">Parameters automatically provided to T800:</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <ContextToggle label="Skill DNA Profile & Proficiency Scores" enabled />
                <ContextToggle label="Critical & Major Gap Analysis" enabled />
                <ContextToggle label="Active 12-Week Learning Roadmap" enabled />
                <ContextToggle label="Project Portfolio & Tech Stacks" enabled />
                <ContextToggle label="Target Career Benchmarks" enabled />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

function MessageBubble({
  message,
  index,
  isCopied,
  onCopy,
  onActionClick,
}: {
  message: MessageItem
  index: number
  isCopied: boolean
  onCopy: () => void
  onActionClick: (action: string) => void
}) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-2.5 max-w-full overflow-hidden", isUser && "justify-end")}>
      {!isUser && (
        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 flex-shrink-0 text-xs mt-0.5">
          <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </div>
      )}
      <div className={cn("max-w-[88%] sm:max-w-[80%] overflow-hidden", isUser && "text-right")}>
        <div
          className={cn(
            "inline-block rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-left text-xs sm:text-sm leading-relaxed shadow-xs break-words",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-card/90 dark:bg-muted/40 border border-border/50 text-foreground"
          )}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}

          {message.suggestedActions && message.suggestedActions.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-border/30 space-y-1">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Recommended Next Steps:
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {message.suggestedActions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => onActionClick(act)}
                    className="text-[11px] bg-background/80 hover:bg-background text-foreground px-2 py-0.5 rounded border border-border/50 transition-colors text-left"
                  >
                    👉 {act}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {!isUser && (
          <div className="flex items-center gap-1 mt-1 ml-1 text-xs text-muted-foreground">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={onCopy}
              title="Copy response"
            >
              {isCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function ContextToggle({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40 text-xs sm:text-sm">
      <span className="font-medium">{label}</span>
      <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
        Connected
      </Badge>
    </div>
  )
}