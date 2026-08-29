"use client"

import { ReactNode } from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { UserProfileProvider } from "@/lib/user-profile-context"
import { ThemeProvider } from "@/components/theme-provider"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <UserProfileProvider>{children}</UserProfileProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}