import { NextResponse } from "next/server"
import { query, testConnection } from "@/lib/db"

export async function GET() {
  try {
    // Test database connection
    const isConnected = await testConnection()

    if (!isConnected) {
      throw new Error("Database connection failed")
    }

    // Get database info
    const dbInfo = await query(`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        version() as postgres_version,
        NOW() as current_time
    `)

    // Get table counts
    const tableStats = await query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM subscriptions) as subscriptions,
        (SELECT COUNT(*) FROM attendance) as attendance,
        (SELECT COUNT(*) FROM exercises) as exercises
    `)

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      provider: "Neon",
      info: dbInfo.rows[0],
      tables: tableStats.rows[0],
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        provider: "Neon",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
