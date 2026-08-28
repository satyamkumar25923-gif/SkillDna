"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  ThumbsUp,
  ThumbsDown,
  Plus,
  History,
  Send,
  AlertTriangle,
  Award,
  Calendar,
  User as UserIcon,
  Check,
  Trash2,
  Clock,
  GraduationCap
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"

const suggestedPrompts = [
  "What should I learn next for AI Engineer?",
  "Review my Skill DNA and suggest improvements",
  "Create a 4-week plan to close my ML gap",
  "How do I prepare for AI Engineer interviews?",
  "Suggest a portfolio project for my level",
  "Explain transformer architecture simply",
]

const studentContext = {
  targetCareer: "AI Engineer",
  skills: [
    { name: "Python", proficiency: 85 },
    { name: "Communication", proficiency: 89 },
    { name: "Machine Learning", proficiency: 43 },
    { name: "Deep Learning", proficiency: 35 },
    { name: "DSA", proficiency: 61 },
    { name: "Cloud & DevOps", proficiency: 35 },
  ],
  skillGaps: [
    { skill: "Machine Learning", gapType: "critical", priority: 1 },
    { skill: "Cloud & DevOps", gapType: "major", priority: 2 },
    { skill: "Data Structures & Algorithms", gapType: "moderate", priority: 3 },
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
  content: "Hey there! 🎓 I'm Alex, your 1-on-1 AI Tuition Teacher & Career Mentor. I have your full Skill DNA profile right in front of me.\n\nWhether you want to break down a tough ML concept with simple analogies, review your PyTorch roadmap, or practice interview questions—I'm right here with you. What would you like to explore today?",
}

const STORAGE_KEY = "skilldna_mentor_sessions_v1"
const ACTIVE_SESSION_KEY = "skilldna_mentor_active_id"
const PERSONA_STORAGE_KEY = "skilldna_mentor_persona"

export const PERSONAS = [
  { id: "Tuition Teacher", label: "Tuition Teacher", icon: "🎓", desc: "Warm, patient, intuitive explanations with analogies" },
  { id: "Industry Coach", label: "Industry Coach", icon: "💼", desc: "Direct, high-accountability, focused on landing the role" },
  { id: "Socratic Guide", label: "Socratic Guide", icon: "🧠", desc: "Helps you discover answers through guided questions" },
  { id: "Interview Prep", label: "Interview Specialist", icon: "🎯", desc: "Rigorous technical mock questions & grading" },
]

export default function AIPromptPage() {
  const [activeTab, setActiveTab] = useState("chat")
  const [mentorPersona, setMentorPersona] = useState<string>("Tuition Teacher")
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>("")
  const [messages, setMessages] = useState<MessageItem[]>([DEFAULT_WELCOME_MSG])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 1. Load chat sessions and persona from localStorage on mount
  useEffect(() => {
    try {
      const savedPersona = localStorage.getItem(PERSONA_STORAGE_KEY)
      if (savedPersona) setMentorPersona(savedPersona)

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

    // Default initial session if none found
    const newId = "session_" + Date.now()
    const initialSession: ChatSession = {
      id: newId,
      title: "New Career Conversation",
      timestamp: Date.now(),
      messages: [DEFAULT_WELCOME_MSG],
    }
    setSessions([initialSession])
    setCurrentSessionId(newId)
    setMessages([DEFAULT_WELCOME_MSG])
    setIsLoaded(true)
  }, [])

  // 2. Persist sessions to localStorage whenever messages or sessions change
  useEffect(() => {
    if (!isLoaded || !currentSessionId) return
    try {
      setSessions(prevSessions => {
        const updated = prevSessions.map(session => {
          if (session.id === currentSessionId) {
            // Compute a descriptive title from first user message
            const firstUserMsg = messages.find(m => m.role === "user")
            const title = firstUserMsg
              ? (firstUserMsg.content.length > 40 ? firstUserMsg.content.slice(0, 40) + "..." : firstUserMsg.content)
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

        // If session not found, append it
        if (!updated.some(s => s.id === currentSessionId)) {
          const firstUserMsg = messages.find(m => m.role === "user")
          const title = firstUserMsg
            ? (firstUserMsg.content.length > 40 ? firstUserMsg.content.slice(0, 40) + "..." : firstUserMsg.content)
            : "New Conversation"
          updated.unshift({
            id: currentSessionId,
            title,
            timestamp: Date.now(),
            messages,
          })
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        localStorage.setItem(ACTIVE_SESSION_KEY, currentSessionId)
        return updated
      })
    } catch (e) {
      console.error("Failed to save session to localStorage:", e)
    }
  }, [messages, currentSessionId, isLoaded])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const sendMessage = async (messageText: string) => {
    const textToSend = messageText.trim()
    if (!textToSend || isLoading) return

    const userMessage: MessageItem = { role: "user", content: textToSend }
    const updatedMessages = [...messages, userMessage]
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
          mentorPersona,
          history: updatedMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`)
      }

      const data = await res.json()
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: data.response || "I have analyzed your profile. How else can I guide you?",
          suggestedActions: data.suggestedActions || [],
        },
      ])
    } catch (err) {
      console.error("Failed to fetch mentor response:", err)
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "Based on your Skill DNA, your primary focus should be closing the **Machine Learning (43%)** and **Cloud (35%)** gaps to reach your 85%+ readiness target for AI Engineer.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault()
    sendMessage(input)
  }

  const handleSuggestedClick = (prompt: string) => {
    sendMessage(prompt)
  }

  const handleNewChat = () => {
    const newId = "session_" + Date.now()
    const newSession: ChatSession = {
      id: newId,
      title: "New Conversation",
      timestamp: Date.now(),
      messages: [DEFAULT_WELCOME_MSG],
    }

    setSessions(prev => {
      const updated = [newSession, ...prev]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      localStorage.setItem(ACTIVE_SESSION_KEY, newId)
      return updated
    })

    setCurrentSessionId(newId)
    setMessages([DEFAULT_WELCOME_MSG])
    setActiveTab("chat")
  }

  const handleSelectSession = (sessionId: string) => {
    const target = sessions.find(s => s.id === sessionId)
    if (target) {
      setCurrentSessionId(target.id)
      setMessages(target.messages)
      localStorage.setItem(ACTIVE_SESSION_KEY, target.id)
      setActiveTab("chat")
    }
  }

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const remaining = sessions.filter(s => s.id !== sessionId)
    setSessions(remaining)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining))

    if (currentSessionId === sessionId) {
      if (remaining.length > 0) {
        setCurrentSessionId(remaining[0].id)
        setMessages(remaining[0].messages)
        localStorage.setItem(ACTIVE_SESSION_KEY, remaining[0].id)
      } else {
        handleNewChat()
      }
    }
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const formatTimeAgo = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">AI Career Mentor</h1>
              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                SkillDNA AI Engine
              </Badge>
              <Badge variant="secondary" className="text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                Auto-saved
              </Badge>
            </div>
            <p className="text-muted-foreground">Your personalized career advisor with real-time access to your Skill DNA</p>
          </div>
          <Button variant="premium" onClick={handleNewChat}>
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="history">History ({sessions.length})</TabsTrigger>
            <TabsTrigger value="context">My Context</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 flex flex-col h-[650px]">
                <Card className="bg-card border-border/50 flex-1 flex flex-col overflow-hidden">
                  <CardHeader className="border-b border-border/50 py-3 px-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 text-lg">
                          🎓
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-semibold">Alex • 1-on-1 AI Tutor</CardTitle>
                            <span className="flex items-center gap-1 text-[11px] text-emerald-500 font-medium">
                              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                              Active
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">Tuition Teacher • Skill DNA Connected</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-muted/60 rounded-lg p-1 border border-border/50 overflow-x-auto">
                        {PERSONAS.map(p => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setMentorPersona(p.id)
                              try { localStorage.setItem(PERSONA_STORAGE_KEY, p.id) } catch (_) {}
                            }}
                            className={cn(
                              "px-2.5 py-1 text-xs rounded-md transition-all font-medium flex items-center gap-1.5 whitespace-nowrap",
                              mentorPersona === p.id 
                                ? "bg-primary text-primary-foreground shadow-xs" 
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                            title={p.desc}
                          >
                            <span>{p.icon}</span>
                            <span>{p.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, i) => (
                      <MessageBubble
                        key={i}
                        message={msg}
                        index={i}
                        isCopied={copiedIndex === i}
                        onCopy={() => copyToClipboard(msg.content, i)}
                        onActionClick={(action) => handleSuggestedClick(action)}
                      />
                    ))}
                    <div ref={messagesEndRef} />
                    {isLoading && (
                      <div className="flex items-start gap-3 animate-pulse">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="flex-1 max-w-2xl">
                          <div className="bg-muted/50 rounded-2xl p-4 border border-border/40">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <Sparkles className="h-4 w-4 animate-spin text-primary" />
                              SkillDNA AI is analyzing your Skill DNA...
                            </div>
                            <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t border-border/50 p-4 flex flex-col gap-3 bg-background/50">
                    <form onSubmit={handleSend} className="flex items-end gap-3 w-full">
                      <Textarea
                        placeholder="Ask about learning paths, interviews, projects, or career decisions..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSend()
                          }
                        }}
                        className="flex-1 min-h-[44px] max-h-32 resize-none"
                        rows={1}
                        disabled={isLoading}
                      />
                      <Button type="submit" variant="premium" size="icon" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                    <div className="flex flex-wrap gap-2 w-full">
                      {suggestedPrompts.slice(0, 4).map((prompt) => (
                        <Button
                          key={prompt}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestedClick(prompt)}
                          className="text-xs h-7"
                          disabled={isLoading}
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </CardFooter>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="bg-card border-border/50">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <Brain className="h-4 w-4 text-primary" />
                      Active Student DNA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-4 pt-0">
                    <ContextItem label="Target Role" value="AI Engineer" icon={<Target className="h-4 w-4" />} />
                    <ContextItem label="Industry Readiness" value="67%" icon={<TrendingUp className="h-4 w-4" />} />
                    <ContextItem label="Top Gap" value="Machine Learning (43%)" icon={<AlertTriangle className="h-4 w-4 text-amber-500" />} />
                    <ContextItem label="Strongest" value="Communication (89%)" icon={<Award className="h-4 w-4 text-emerald-500" />} />
                    <ContextItem label="Current Focus" value="Deep Learning & PyTorch" icon={<BookOpen className="h-4 w-4" />} />
                    <ContextItem label="Roadmap Week" value="Week 1 of 12" icon={<Calendar className="h-4 w-4" />} />
                  </CardContent>
                </Card>

                <Card className="bg-card border-border/50">
                  <CardHeader className="py-3 px-4">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Instant Prompts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-4 pt-0">
                    <QuickAction label="Generate 4-Week ML Plan" icon={<BookOpen className="h-4 w-4" />} onClick={() => handleSuggestedClick("Create a 4-week plan to close my ML gap")} />
                    <QuickAction label="AI Engineer Interview Prep" icon={<Briefcase className="h-4 w-4" />} onClick={() => handleSuggestedClick("How do I prepare for AI Engineer interviews?")} />
                    <QuickAction label="Suggest Portfolio Project" icon={<Code className="h-4 w-4" />} onClick={() => handleSuggestedClick("Suggest a portfolio project for my level")} />
                    <QuickAction label="Analyze All Skill Gaps" icon={<TrendingUp className="h-4 w-4" />} onClick={() => handleSuggestedClick("Review my Skill DNA and suggest improvements")} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card className="bg-card border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Saved Conversations
                </CardTitle>
                <Button variant="outline" size="sm" onClick={handleNewChat}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Start Fresh Chat
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {sessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No conversation history yet. Start a chat to auto-save.</p>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleSelectSession(session.id)}
                      className={cn(
                        "p-4 rounded-lg border transition-all cursor-pointer flex items-center justify-between group",
                        session.id === currentSessionId
                          ? "bg-primary/10 border-primary/40 shadow-sm"
                          : "bg-muted/30 border-border/40 hover:bg-muted/60"
                      )}
                    >
                      <div className="space-y-1 min-w-0 flex-1 pr-4">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm truncate">{session.title}</p>
                          {session.id === currentSessionId && (
                            <Badge variant="secondary" className="text-[10px] bg-primary/20 text-primary">Active</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(session.timestamp)} • {session.messages.length} messages
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={session.id === currentSessionId ? "premium" : "outline"}
                          size="sm"
                          className="text-xs"
                          onClick={() => handleSelectSession(session.id)}
                        >
                          {session.id === currentSessionId ? "Resume" : "Open"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-80 group-hover:opacity-100"
                          onClick={(e) => handleDeleteSession(session.id, e)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="context" className="space-y-6">
            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Teaching Persona & Style
                </CardTitle>
                <p className="text-sm text-muted-foreground">Select how you want your 1-on-1 AI Tutor to communicate with you</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {PERSONAS.map(p => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setMentorPersona(p.id)
                        try { localStorage.setItem(PERSONA_STORAGE_KEY, p.id) } catch (_) {}
                      }}
                      className={cn(
                        "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3",
                        mentorPersona === p.id 
                          ? "border-primary bg-primary/5 shadow-xs" 
                          : "border-border/60 hover:border-primary/40 bg-card"
                      )}
                    >
                      <span className="text-2xl p-2 rounded-lg bg-muted/60">{p.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-sm">{p.label}</h4>
                          {mentorPersona === p.id && <Badge variant="premium" className="text-[10px]">Active</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Skill DNA Context Injected
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm">Real-time parameters supplied to your tutor:</h4>
                  <ContextToggle label="Skill DNA Profile & Proficiency Scores" enabled />
                  <ContextToggle label="Critical & Major Gap Analysis" enabled />
                  <ContextToggle label="Active 12-Week Learning Roadmap" enabled />
                  <ContextToggle label="Project Portfolio & Tech Stacks" enabled />
                  <ContextToggle label="Target Career Benchmarks" enabled />
                </div>
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
  onActionClick
}: {
  message: MessageItem
  index: number
  isCopied: boolean
  onCopy: () => void
  onActionClick: (action: string) => void
}) {
  const isUser = message.role === "user"
  return (
    <div className={cn("flex gap-3", isUser && "justify-end")}>
      {!isUser && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 flex-shrink-0 text-sm">
          🎓
        </div>
      )}
      <div className={cn("flex-1 max-w-2xl", isUser && "text-right")}>
        <div className={cn("inline-block rounded-2xl p-4 text-left shadow-sm", isUser ? "bg-primary text-primary-foreground" : "bg-card/80 dark:bg-muted/40 border border-border/50")}>
          {isUser ? (
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
          {message.suggestedActions && message.suggestedActions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border/30 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground">Recommended Next Steps:</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {message.suggestedActions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => onActionClick(act)}
                    className="text-xs bg-background/80 hover:bg-background text-foreground px-2 py-1 rounded border border-border/50 transition-colors text-left"
                  >
                    👉 {act}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        {!isUser && (
          <div className="flex items-center gap-1 mt-1 ml-2 text-xs text-muted-foreground">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onCopy}>
              {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6"><ThumbsUp className="h-3 w-3" /></Button>
            <Button variant="ghost" size="icon" className="h-6 w-6"><ThumbsDown className="h-3 w-3" /></Button>
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted flex-shrink-0">
          <UserIcon className="h-4 w-4" />
        </div>
      )}
    </div>
  )
}

function ContextItem({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/40 border border-border/30">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-xs font-medium truncate">{value}</p>
      </div>
    </div>
  )
}

function ContextToggle({ label, enabled }: { label: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/30">
      <span className="text-sm font-medium">{label}</span>
      <input type="checkbox" defaultChecked={enabled} className="h-4 w-4 accent-primary" readOnly />
    </div>
  )
}

function QuickAction({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs h-8" onClick={onClick}>
      {icon}
      <span className="truncate">{label}</span>
    </Button>
  )
}