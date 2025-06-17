import { type NextRequest, NextResponse } from "next/server"
import { createUser, createSubscription } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, subscription } = await request.json()

    // Create user
    const user = await createUser(name, email, password, "user")

    // Create subscription
    const price = subscription === "Strength Training" ? 800 : 1000
    const startDate = new Date().toISOString().split("T")[0]
    const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    await createSubscription(user.id, subscription, price, startDate, endDate)

    // Return user data (excluding password)
    const { password_hash, ...userData } = user

    return NextResponse.json({
      success: true,
      user: {
        ...userData,
        subscription: {
          category: subscription,
          price,
          startDate,
          endDate,
        },
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
