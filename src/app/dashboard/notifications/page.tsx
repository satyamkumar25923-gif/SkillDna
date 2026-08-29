"use client"

import React, { useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import {
  Bell,
  CheckCheck,
  Trash2,
  Brain,
  Bot,
  Target,
  Sparkles,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  Award,
  ArrowRight,
  Clock,
  Settings,
  Check,
  X
} from "lucide-react"

interface NotificationItem {
  id: string
  title: string
  description: string
  category: "mentor" | "gap" | "roadmap" | "job" | "achievement" | "system"
  timestamp: string
  read: boolean
  actionUrl?: string
  actionLabel?: string
  priority?: "high" | "normal" | "low"
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Critical Skill Gap Alert: Machine Learning",
    description: "Your ML score (43%) is currently below the 85% readiness target for AI Engineer. T800 has prepared a 4-week closure plan.",
    category: "gap",
    timestamp: "10 minutes ago",
    read: false,
    priority: "high",
    actionUrl: "/dashboard/mentor",
    actionLabel: "Chat with T800",
  },
  {
    id: "notif-2",
    title: "New Job Match: Senior AI Engineer @ Stripe",
    description: "Your profile matches 78% of the core competencies for an open remote AI Engineer role.",
    category: "job",
    timestamp: "2 hours ago",
    read: false,
    priority: "normal",
    actionUrl: "/dashboard/job-analyzer",
    actionLabel: "Analyze Job Match",
  },
  {
    id: "notif-3",
    title: "Roadmap Reminder: Week 1 PyTorch Foundations",
    description: "You have 2 pending exercises on PyTorch tensors and autograd to complete Week 1.",
    category: "roadmap",
    timestamp: "5 hours ago",
    read: false,
    priority: "normal",
    actionUrl: "/dashboard/roadmap",
    actionLabel: "View Roadmap",
  },
  {
    id: "notif-4",
    title: "Achievement Unlocked: Python Maestro",
    description: "Congratulations! Your verified Python proficiency reached 85%, placing you in the top 15% of candidates.",
    category: "achievement",
    timestamp: "1 day ago",
    read: true,
    actionUrl: "/dashboard/profile",
    actionLabel: "View Profile",
  },
  {
    id: "notif-5",
    title: "AI Mentor Session Saved",
    description: "Your recent conversation on Gradient Descent and Backprop has been archived and indexed in your memory context.",
    category: "mentor",
    timestamp: "2 days ago",
    read: true,
    actionUrl: "/dashboard/mentor",
    actionLabel: "Resume Session",
  },
  {
    id: "notif-6",
    title: "System Update: SkillDNA Intelligence Engine v2.4",
    description: "Enhanced real-time benchmark matching and faster AI response generation are now active.",
    category: "system",
    timestamp: "3 days ago",
    read: true,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const [filter, setFilter] = useState<string>("all")

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.read
    if (filter === "mentor") return n.category === "mentor"
    if (filter === "gap") return n.category === "gap"
    if (filter === "roadmap") return n.category === "roadmap"
    if (filter === "job") return n.category === "job"
    return true
  })

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto overflow-x-hidden">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Notifications Center</h1>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs px-2 py-0.5">
                  {unreadCount} Unread
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Stay updated on skill gap alerts, mentor responses, and roadmap milestones
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead} className="text-xs h-9">
                <CheckCheck className="mr-1.5 h-4 w-4" />
                Mark all as read
              </Button>
            )}
            <Link href="/dashboard/settings">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" title="Notification Preferences">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs & Filters */}
        <Tabs value={filter} onValueChange={setFilter} className="space-y-4">
          <div className="flex items-center justify-between border-b border-border/50 pb-2 overflow-x-auto no-scrollbar">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="all" className="text-xs sm:text-sm">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs sm:text-sm">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="gap" className="text-xs sm:text-sm">
                Gaps & Alerts
              </TabsTrigger>
              <TabsTrigger value="mentor" className="text-xs sm:text-sm">
                T800 Mentor
              </TabsTrigger>
              <TabsTrigger value="job" className="text-xs sm:text-sm">
                Job Matches
              </TabsTrigger>
            </TabsList>

            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-destructive hidden sm:flex"
              >
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Clear all
              </Button>
            )}
          </div>

          <TabsContent value={filter} className="space-y-3 mt-0">
            {filteredNotifications.length === 0 ? (
              <Card className="bg-card border-border/50 py-12 text-center">
                <CardContent className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground mx-auto">
                    <Bell className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-semibold">No notifications found</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                    You're all caught up! When you receive skill alerts, mentor suggestions, or job matches, they'll appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notif) => (
                <NotificationCard
                  key={notif.id}
                  notification={notif}
                  onMarkAsRead={() => markAsRead(notif.id)}
                  onDelete={() => deleteNotification(notif.id)}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: NotificationItem
  onMarkAsRead: () => void
  onDelete: () => void
}) {
  const getCategoryConfig = (category: string) => {
    switch (category) {
      case "gap":
        return {
          icon: AlertTriangle,
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
          badge: "Skill Gap Alert",
        }
      case "mentor":
        return {
          icon: Bot,
          color: "text-primary bg-primary/10 border-primary/20",
          badge: "T800 Mentor",
        }
      case "job":
        return {
          icon: Briefcase,
          color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
          badge: "Job Match",
        }
      case "roadmap":
        return {
          icon: Target,
          color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
          badge: "Roadmap Task",
        }
      case "achievement":
        return {
          icon: Award,
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
          badge: "Milestone",
        }
      default:
        return {
          icon: Sparkles,
          color: "text-muted-foreground bg-muted/60 border-border/40",
          badge: "System",
        }
    }
  }

  const config = getCategoryConfig(notification.category)
  const Icon = config.icon

  return (
    <Card
      className={cn(
        "bg-card transition-all duration-200 hover:border-primary/40",
        !notification.read
          ? "border-primary/30 bg-primary/[0.02] shadow-xs"
          : "border-border/50 opacity-85"
      )}
    >
      <CardContent className="p-3.5 sm:p-4">
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Icon */}
          <div className={cn("flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border flex-shrink-0", config.color)}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                  {config.badge}
                </Badge>
                {!notification.read && (
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
                {notification.priority === "high" && (
                  <Badge variant="destructive" className="text-[10px] px-1.5 py-0.2">
                    High Priority
                  </Badge>
                )}
              </div>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {notification.timestamp}
              </span>
            </div>

            <h4 className={cn("text-xs sm:text-sm font-semibold mt-1.5", !notification.read ? "text-foreground" : "text-muted-foreground")}>
              {notification.title}
            </h4>

            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              {notification.description}
            </p>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2.5 border-t border-border/30">
              {notification.actionUrl && notification.actionLabel ? (
                <Link href={notification.actionUrl}>
                  <Button variant="premium" size="sm" className="h-7 text-xs px-3">
                    <span>{notification.actionLabel}</span>
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </Link>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-1">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onMarkAsRead}
                    className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
                  >
                    <Check className="mr-1 h-3.5 w-3.5" />
                    Mark Read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onDelete}
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
