"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) return null

  const blocks = parseMarkdownBlocks(content)

  return (
    <div className={cn("space-y-2.5 text-sm leading-relaxed", className)}>
      {blocks.map((block, index) => (
        <React.Fragment key={index}>{renderBlock(block)}</React.Fragment>
      ))}
    </div>
  )
}

type BlockType =
  | { type: "h1" | "h2" | "h3" | "h4"; text: string }
  | { type: "code"; language?: string; code: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "hr" }
  | { type: "paragraph"; text: string }

function parseMarkdownBlocks(markdown: string): BlockType[] {
  const lines = markdown.split("\n")
  const blocks: BlockType[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // 1. Horizontal Rule (---, ***, ___ or --- with spaces)
    if (/^\s*([-*_]\s*){3,}\s*$/.test(line)) {
      blocks.push({ type: "hr" })
      i++
      continue
    }

    // 2. Code block ```
    if (line.trim().startsWith("```")) {
      const language = line.trim().slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i])
        i++
      }
      i++ // Skip closing ```
      blocks.push({
        type: "code",
        language,
        code: codeLines.join("\n"),
      })
      continue
    }

    // 3. Headers
    if (line.startsWith("#### ")) {
      blocks.push({ type: "h4", text: line.slice(5) })
      i++
      continue
    }
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4) })
      i++
      continue
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3) })
      i++
      continue
    }
    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: line.slice(2) })
      i++
      continue
    }

    // 4. Blockquote
    if (line.startsWith("> ")) {
      const quoteLines = [line.slice(2)]
      i++
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2))
        i++
      }
      blocks.push({ type: "blockquote", text: quoteLines.join(" ") })
      continue
    }

    // 5. Markdown Table (| header | header |)
    if (line.trim().startsWith("|") && line.trim().endsWith("|") && i + 1 < lines.length && lines[i + 1].includes("---")) {
      const headers = line
        .split("|")
        .slice(1, -1)
        .map(h => h.trim())
      i += 2 // skip header and delimiter (|---|---|)
      const rows: string[][] = []
      while (i < lines.length && lines[i].trim().startsWith("|") && lines[i].trim().endsWith("|")) {
        const row = lines[i]
          .split("|")
          .slice(1, -1)
          .map(c => c.trim())
        rows.push(row)
        i++
      }
      blocks.push({ type: "table", headers, rows })
      continue
    }

    // 6. Unordered list (- or * or •)
    if (/^(\s*[-*•]\s+)/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^(\s*[-*•]\s+)/.test(lines[i])) {
        items.push(lines[i].replace(/^(\s*[-*•]\s+)/, ""))
        i++
      }
      blocks.push({ type: "ul", items })
      continue
    }

    // 7. Ordered list (1. 2. 3.)
    if (/^(\s*\d+\.\s+)/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^(\s*\d+\.\s+)/.test(lines[i])) {
        items.push(lines[i].replace(/^(\s*\d+\.\s+)/, ""))
        i++
      }
      blocks.push({ type: "ol", items })
      continue
    }

    // 8. Empty line
    if (!line.trim()) {
      i++
      continue
    }

    // 9. Regular paragraph
    const paraLines = [line]
    i++
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith("```") &&
      !lines[i].startsWith(">") &&
      !lines[i].trim().startsWith("|") &&
      !/^\s*([-*_]\s*){3,}\s*$/.test(lines[i]) &&
      !/^(\s*[-*•]\s+)/.test(lines[i]) &&
      !/^(\s*\d+\.\s+)/.test(lines[i])
    ) {
      paraLines.push(lines[i])
      i++
    }
    blocks.push({ type: "paragraph", text: paraLines.join(" ") })
  }

  return blocks
}

function renderBlock(block: BlockType) {
  switch (block.type) {
    case "hr":
      return <hr className="my-2 border-border/40" />
    case "h1":
      return <h1 className="text-base font-bold text-foreground mt-2 mb-1">{renderInline(block.text)}</h1>
    case "h2":
      return <h2 className="text-sm font-bold text-foreground mt-2 mb-1 border-b border-border/40 pb-0.5">{renderInline(block.text)}</h2>
    case "h3":
      return <h3 className="text-sm font-semibold text-foreground mt-1.5 mb-0.5">{renderInline(block.text)}</h3>
    case "h4":
      return <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">{renderInline(block.text)}</h4>
    case "blockquote":
      return (
        <blockquote className="border-l-2 border-primary/60 pl-3 py-1 italic text-muted-foreground bg-muted/20 rounded-r text-xs my-1.5">
          {renderInline(block.text)}
        </blockquote>
      )
    case "code":
      return (
        <div className="my-2 rounded-lg bg-black/80 dark:bg-black/90 p-3 font-mono text-xs text-emerald-400 overflow-x-auto border border-border/30">
          <pre>{block.code}</pre>
        </div>
      )
    case "ul":
      return (
        <ul className="space-y-1 my-1.5 pl-4 list-disc marker:text-primary">
          {block.items.map((item, idx) => (
            <li key={idx} className="text-sm leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      )
    case "ol":
      return (
        <ol className="space-y-1 my-1.5 pl-4 list-decimal marker:text-primary font-medium">
          {block.items.map((item, idx) => (
            <li key={idx} className="text-sm leading-relaxed font-normal">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      )
    case "table":
      return (
        <div className="my-2 overflow-x-auto rounded-lg border border-border/50 bg-background/50">
          <table className="w-full text-xs text-left">
            <thead className="bg-muted/60 text-muted-foreground font-semibold border-b border-border/50">
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} className="px-3 py-1.5">{renderInline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {block.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-muted/30">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3 py-1.5">{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case "paragraph":
    default:
      return <p className="text-sm leading-relaxed">{renderInline(block.text)}</p>
  }
}

/**
 * Parses inline markdown:
 * - **bold** or __bold__
 * - *italic* or _italic_
 * - `inline code`
 * - [link](url)
 */
function renderInline(text: string): React.ReactNode {
  if (!text) return null

  const regex = /(\*\*.*?\*\*|__.*?__|\*.*?\*|_.*?_|`.*?`|\[.*?\]\(.*?\))/g
  const parts = text.split(regex)

  return parts.map((part, index) => {
    if (!part) return null

    // Bold **text** or __text__
    if ((part.startsWith("**") && part.endsWith("**")) || (part.startsWith("__") && part.endsWith("__"))) {
      const inner = part.slice(2, -2)
      return (
        <strong key={index} className="font-semibold text-foreground">
          {renderInline(inner)}
        </strong>
      )
    }

    // Italic *text* or _text_
    if ((part.startsWith("*") && part.endsWith("*")) || (part.startsWith("_") && part.endsWith("_"))) {
      const inner = part.slice(1, -1)
      return (
        <em key={index} className="italic">
          {renderInline(inner)}
        </em>
      )
    }

    // Inline `code`
    if (part.startsWith("`") && part.endsWith("`")) {
      const code = part.slice(1, -1)
      return (
        <code key={index} className="px-1.5 py-0.5 mx-0.5 rounded bg-muted font-mono text-[12px] text-primary border border-border/40">
          {code}
        </code>
      )
    }

    // Link [text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/)
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:opacity-80 font-medium"
        >
          {linkMatch[1]}
        </a>
      )
    }

    return part
  })
}
