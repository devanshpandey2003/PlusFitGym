import { NextResponse } from "next/server"
import { Pool } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function GET() {
  const client = await pool.connect()

  try {
    console.log("🚀 Starting PulseFit database initialization...")

    // Test connection
    const testResult = await client.query("SELECT NOW() as current_time")
    console.log("✅ Database connection successful!")

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        phone VARCHAR(20),
        age INTEGER,
        height INTEGER,
        weight INTEGER,
        fitness_goal VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Create subscriptions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Create attendance table
    await client.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        check_in_time TIMESTAMP NOT NULL,
        check_out_time TIMESTAMP,
        duration INTEGER,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Create exercises table
    await client.query(`
      CREATE TABLE IF NOT EXISTS exercises (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        exercise_name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        sets INTEGER,
        reps INTEGER,
        weight DECIMAL(5,2),
        duration INTEGER,
        notes TEXT,
        date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
      CREATE INDEX IF NOT EXISTS idx_attendance_user_id_date ON attendance(user_id, date);
      CREATE INDEX IF NOT EXISTS idx_exercises_user_id_date ON exercises(user_id, date);
    `)

    // Insert admin user
    const adminExists = await client.query("SELECT id FROM users WHERE email = $1", ["admin@pulsefit.com"])
    if (adminExists.rows.length === 0) {
      await client.query(
        "INSERT INTO users (name, email, password_hash, role, phone, age, height, weight, fitness_goal) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
        ["Admin User", "admin@pulsefit.com", "admin123", "admin", "+91 98765 43210", 30, 175, 75, "Maintain Fitness"],
      )
    }

    // Insert demo user
    const userExists = await client.query("SELECT id FROM users WHERE email = $1", ["user@pulsefit.com"])
    let demoUserId
    if (userExists.rows.length === 0) {
      const userResult = await client.query(
        "INSERT INTO users (name, email, password_hash, role, phone, age, height, weight, fitness_goal) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
        ["John Doe", "user@pulsefit.com", "user123", "user", "+91 98765 43211", 25, 170, 70, "Weight Loss"],
      )
      demoUserId = userResult.rows[0].id

      // Create subscription
      await client.query(
        "INSERT INTO subscriptions (user_id, category, price, start_date, end_date) VALUES ($1, $2, $3, $4, $5)",
        [demoUserId, "Strength + Cardio", 1000.0, "2024-01-01", "2024-12-31"],
      )
    } else {
      demoUserId = userExists.rows[0].id
    }

    // Add sample data if it doesn't exist
    const existingData = await client.query("SELECT COUNT(*) as count FROM attendance WHERE user_id = $1", [demoUserId])
    if (Number.parseInt(existingData.rows[0].count) === 0) {
      // Add sample attendance
      const attendanceData = [
        { date: "2024-06-01", checkIn: "2024-06-01 06:30:00", checkOut: "2024-06-01 08:00:00", duration: 90 },
        { date: "2024-06-02", checkIn: "2024-06-02 07:00:00", checkOut: "2024-06-02 08:30:00", duration: 90 },
        { date: "2024-06-03", checkIn: "2024-06-03 06:45:00", checkOut: "2024-06-03 08:15:00", duration: 90 },
      ]

      for (const attendance of attendanceData) {
        await client.query(
          "INSERT INTO attendance (user_id, check_in_time, check_out_time, duration, date) VALUES ($1, $2, $3, $4, $5)",
          [demoUserId, attendance.checkIn, attendance.checkOut, attendance.duration, attendance.date],
        )
      }

      // Add sample exercises
      const exerciseData = [
        {
          date: "2024-06-01",
          exerciseName: "Bench Press",
          category: "Strength",
          sets: 3,
          reps: 10,
          weight: 80,
          notes: "Good form, felt strong",
        },
        {
          date: "2024-06-02",
          exerciseName: "Treadmill",
          category: "Cardio",
          sets: 1,
          reps: 1,
          duration: 30,
          notes: "5km run at moderate pace",
        },
      ]

      for (const exercise of exerciseData) {
        await client.query(
          "INSERT INTO exercises (user_id, exercise_name, category, sets, reps, weight, duration, notes, date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
          [
            demoUserId,
            exercise.exerciseName,
            exercise.category,
            exercise.sets,
            exercise.reps,
            exercise.weight,
            exercise.duration,
            exercise.notes,
            exercise.date,
          ],
        )
      }
    }

    // Get final stats
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as users,
        (SELECT COUNT(*) FROM subscriptions) as subscriptions,
        (SELECT COUNT(*) FROM attendance) as attendance,
        (SELECT COUNT(*) FROM exercises) as exercises
    `)

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully!",
      stats: stats.rows[0],
      demoAccounts: {
        admin: { email: "admin@pulsefit.com", password: "admin123" },
        user: { email: "user@pulsefit.com", password: "user123" },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Database initialization failed:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  } finally {
    client.release()
  }
}
