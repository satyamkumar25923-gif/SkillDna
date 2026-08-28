import { NextResponse } from "next/server"
import { aiService } from "@/services/ai"
import { mockAIService } from "@/services/mock-ai"
import { aiEngineService } from "@/services/ai-client"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { jobDescription, userSkills = [] } = body

    if (!jobDescription || typeof jobDescription !== "string") {
      return NextResponse.json(
        { error: "Job description text is required" },
        { status: 400 }
      )
    }

    const defaultSkills = [
      { name: "Python", proficiency: 85 },
      { name: "Machine Learning", proficiency: 45 },
      { name: "Deep Learning", proficiency: 35 },
      { name: "PyTorch", proficiency: 40 },
      { name: "MLOps", proficiency: 35 },
      { name: "SQL & Databases", proficiency: 80 },
      { name: "Software Engineering", proficiency: 82 },
      { name: "Docker/Kubernetes", proficiency: 35 },
    ]

    const skillsToAnalyze = userSkills.length > 0 ? userSkills : defaultSkills

    if (aiEngineService.isConfigured()) {
      try {
        const result = await aiService.analyzeJobDescription(jobDescription, skillsToAnalyze)
        return NextResponse.json({
          ...result.data,
          source: "skilldna-ai-live",
        })
      } catch (aiError) {
        console.error("Live AI job analysis failed, using fallback:", aiError)
      }
    }

    const mockResult = await mockAIService.analyzeJobDescription(jobDescription, skillsToAnalyze)
    return NextResponse.json({
      ...mockResult.data,
      source: "mock-fallback",
    })
  } catch (error: unknown) {
    const err = error as Error
    console.error("Job analyzer API error:", err)
    return NextResponse.json(
      { error: err.message || "Failed to analyze job description" },
      { status: 500 }
    )
  }
}

