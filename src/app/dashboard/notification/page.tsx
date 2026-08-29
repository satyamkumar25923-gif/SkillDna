import { redirect } from "next/navigation"

export default function NotificationRedirect() {
  redirect("/dashboard/notifications")
}
