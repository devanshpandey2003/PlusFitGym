"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Zap, Users, Trophy, Star, Target, Award } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-blue-950/20" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="container relative z-10 px-4 py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
          {/* Achievement Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-sm font-medium achievement-badge hover-lift">
            <Trophy className="h-4 w-4 text-yellow-400" />
            <span>Transform Your Fitness Journey</span>
            <Badge className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs">+500 XP</Badge>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-scale-in">
            Unleash Your{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent animate-glow">
              Potential
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join PulseFit and experience state-of-the-art equipment, expert trainers, and a community that pushes you to
            achieve your fitness goals.
          </p>

          {/* Gamified Stats */}
          <div className="flex flex-wrap justify-center gap-8 py-8">
            <div className="flex items-center gap-3 p-4 rounded-xl game-card hover-lift">
              <div className="level-badge">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-lg">500+</p>
                <p className="text-sm text-muted-foreground">Active Members</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl game-card hover-lift">
              <div className="level-badge" style={{ background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-lg">50+</p>
                <p className="text-sm text-muted-foreground">Equipment</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl game-card hover-lift">
              <div className="level-badge" style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" }}>
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-lg">24/7</p>
                <p className="text-sm text-muted-foreground">Access</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Community Goal Progress</span>
              <span className="font-semibold">78%</span>
            </div>
            <div className="xp-bar h-3">
              <div className="xp-fill w-[78%]"></div>
            </div>
            <p className="text-xs text-muted-foreground">390/500 members reached their monthly goals!</p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="gradient-electric text-white font-semibold px-8 py-6 text-lg game-button hover-glow"
              >
                <Target className="mr-2 h-5 w-5" />
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg border-border/50 hover:bg-muted/50 game-button"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Trust indicators with gamification */}
          <div className="pt-16 space-y-6">
            <p className="text-sm text-muted-foreground mb-6">Trusted by fitness enthusiasts worldwide</p>
            <div className="flex justify-center items-center gap-8 opacity-80">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">4.9/5</span>
                  <span className="text-muted-foreground"> from 200+ reviews</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-400" />
                <span className="text-sm font-medium">Top Rated Gym 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
