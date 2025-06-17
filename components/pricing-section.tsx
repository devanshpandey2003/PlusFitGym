import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export function PricingSection() {
  const plans = [
    {
      name: "Strength Training",
      price: 800,
      description: "Perfect for strength and muscle building",
      features: [
        "Access to weight training area",
        "Free weights and machines",
        "Basic fitness assessment",
        "Locker room access",
        "Mobile app access",
      ],
      popular: false,
    },
    {
      name: "Strength + Cardio",
      price: 1000,
      description: "Complete fitness solution for all goals",
      features: [
        "Everything in Strength Training",
        "Cardio equipment access",
        "Group fitness classes",
        "Personal trainer consultation",
        "Nutrition guidance",
        "Progress tracking",
      ],
      popular: true,
    },
  ]

  return (
    <section className="py-24">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your <span className="text-blue-400">Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Flexible membership options designed to fit your fitness goals and budget.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 ${
                plan.popular ? "border-blue-500/50 shadow-lg shadow-blue-500/10" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 gradient-electric text-white border-0">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">₹{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                        <Check className="h-3 w-3 text-green-400" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="block">
                  <Button
                    className={`w-full ${
                      plan.popular ? "gradient-electric text-white" : "border-border/50 hover:bg-muted/50"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
