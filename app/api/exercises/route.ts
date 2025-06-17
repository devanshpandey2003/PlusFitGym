import { type NextRequest, NextResponse } from "next/server"
import { createExercise, getUserExercises, deleteExercise } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const exercises = await getUserExercises(Number.parseInt(userId))
    return NextResponse.json(exercises)
  } catch (error) {
    console.error("Get exercises error:", error)
    return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, ...exerciseData } = await request.json()

    const exercise = await createExercise(userId, exerciseData)
    return NextResponse.json(exercise)
  } catch (error) {
    console.error("Create exercise error:", error)
    return NextResponse.json({ error: "Failed to create exercise" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const exerciseId = searchParams.get("id")
    const userId = searchParams.get("userId")

    if (!exerciseId || !userId) {
      return NextResponse.json({ error: "Exercise ID and User ID are required" }, { status: 400 })
    }

    const exercise = await deleteExercise(Number.parseInt(exerciseId), Number.parseInt(userId))
    return NextResponse.json(exercise)
  } catch (error) {
    console.error("Delete exercise error:", error)
    return NextResponse.json({ error: "Failed to delete exercise" }, { status: 500 })
  }
}
