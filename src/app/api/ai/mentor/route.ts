import { NextResponse } from "next/server"
import { aiEngineService, ChatMessageInput } from "@/services/ai-client"
import { mockAIService } from "@/services/mock-ai"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { question, userContext, history = [] } = body

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      )
    }

    const defaultContext = {
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

    const context = userContext || defaultContext

    // If AI Engine is configured, call live AI service
    if (aiEngineService.isConfigured()) {
      try {
        const systemPrompt = `You are the SkillDNA AI Career Mentor, an intelligent, empathetic, and sharp career advisor.
Student Profile Context:
- Target Career: ${context.targetCareer}
- Current Skills: ${context.skills.map((s: { name: string; proficiency: number }) => `${s.name} (${s.proficiency}%)`).join(", ")}
- Critical Gaps: ${context.skillGaps.map((g: { skill: string; gapType: string }) => `${g.skill} (${g.gapType})`).join(", ")}
- Active Roadmap: ${context.roadmap.map((r: { week: number; title: string; status: string }) => `Week ${r.week}: ${r.title} [${r.status}]`).join(", ")}
- Projects: ${context.projects.map((p: { name: string; techStack: string[] }) => `${p.name} (${p.techStack.join(", ")})`).join(", ")}

Response Guidelines:
1. GREETINGS & SMALL TALK: If the user says "Hi", "Hello", "Hey", "How are you?", or similar conversational openers, reply warmly and naturally as a friendly mentor (e.g., "Hello! Great to connect. How can I help you today? We can work on your learning roadmap, bridge your ML skill gap, or prep for interviews."). Do NOT dump unsolicited homework or task lists for a simple greeting.
2. TECHNICAL & CAREER QUESTIONS: When asked a specific question or seeking advice, give direct, structured, and actionable guidance in 2-4 clean bullet points with bold key terms. Be to-the-point and avoid fluff.
3. FORMATTING: Do NOT output decorative divider lines like "---". Keep typography clean, readable, and modern.`

        const messages: ChatMessageInput[] = [
          { role: "system", content: systemPrompt },
          ...history.slice(-6).map((msg: { role: string; content: string }) => ({
            role: (msg.role === "assistant" ? "assistant" : "user") as "assistant" | "user",
            content: msg.content,
          })),
          { role: "user", content: question },
        ]

        const responseText = await aiEngineService.generateChat(messages, {
          temperature: 0.5,
          maxTokens: 500,
        })

        // Generate suggested prompt follow-ups based on context
        const suggestedActions = [
          "What project can I build to close this gap?",
          "How can I prepare for technical interview questions on this topic?",
          "Update my weekly roadmap to prioritize this skill",
        ]

        return NextResponse.json({
          response: responseText,
          references: [
            { type: "career", value: context.targetCareer },
            { type: "gap", value: context.skillGaps[0]?.skill || "Machine Learning" },
          ],
          suggestedActions,
          source: "skilldna-ai-live",
        })
      } catch (aiError: unknown) {
        console.error("Live AI Engine call failed, falling back to mock engine:", aiError)
      }
    }

    // Fallback to intelligent mock service
    const mockResult = await mockAIService.generateMentorResponse(question, context)
    return NextResponse.json({
      ...mockResult.data,
      source: "mock-fallback",
    })
  } catch (error: unknown) {
    const err = error as Error
    console.error("Mentor API error:", err)
    return NextResponse.json(
      { error: err.message || "Failed to process mentor request" },
      { status: 500 }
    )
  }
}

