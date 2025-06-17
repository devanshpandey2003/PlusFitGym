import { type NextRequest, NextResponse } from "next/server"
import { getUserById, updateUser } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getUserById(Number.parseInt(params.id))

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { password_hash, ...userData } = user
    return NextResponse.json(userData)
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const user = await updateUser(Number.parseInt(params.id), updates)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { password_hash, ...userData } = user
    return NextResponse.json(userData)
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
