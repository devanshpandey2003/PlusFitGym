import { type NextRequest, NextResponse } from "next/server"
import { createAttendance, updateAttendance, getUserAttendance, getTodayAttendance } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const date = searchParams.get("date")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (date) {
      const attendance = await getTodayAttendance(Number.parseInt(userId), date)
      return NextResponse.json(attendance)
    } else {
      const attendance = await getUserAttendance(Number.parseInt(userId))
      return NextResponse.json(attendance)
    }
  } catch (error) {
    console.error("Get attendance error:", error)
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, checkInTime, date, action } = await request.json()

    if (action === "checkin") {
      const attendance = await createAttendance(userId, checkInTime, date)
      return NextResponse.json(attendance)
    } else if (action === "checkout") {
      const { attendanceId, checkOutTime, duration } = await request.json()
      const attendance = await updateAttendance(attendanceId, checkOutTime, duration)
      return NextResponse.json(attendance)
    }
  } catch (error) {
    console.error("Attendance error:", error)
    return NextResponse.json({ error: "Failed to process attendance" }, { status: 500 })
  }
}
