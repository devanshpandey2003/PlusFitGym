import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Heart, Users, Clock, Trophy, Zap } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Dumbbell,
      title: "Premium Equipment",
      description: "State-of-the-art machines and free weights from top brands for optimal training experience.",
    },
    {
      icon: Users,
      title: "Expert Trainers",
      description: "Certified personal trainers to guide you through your fitness journey with personalized programs.",
    },
    {
      icon: Heart,
      title: "Health Monitoring",
      description: "Advanced health tracking and monitoring systems to keep track of your progress and vitals.",
    },
    {
      icon: Clock,
      title: "24/7 Access",
      description: "Round-the-clock gym access so you can work out whenever it fits your schedule.",
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Gamified fitness goals and achievements to keep you motivated and engaged.",
    },
    {
      icon: Zap,
      title: "High Energy Environment",
      description: "Motivating atmosphere with energizing music and a community of like-minded individuals.",
    },
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-blue-400">PulseFit</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the difference with our comprehensive fitness ecosystem designed for your success.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-400" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
