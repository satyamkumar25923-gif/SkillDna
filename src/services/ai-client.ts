export interface AIResponse<T> {
  data: T
  confidence: number
  reasoning: string
}

export interface AIClientConfig {
  apiKey: string
  apiUrl: string
  model: string
}

export interface ChatMessageInput {
  role: "system" | "user" | "assistant"
  content: string
}

export class AIEngineService {
  private config: AIClientConfig

  constructor() {
    this.config = {
      apiKey: process.env.AI_API_KEY || process.env.NEMOTRON_API_KEY || "",
      apiUrl: process.env.AI_API_URL || process.env.NEMOTRON_API_URL || "https://integrate.api.nvidia.com/v1",
      model: process.env.AI_MODEL || process.env.NEMOTRON_MODEL || "nvidia/nemotron-3-nano-30b-a3b",
    }
  }

  private cleanJsonString(content: string): string {
    let cleaned = content.trim()
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.slice(7)
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.slice(3)
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.slice(0, -3)
    }
    cleaned = cleaned.trim()

    const firstBrace = cleaned.indexOf("{")
    const firstBracket = cleaned.indexOf("[")
    let startIdx = -1
    if (firstBrace !== -1 && firstBracket !== -1) {
      startIdx = Math.min(firstBrace, firstBracket)
    } else if (firstBrace !== -1) {
      startIdx = firstBrace
    } else if (firstBracket !== -1) {
      startIdx = firstBracket
    }

    if (startIdx > 0) {
      cleaned = cleaned.slice(startIdx)
    }

    const lastBrace = cleaned.lastIndexOf("}")
    const lastBracket = cleaned.lastIndexOf("]")
    let endIdx = Math.max(lastBrace, lastBracket)
    if (endIdx !== -1 && endIdx < cleaned.length - 1) {
      cleaned = cleaned.slice(0, endIdx + 1)
    }

    return cleaned
  }

  private async makeRequest(
    messages: ChatMessageInput[],
    options: {
      temperature?: number
      maxTokens?: number
      responseFormat?: "json" | "text"
    } = {}
  ): Promise<string> {
    const apiKey = this.config.apiKey || process.env.AI_API_KEY || process.env.NEMOTRON_API_KEY
    if (!apiKey) {
      throw new Error("AI Engine API key is not configured")
    }

    const response = await fetch(`${this.config.apiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.config.model,
        messages: messages,
        temperature: options.temperature ?? 0.6,
        max_tokens: options.maxTokens ?? 2048,
        response_format: options.responseFormat === "json" ? { type: "json_object" } : undefined,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`AI Engine error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ""
  }

  async generateStructured<T>(
    prompt: string,
    options: {
      temperature?: number
      maxTokens?: number
    } = {}
  ): Promise<AIResponse<T>> {
    const jsonPrompt = `${prompt}

IMPORTANT: Respond with ONLY a valid JSON object. Do not include extra conversational text.`

    try {
      const content = await this.makeRequest(
        [
          {
            role: "system",
            content: "You are the SkillDNA AI intelligence engine. You MUST output raw, valid JSON only."
          },
          {
            role: "user",
            content: jsonPrompt
          }
        ],
        {
          ...options,
          responseFormat: "json",
        }
      )

      const cleaned = this.cleanJsonString(content)
      const parsed = JSON.parse(cleaned)

      return {
        data: parsed,
        confidence: 0.95,
        reasoning: "Generated via SkillDNA AI Engine with structured validation",
      }
    } catch (error) {
      console.error("AI Engine structured generation error:", error)
      if (error instanceof SyntaxError) {
        throw new Error("Failed to parse AI response as JSON")
      }
      throw error
    }
  }

  async generateChat(
    messages: ChatMessageInput[],
    options: {
      temperature?: number
      maxTokens?: number
    } = {}
  ): Promise<string> {
    return this.makeRequest(messages, {
      ...options,
      responseFormat: "text",
    })
  }

  async generateText(
    prompt: string,
    options: {
      temperature?: number
      maxTokens?: number
    } = {}
  ): Promise<string> {
    return this.makeRequest(
      [
        {
          role: "system",
          content: "You are the SkillDNA AI Career Mentor. Provide insightful, actionable, concise, and structured guidance."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      {
        ...options,
        responseFormat: "text",
      }
    )
  }

  isConfigured(): boolean {
    return !!(this.config.apiKey || process.env.AI_API_KEY || process.env.NEMOTRON_API_KEY)
  }
}

export const aiEngineService = new AIEngineService()
export const aiClient = aiEngineService
