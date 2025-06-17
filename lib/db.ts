import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  // Neon-specific optimizations
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("Executed query", { text: duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Test connection function
export async function testConnection() {
  try {
    const result = await query("SELECT NOW() as current_time, version() as postgres_version")
    console.log("✅ Database connection successful:", result.rows[0])
    return true
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    return false
  }
}

// User operations
export async function getUser(email: string) {
  const result = await query("SELECT * FROM users WHERE email = $1", [email])
  return result.rows[0]
}

export async function getUserById(id: number) {
  const result = await query("SELECT * FROM users WHERE id = $1", [id])
  return result.rows[0]
}

export async function createUser(name: string, email: string, passwordHash: string, role = "user") {
  const result = await query("INSERT INTO users(name, email, password_hash, role) VALUES($1, $2, $3, $4) RETURNING *", [
    name,
    email,
    passwordHash,
    role,
  ])
  return result.rows[0]
}

export async function updateUser(id: number, updates: any) {
  const fields = Object.keys(updates)
  const values = Object.values(updates)
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(", ")

  const result = await query(
    `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    [id, ...values],
  )
  return result.rows[0]
}

export async function getAllUsers() {
  const result = await query(`
    SELECT u.*, s.category as subscription_category, s.price as subscription_price, 
           s.start_date, s.end_date, s.status as subscription_status
    FROM users u
    LEFT JOIN subscriptions s ON u.id = s.user_id
    WHERE u.role = 'user'
    ORDER BY u.created_at DESC
  `)
  return result.rows
}

// Subscription operations
export async function createSubscription(
  userId: number,
  category: string,
  price: number,
  startDate: string,
  endDate: string,
) {
  const result = await query(
    "INSERT INTO subscriptions(user_id, category, price, start_date, end_date) VALUES($1, $2, $3, $4, $5) RETURNING *",
    [userId, category, price, startDate, endDate],
  )
  return result.rows[0]
}

export async function getUserSubscription(userId: number) {
  const result = await query("SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1", [
    userId,
  ])
  return result.rows[0]
}

export async function updateSubscription(userId: number, updates: any) {
  const fields = Object.keys(updates)
  const values = Object.values(updates)
  const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(", ")

  const result = await query(
    `UPDATE subscriptions SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE user_id = $1 RETURNING *`,
    [userId, ...values],
  )
  return result.rows[0]
}

// Attendance operations
export async function createAttendance(userId: number, checkInTime: string, date: string) {
  const result = await query("INSERT INTO attendance(user_id, check_in_time, date) VALUES($1, $2, $3) RETURNING *", [
    userId,
    checkInTime,
    date,
  ])
  return result.rows[0]
}

export async function updateAttendance(id: number, checkOutTime: string, duration: number) {
  const result = await query("UPDATE attendance SET check_out_time = $2, duration = $3 WHERE id = $1 RETURNING *", [
    id,
    checkOutTime,
    duration,
  ])
  return result.rows[0]
}

export async function getUserAttendance(userId: number, limit = 10) {
  const result = await query("SELECT * FROM attendance WHERE user_id = $1 ORDER BY date DESC LIMIT $2", [userId, limit])
  return result.rows
}

export async function getTodayAttendance(userId: number, date: string) {
  const result = await query("SELECT * FROM attendance WHERE user_id = $1 AND date = $2", [userId, date])
  return result.rows[0]
}

// Exercise operations
export async function createExercise(userId: number, exerciseData: any) {
  const { exerciseName, category, sets, reps, weight, duration, notes, date } = exerciseData
  const result = await query(
    "INSERT INTO exercises(user_id, exercise_name, category, sets, reps, weight, duration, notes, date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
    [userId, exerciseName, category, sets, reps, weight, duration, notes, date],
  )
  return result.rows[0]
}

export async function getUserExercises(userId: number, limit = 50) {
  const result = await query(
    "SELECT * FROM exercises WHERE user_id = $1 ORDER BY date DESC, created_at DESC LIMIT $2",
    [userId, limit],
  )
  return result.rows
}

export async function deleteExercise(id: number, userId: number) {
  const result = await query("DELETE FROM exercises WHERE id = $1 AND user_id = $2 RETURNING *", [id, userId])
  return result.rows[0]
}

// Analytics
export async function getUserStats(userId: number) {
  const attendanceResult = await query(
    "SELECT COUNT(*) as total_sessions, SUM(duration) as total_minutes FROM attendance WHERE user_id = $1 AND check_out_time IS NOT NULL",
    [userId],
  )

  const exerciseResult = await query(
    "SELECT COUNT(*) as total_exercises, COUNT(DISTINCT date) as workout_days FROM exercises WHERE user_id = $1",
    [userId],
  )

  return {
    attendance: attendanceResult.rows[0],
    exercises: exerciseResult.rows[0],
  }
}

export async function getAdminStats() {
  const userStats = await query(`
    SELECT 
      COUNT(*) as total_users,
      COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_users,
      COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_users_month
    FROM users
  `)

  const subscriptionStats = await query(`
    SELECT 
      COUNT(*) as total_subscriptions,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_subscriptions,
      COUNT(CASE WHEN end_date <= CURRENT_DATE + INTERVAL '3 days' AND end_date > CURRENT_DATE THEN 1 END) as expiring_soon,
      COUNT(CASE WHEN end_date <= CURRENT_DATE THEN 1 END) as expired,
      SUM(CASE WHEN status = 'active' THEN price ELSE 0 END) as monthly_revenue
    FROM subscriptions
  `)

  return {
    users: userStats.rows[0],
    subscriptions: subscriptionStats.rows[0],
  }
}
