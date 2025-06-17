import { type NextRequest, NextResponse } from "next/server"
import { getAllUsers, getAdminStats } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const users = await getAllUsers()
    const stats = await getAdminStats()

    return NextResponse.json({
      users,
      stats,
    })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
