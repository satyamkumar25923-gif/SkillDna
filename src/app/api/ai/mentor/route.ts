import { NextResponse } from "next/server"
import { aiEngineService, ChatMessageInput } from "@/services/ai-client"
import { mockAIService } from "@/services/mock-ai"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { question, userContext, history = [], mentorPersona = "Tuition Teacher" } = body

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
        const systemPrompt = `You are T800, a dedicated 1-on-1 Tuition Teacher and Personal Career Mentor for this student.
You know this student's exact strengths, weaknesses, and target career (${context.targetCareer}).

Student Profile & DNA Context:
- Target Career: ${context.targetCareer}
- Current Skills: ${context.skills.map((s: { name: string; proficiency: number }) => `${s.name} (${s.proficiency}%)`).join(", ")}
- Critical Skill Gaps: ${context.skillGaps.map((g: { skill: string; gapType: string }) => `${g.skill} (${g.gapType})`).join(", ")}
- Active Roadmap: ${context.roadmap.map((r: { week: number; title: string; status: string }) => `Week ${r.week}: ${r.title} [${r.status}]`).join(", ")}
- Projects: ${context.projects.map((p: { name: string; techStack: string[] }) => `${p.name} (${p.techStack.join(", ")})`).join(", ")}
- Active Teaching Persona: ${mentorPersona}

Core Tuition Teacher Behavioral Rules:
1. HUMAN & WARM: Speak naturally like a supportive, experienced private tutor sitting beside the student. Use an encouraging, conversational tone without sounding robotic or bureaucratic.
2. GREETINGS & CASUAL CHAT: When the student says "Hi", "Hello", "Hey", "How are you?", or opens casually, reply warmly and naturally as a friendly tutor (e.g., "Hey! Great to see you. Ready to make some progress today? We can dive into your ML gap, check in on your PyTorch roadmap, or work through a concept together. What's on your mind?"). Never dump unsolicited assignments on a simple greeting.
3. INTUITIVE TEACHING WITH ANALOGIES: When explaining complex technical ideas, use relatable real-world analogies to make the intuition click before introducing code or math.
4. SCAFFOLD ON EXISTING STRENGTHS: Mention what they are already good at (e.g. "Since your Python is solid at 85%, learning PyTorch tensors will feel very natural").
5. STEP-BY-STEP & ACTIONABLE: When answering technical questions or planning tasks, give 2-4 clean, bite-sized bullet points with bold keywords. Do not overwhelm them with 10 things at once.
6. CHECK FOR UNDERSTANDING: Conclude with a brief, friendly check-in question (e.g., "Does that analogy make sense?", "Want to try writing a quick 5-line example together?").
7. NO ROBOTIC CLUTTER: Do NOT use decorative separator lines like "---". Keep the formatting clean, modern, and readable.`

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

