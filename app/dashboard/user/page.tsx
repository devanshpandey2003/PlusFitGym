"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, CreditCard, Bell, Dumbbell, Heart, Target } from "lucide-react"

interface User {
  email: string
  name: string
  role: string
  subscription: {
    category: string
    price: number
    startDate: string
    endDate: string
  }
}

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [daysLeft, setDaysLeft] = useState(0)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "user") {
      router.push("/auth/login")
      return
    }

    setUser(parsedUser)

    // Calculate days left
    const endDate = new Date(parsedUser.subscription.endDate)
    const today = new Date()
    const timeDiff = endDate.getTime() - today.getTime()
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24))
    setDaysLeft(daysRemaining)

    // Calculate progress (assuming 365 days total)
    const startDate = new Date(parsedUser.subscription.startDate)
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
    const usedDays = totalDays - daysRemaining
    const progressPercent = Math.max(0, Math.min(100, (usedDays / totalDays) * 100))
    setProgress(progressPercent)
  }, [router])

  if (!user) {
    return <div>Loading...</div>
  }

  const isExpiringSoon = daysLeft <= 3 && daysLeft > 0
  const isExpired = daysLeft <= 0

  return (
    <DashboardLayout userRole="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Track your fitness journey and manage your subscription</p>
        </div>

        {/* Notifications */}
        {(isExpiringSoon || isExpired) && (
          <Card className="border-red-500/50 bg-red-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-red-400" />
                <div>
                  <p className="font-semibold text-red-400">
                    {isExpired ? "Subscription Expired" : "Subscription Expiring Soon"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isExpired
                      ? "Your subscription has expired. Please renew to continue accessing the gym."
                      : `Your subscription expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}. Consider renewing soon.`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.subscription.category}</div>
              <p className="text-xs text-muted-foreground">₹{user.subscription.price}/month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Remaining</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daysLeft}</div>
              <p className="text-xs text-muted-foreground">
                Until {new Date(user.subscription.endDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(progress)}%</div>
              <Progress value={progress} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Subscription Details */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
            <CardDescription>Your current membership information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Plan Type</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {user.subscription.category}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Monthly Fee</Label>
                <p className="text-lg font-semibold">₹{user.subscription.price}</p>
              </div>
              <div className="space-y-2">
                <Label>Start Date</Label>
                <p>{new Date(user.subscription.startDate).toLocaleDateString()}</p>
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <p>{new Date(user.subscription.endDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your fitness journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Dumbbell className="h-6 w-6" />
                <span>Book Session</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Heart className="h-6 w-6" />
                <span>Health Tracker</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Target className="h-6 w-6" />
                <span>Set Goals</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-muted-foreground">{children}</label>
}
