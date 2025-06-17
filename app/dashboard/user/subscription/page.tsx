"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Calendar, CreditCard, Clock, CheckCircle, AlertTriangle, Zap, Heart } from "lucide-react"

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
  profile?: {
    age?: number
    height?: number
    weight?: number
    fitnessGoal?: string
    phone?: string
  }
}

export default function UserSubscriptionPage() {
  const [user, setUser] = useState<User | null>(null)
  const [daysLeft, setDaysLeft] = useState(0)
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

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

    // Calculate progress
    const startDate = new Date(parsedUser.subscription.startDate)
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
    const usedDays = totalDays - daysRemaining
    const progressPercent = Math.max(0, Math.min(100, (usedDays / totalDays) * 100))
    setProgress(progressPercent)
  }, [router])

  const handleRazorpayPayment = (amount: number, description: string) => {
    // Dummy Razorpay integration
    toast({
      title: "Opening Payment Gateway...",
      description: "This is a demo payment integration.",
    })

    // Simulate payment success after 2 seconds
    setTimeout(() => {
      toast({
        title: "Payment Successful!",
        description: `Payment ID: pay_dummy_${Date.now()}`,
      })

      // Update subscription end date (dummy logic)
      const newEndDate = new Date()
      newEndDate.setMonth(newEndDate.getMonth() + 1)

      const updatedUser = {
        ...user,
        subscription: {
          ...user!.subscription,
          endDate: newEndDate.toISOString().split("T")[0],
        },
      }

      localStorage.setItem("user", JSON.stringify(updatedUser))
      setUser(updatedUser)
    }, 2000)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const isExpiringSoon = daysLeft <= 3 && daysLeft > 0
  const isExpired = daysLeft <= 0
  const isActive = daysLeft > 3

  const planFeatures = {
    "Strength Training": [
      "Access to weight training area",
      "Free weights and machines",
      "Basic fitness assessment",
      "Locker room access",
      "Mobile app access",
    ],
    "Strength + Cardio": [
      "Everything in Strength Training",
      "Cardio equipment access",
      "Group fitness classes",
      "Personal trainer consultation",
      "Nutrition guidance",
      "Progress tracking",
    ],
  }

  const currentFeatures = planFeatures[user.subscription.category as keyof typeof planFeatures] || []

  return (
    <DashboardLayout userRole="user">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">My Subscription</h1>
          <p className="text-muted-foreground">Manage your membership and track your fitness journey</p>
        </div>

        {/* Status Alert */}
        {(isExpiringSoon || isExpired) && (
          <Card className={`border-${isExpired ? "red" : "yellow"}-500/50 bg-${isExpired ? "red" : "yellow"}-500/5`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className={`h-5 w-5 text-${isExpired ? "red" : "yellow"}-400`} />
                <div>
                  <p className={`font-semibold text-${isExpired ? "red" : "yellow"}-400`}>
                    {isExpired ? "Subscription Expired" : "Subscription Expiring Soon"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isExpired
                      ? "Your subscription has expired. Renew now to continue accessing the gym."
                      : `Your subscription expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}. Consider renewing soon.`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subscription Overview */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.subscription.category}</div>
              <p className="text-xs text-muted-foreground">₹{user.subscription.price}/month</p>
              <Badge
                variant="secondary"
                className={`mt-2 ${
                  isActive
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : isExpiringSoon
                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {isActive ? "Active" : isExpiringSoon ? "Expiring Soon" : "Expired"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Remaining</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.max(0, daysLeft)}</div>
              <p className="text-xs text-muted-foreground">
                Until {new Date(user.subscription.endDate).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usage Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(progress)}%</div>
              <Progress value={progress} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Subscription period used</p>
            </CardContent>
          </Card>
        </div>

        {/* Payment Section */}
        <Card>
          <CardHeader>
            <CardTitle>Payment & Billing</CardTitle>
            <CardDescription>Manage your subscription payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
              <h3 className="font-semibold mb-2">Current Payment Method</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-400 rounded text-white text-xs flex items-center justify-center font-bold">
                  VISA
                </div>
                <span className="text-sm">**** **** **** 4242</span>
                <Badge variant="secondary">Primary</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Quick Actions</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <Button
                  onClick={() => handleRazorpayPayment(user.subscription.price, "Monthly Subscription")}
                  className="gradient-electric text-white"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Now - ₹{user.subscription.price}
                </Button>
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Setup Auto-Pay
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Payment History</h3>
              <div className="space-y-2">
                {[
                  { date: "2024-05-01", amount: user.subscription.price, status: "Paid" },
                  { date: "2024-04-01", amount: user.subscription.price, status: "Paid" },
                  { date: "2024-03-01", amount: user.subscription.price, status: "Paid" },
                ].map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div>
                      <p className="font-medium">{new Date(payment.date).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">Monthly Subscription</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{payment.amount}</p>
                      <Badge variant="default" className="bg-green-500/10 text-green-400 border-green-500/20">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Details */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
            <CardDescription>Your current membership information and billing details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Plan Type</label>
                  <p className="text-lg font-semibold">{user.subscription.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Monthly Fee</label>
                  <p className="text-lg font-semibold">₹{user.subscription.price}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Start Date</label>
                  <p className="text-lg font-semibold">{new Date(user.subscription.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">End Date</label>
                  <p className="text-lg font-semibold">{new Date(user.subscription.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">Plan Features</h3>
              <div className="grid gap-2 md:grid-cols-2">
                {currentFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>Compare our membership options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div
                className={`p-4 rounded-lg border ${
                  user.subscription.category === "Strength Training"
                    ? "border-blue-500/50 bg-blue-500/5"
                    : "border-border/50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Strength Training</h3>
                  {user.subscription.category === "Strength Training" && (
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Current</Badge>
                  )}
                </div>
                <p className="text-2xl font-bold mb-2">
                  ₹800<span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
                <ul className="space-y-1 text-sm">
                  {planFeatures["Strength Training"].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`p-4 rounded-lg border ${
                  user.subscription.category === "Strength + Cardio"
                    ? "border-blue-500/50 bg-blue-500/5"
                    : "border-border/50"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Strength + Cardio</h3>
                  {user.subscription.category === "Strength + Cardio" && (
                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Current</Badge>
                  )}
                </div>
                <p className="text-2xl font-bold mb-2">
                  ₹1000<span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
                <ul className="space-y-1 text-sm">
                  {planFeatures["Strength + Cardio"].map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            className="gradient-electric text-white"
            onClick={() => handleRazorpayPayment(user.subscription.price, "Subscription Renewal")}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Renew Subscription
          </Button>
          <Button variant="outline">
            <Zap className="mr-2 h-4 w-4" />
            Upgrade Plan
          </Button>
          <Button variant="outline">
            <Heart className="mr-2 h-4 w-4" />
            Pause Membership
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
