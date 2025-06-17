import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Users, Clock, Heart } from "lucide-react"

export default function AboutPage() {
  const trainers = [
    {
      name: "Sarah Johnson",
      specialty: "Strength Training",
      experience: "8 years",
      certifications: ["NASM-CPT", "CSCS"],
    },
    {
      name: "Mike Chen",
      specialty: "Cardio & HIIT",
      experience: "6 years",
      certifications: ["ACSM-CPT", "TRX"],
    },
    {
      name: "Emily Rodriguez",
      specialty: "Yoga & Flexibility",
      experience: "10 years",
      certifications: ["RYT-500", "NASM-CES"],
    },
  ]

  const stats = [
    { icon: Users, label: "Active Members", value: "500+" },
    { icon: Award, label: "Certified Trainers", value: "15+" },
    { icon: Clock, label: "Years of Experience", value: "10+" },
    { icon: Heart, label: "Success Stories", value: "1000+" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-background via-background to-blue-950/20">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold">
                About <span className="text-blue-400">PulseFit</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                We're more than just a gym. We're a community dedicated to transforming lives through fitness, wellness,
                and unwavering support for your health journey.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-24">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid gap-12 md:grid-cols-2 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    At PulseFit, we believe fitness is not just about physical transformation—it's about building
                    confidence, creating healthy habits, and fostering a supportive community where everyone can thrive.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Our state-of-the-art facility, combined with expert guidance and innovative programs, provides the
                    perfect environment for you to achieve your fitness goals, no matter where you're starting from.
                  </p>
                </div>
                <div className="relative">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-500/20 to-red-500/20 border border-border/50" />
                  <div className="absolute inset-4 rounded-xl bg-muted/50 backdrop-blur-sm" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
              <p className="text-xl text-muted-foreground">Numbers that speak to our commitment</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                      <stat.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <div className="text-3xl font-bold mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trainers Section */}
        <section className="py-24">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Trainers</h2>
              <p className="text-xl text-muted-foreground">Expert guidance from certified professionals</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {trainers.map((trainer, index) => (
                <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-red-500/20 border border-border/50 mx-auto" />
                      <div>
                        <h3 className="text-xl font-semibold">{trainer.name}</h3>
                        <p className="text-blue-400 font-medium">{trainer.specialty}</p>
                        <p className="text-sm text-muted-foreground">{trainer.experience} experience</p>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {trainer.certifications.map((cert, certIndex) => (
                          <Badge key={certIndex} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
