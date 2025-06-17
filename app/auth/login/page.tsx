"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Dumbbell, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Predefined login logic
    if (email === "admin@pulsefit.com" && password === "admin123") {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email,
          role: "admin",
          name: "Admin User",
        }),
      )
      toast({
        title: "Welcome back, Admin!",
        description: "Redirecting to admin dashboard...",
      })
      router.push("/dashboard/admin")
    } else if (email === "user@pulsefit.com" && password === "user123") {
      localStorage.setItem(
        "user",
        JSON.stringify({
          email,
          role: "user",
          name: "John Doe",
          subscription: {
            category: "Strength + Cardio",
            price: 1000,
            startDate: "2024-01-01",
            endDate: "2024-12-31",
          },
        }),
      )
      toast({
        title: "Welcome back!",
        description: "Redirecting to your dashboard...",
      })
      router.push("/dashboard/user")
    } else {
      toast({
        title: "Invalid credentials",
        description: "Please use admin@pulsefit.com or user@pulsefit.com with correct password",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-blue-950/20 p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-500/10 border border-blue-500/20">
              <Dumbbell className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to PulseFit</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full gradient-electric text-white font-semibold" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <p className="text-sm text-yellow-400 font-medium mb-1">⚠️ Database Currently Down</p>
            <p className="text-xs text-muted-foreground">
              Please use the demo accounts below to explore the website features.
            </p>
          </div>

          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Demo Accounts (Database is down):</p>
            <div className="space-y-1 text-xs">
              <p>
                <span className="font-medium text-blue-400">Admin:</span> admin@pulsefit.com | Password: admin123
              </p>
              <p>
                <span className="font-medium text-green-400">User:</span> user@pulsefit.com | Password: user123
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/auth/signup" className="text-blue-400 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
