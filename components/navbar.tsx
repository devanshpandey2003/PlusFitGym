"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Menu, Zap, Trophy } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 hover-lift">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 animate-glow">
            <Dumbbell className="h-6 w-6 text-blue-400" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            PulseFit
          </span>
          <Badge className="ml-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs animate-pulse-slow">
            <Trophy className="h-3 w-3 mr-1" />
            Pro
          </Badge>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition-all duration-300 hover:text-blue-400 hover:scale-105 relative group"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <Zap className="h-4 w-4 text-yellow-400 animate-pulse" />
            <span className="text-sm font-medium">Level 5</span>
          </div>
          <ThemeToggle />
          <Link href="/auth/login">
            <Button variant="ghost" className="game-button">
              Sign In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="gradient-electric text-white font-semibold game-button hover-glow">
              <Zap className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="game-button">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] game-card">
            <div className="flex flex-col space-y-4 mt-6">
              <div className="flex justify-between items-center px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-medium">Level 5</span>
                </div>
                <ThemeToggle />
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium transition-all duration-300 hover:text-blue-400 hover:translate-x-2 px-3 py-2 rounded-lg hover:bg-muted/50"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full game-button">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full gradient-electric text-white font-semibold game-button">
                    <Zap className="mr-2 h-4 w-4" />
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}
