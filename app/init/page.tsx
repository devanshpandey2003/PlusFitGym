"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, Database, Users, Activity, Dumbbell } from "lucide-react"

export default function InitializePage() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const initializeDatabase = async () => {
    setIsInitializing(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/init-database")
      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        setError(data.error || "Initialization failed")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error")
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-950/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-blue-500/10 border border-blue-500/20">
              <Database className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">PulseFit Database Setup</CardTitle>
          <CardDescription>Initialize your Neon database with tables and sample data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!result && !error && (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">
                Click the button below to set up your database with all necessary tables and sample data.
              </p>
              <Button
                onClick={initializeDatabase}
                disabled={isInitializing}
                className="gradient-electric text-white font-semibold px-8 py-3"
              >
                {isInitializing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing Database...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Initialize Database
                  </>
                )}
              </Button>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 font-semibold mb-2">
                <XCircle className="h-5 w-5" />
                Initialization Failed
              </div>
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button onClick={initializeDatabase} variant="outline" className="mt-3">
                Try Again
              </Button>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2 text-green-400 font-semibold mb-2">
                  <CheckCircle className="h-5 w-5" />
                  Database Initialized Successfully!
                </div>
                <p className="text-sm text-muted-foreground">
                  All tables have been created and sample data has been added.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Database Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span className="text-sm">Users</span>
                      </div>
                      <Badge variant="secondary">{result.stats.users}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-green-400" />
                        <span className="text-sm">Subscriptions</span>
                      </div>
                      <Badge variant="secondary">{result.stats.subscriptions}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-purple-400" />
                        <span className="text-sm">Attendance</span>
                      </div>
                      <Badge variant="secondary">{result.stats.attendance}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="h-4 w-4 text-red-400" />
                        <span className="text-sm">Exercises</span>
                      </div>
                      <Badge variant="secondary">{result.stats.exercises}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Demo Accounts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="font-medium text-sm text-blue-400">Admin Account</p>
                      <p className="text-xs text-muted-foreground">Email: {result.demoAccounts.admin.email}</p>
                      <p className="text-xs text-muted-foreground">Password: {result.demoAccounts.admin.password}</p>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <p className="font-medium text-sm text-green-400">User Account</p>
                      <p className="text-xs text-muted-foreground">Email: {result.demoAccounts.user.email}</p>
                      <p className="text-xs text-muted-foreground">Password: {result.demoAccounts.user.password}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild className="gradient-electric text-white">
                  <a href="/auth/login">Go to Login</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/api/health">Check Health</a>
                </Button>
                <Button asChild variant="outline">
                  <a href="/">Home Page</a>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
