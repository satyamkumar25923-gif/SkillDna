"use client"

import React, { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  Bell,
  Bot,
  CheckCircle2,
  Brain,
  Target,
  Sparkles,
  Briefcase,
  AlertTriangle,
  Clock,
  Trash2,
  Check,
  ArrowRight,
  Settings,
  Filter,
  CheckCheck
} from "lucide-react"

interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  category: "mentor" | "gap" | "roadmap" | "job" | "system"
  unread: boolean
  actionUrl?: string
  actionLabel?: string
  priority?: "high" | "medium" | "low"
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    title: "AI Mentor T800 Checked In",
    description: "T800 reviewed your latest progress and recommended a 15-minute PyTorch tensor exercise to close your Week 1 milestone.",
    time: "10 minutes ago",
    category: "mentor",
    unread: true,
    actionUrl: "/dashboard/mentor",
    actionLabel: "Chat with T800",
    priority: "high",
  },
  {
    id: "notif_2",
    title: "Critical Skill Gap Alert: Machine Learning (43%)",
    description: "Your readiness score for AI Engineer requires at least 70% in Machine Learning. 2 targeted projects are available to accelerate your progress.",
    time: "2 hours ago",
    category: "gap",
    unread: true,
    actionUrl: "/dashboard/skill-gaps",
    actionLabel: "Analyze Gap",
    priority: "high",
  },
  {
    id: "notif_3",
    title: "New AI Engineer Job Match (88% Match)",
    description: "A new Junior AI Engineer position matching your Python (85%) and SQL proficiency was analyzed in your sector.",
    time: "5 hours ago",
    category: "job",
    unread: true,
    actionUrl: "/dashboard/job-analyzer",
    actionLabel: "View Match",
    priority: "medium",
  },
  {
    id: "notif_4",
    title: "Roadmap Week 1 Milestone Ready",
    description: "You completed 2 of 3 modules for 'Deep Learning Foundations'. Submit your mini-project to unlock Week 2 CNNs.",
    time: "1 day ago",
    category: "roadmap",
    unread: false,
    actionUrl: "/dashboard/roadmap",
    actionLabel: "Open Roadmap",
    priority: "medium",
  },
  {
    id: "notif_5",
    title: "Skill DNA Recalculated",
    description: "Your communication and Python verification scores have been synced with latest benchmark standards.",
    time: "2 days ago",
    category: "system",
    unread: false,
    actionUrl: "/dashboard/skill-dna",
    actionLabel: "View Skill DNA",
    priority: "low",
  },
  {
    id: "notif_6",
    title: "Weekly Learning Digest Available",
    description: "You logged 14.5 hours of active learning this week, improving your readiness score by +4%.",
    time: "3 days ago",
    category: "system",
    unread: false,
    actionUrl: "/dashboard/progress",
    actionLabel: "View Progress",
    priority: "low",
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const [activeTab, setActiveTab] = useState<string>("all")

  const unreadCount = notifications.filter(n => n.unread).length

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const handleToggleRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, unread: !n.unread } : n))
    )
  }

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return n.unread
    if (activeTab === "mentor") return n.category === "mentor"
    if (activeTab === "roadmap") return n.category === "roadmap" || n.category === "gap"
    if (activeTab === "jobs") return n.category === "job"
    return true
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "mentor":
        return <Bot className="h-4 w-4 text-blue-400" />
      case "gap":
        return <AlertTriangle className="h-4 w-4 text-amber-400" />
      case "roadmap":
        return <Target className="h-4 w-4 text-purple-400" />
      case "job":
        return <Briefcase className="h-4 w-4 text-emerald-400" />
      default:
        return <Sparkles className="h-4 w-4 text-primary" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
              {unreadCount > 0 && (
                <Badge variant="premium" className="text-xs px-2.5">
                  {unreadCount} New
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Stay updated with your Skill DNA milestones, AI Mentor recommendations, and gap alerts
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                className="h-9 text-xs gap-1.5"
              >
                <CheckCheck className="h-4 w-4 text-primary" />
                Mark all as read
              </Button>
            )}
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="icon" className="h-9 w-9" title="Notification Preferences">
                <Settings className="h-4 w-4 text-muted-foreground" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters and List Card */}
        <Card className="bg-card border-border/60 shadow-xs">
          <CardHeader className="border-b border-border/50 pb-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <TabsList className="grid grid-cols-5 h-9 bg-muted/60 max-w-md w-full">
                  <TabsTrigger value="all" className="text-xs">
                    All ({notifications.length})
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="text-xs">
                    Unread ({unreadCount})
                  </TabsTrigger>
                  <TabsTrigger value="mentor" className="text-xs">
                    Mentor
                  </TabsTrigger>
                  <TabsTrigger value="roadmap" className="text-xs">
                    Roadmap
                  </TabsTrigger>
                  <TabsTrigger value="jobs" className="text-xs">
                    Jobs
                  </TabsTrigger>
                </TabsList>

                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-xs text-muted-foreground hover:text-destructive h-8 self-end sm:self-auto"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>
            </Tabs>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-border/40">
            {filteredNotifications.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground mx-auto">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold">No notifications found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  You're all caught up! When T800 has new recommendations or when your roadmap updates, alerts will appear here.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4 group",
                    notif.unread
                      ? "bg-primary/5 hover:bg-primary/8"
                      : "hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted border border-border/60 flex-shrink-0 mt-0.5">
                      {getCategoryIcon(notif.category)}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={cn("text-sm", notif.unread ? "font-semibold text-foreground" : "font-medium text-foreground/90")}>
                          {notif.title}
                        </h4>
                        {notif.unread && (
                          <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                        )}
                        {notif.priority === "high" && (
                          <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-400 border-red-500/20 py-0">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {notif.description}
                      </p>
                      <div className="flex items-center gap-3 pt-1 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {notif.time}
                        </span>
                        <span className="capitalize text-foreground/70">• {notif.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center gap-2 sm:self-center flex-shrink-0 pt-2 sm:pt-0 border-t border-border/30 sm:border-0 justify-between sm:justify-end">
                    {notif.actionUrl && notif.actionLabel && (
                      <Link href={notif.actionUrl}>
                        <Button variant="outline" size="sm" className="h-8 text-xs gap-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30">
                          <span>{notif.actionLabel}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    )}

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => handleToggleRead(notif.id)}
                        title={notif.unread ? "Mark as read" : "Mark as unread"}
                      >
                        <Check className={cn("h-4 w-4", notif.unread ? "text-muted-foreground" : "text-emerald-400")} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(notif.id)}
                        title="Delete notification"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
