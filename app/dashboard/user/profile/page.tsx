"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import {
  Calendar,
  Clock,
  Edit,
  Save,
  Dumbbell,
  CheckCircle,
  Plus,
  Trash2,
  Target,
  Weight,
  Ruler,
  Activity,
  LogOut,
} from "lucide-react"

interface UserType {
  email: string
  name: string
  role: string
  subscription: {
    category: string
    price: number
    startDate: string
    endDate: string
  }
  profile?: {
    age?: number
    height?: number
    weight?: number
    fitnessGoal?: string
    phone?: string
  }
}

interface AttendanceRecord {
  id: string
  date: string
  checkIn: string
  checkOut?: string
  duration?: number
}

interface ExerciseRecord {
  id: string
  date: string
  exerciseName: string
  sets: number
  reps: number
  weight?: number
  duration?: number
  notes?: string
  category: string
}

export default function UserProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [exercises, setExercises] = useState<ExerciseRecord[]>([])
  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), "yyyy-MM-dd"))
  const [newExercise, setNewExercise] = useState({
    exerciseName: "",
    sets: 1,
    reps: 10,
    weight: 0,
    duration: 0,
    notes: "",
    category: "Strength",
  })
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    age: 25,
    height: 170,
    weight: 70,
    fitnessGoal: "Weight Loss",
    phone: "+91 98765 43210",
  })
  const [todayAttendance, setTodayAttendance] = useState<AttendanceRecord | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "user") {
      router.push("/auth/login")
      return
    }

    setUser(parsedUser)

    // Set profile data from user or defaults
    setProfileData({
      age: parsedUser.profile?.age || 25,
      height: parsedUser.profile?.height || 170,
      weight: parsedUser.profile?.weight || 70,
      fitnessGoal: parsedUser.profile?.fitnessGoal || "Weight Loss",
      phone: parsedUser.profile?.phone || "+91 98765 43210",
    })

    // Load mock attendance data
    const mockAttendance: AttendanceRecord[] = [
      {
        id: "1",
        date: "2024-06-01",
        checkIn: "06:30",
        checkOut: "08:00",
        duration: 90,
      },
      {
        id: "2",
        date: "2024-06-02",
        checkIn: "07:00",
        checkOut: "08:30",
        duration: 90,
      },
      {
        id: "3",
        date: "2024-06-03",
        checkIn: "06:45",
        checkOut: "08:15",
        duration: 90,
      },
    ]

    // Load mock exercise data
    const mockExercises: ExerciseRecord[] = [
      {
        id: "1",
        date: "2024-06-01",
        exerciseName: "Bench Press",
        sets: 3,
        reps: 10,
        weight: 80,
        category: "Strength",
        notes: "Good form, felt strong",
      },
      {
        id: "2",
        date: "2024-06-01",
        exerciseName: "Squats",
        sets: 3,
        reps: 12,
        weight: 100,
        category: "Strength",
        notes: "Increased weight from last session",
      },
      {
        id: "3",
        date: "2024-06-02",
        exerciseName: "Treadmill",
        sets: 1,
        reps: 1,
        duration: 30,
        category: "Cardio",
        notes: "5km run at moderate pace",
      },
    ]

    setAttendance(mockAttendance)
    setExercises(mockExercises)

    // Check if there's attendance for today
    const today = format(new Date(), "yyyy-MM-dd")
    const todayRecord = mockAttendance.find((record) => record.date === today)
    setTodayAttendance(todayRecord || null)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })
    router.push("/")
  }

  const handleMarkAttendance = () => {
    const today = format(new Date(), "yyyy-MM-dd")
    const now = format(new Date(), "HH:mm")

    if (todayAttendance && !todayAttendance.checkOut) {
      // Check out
      const checkInTime = new Date(`${today}T${todayAttendance.checkIn}:00`)
      const checkOutTime = new Date(`${today}T${now}:00`)
      const duration = Math.round((checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60))

      const updatedAttendance = attendance.map((record) =>
        record.id === todayAttendance.id ? { ...record, checkOut: now, duration } : record,
      )

      setAttendance(updatedAttendance)
      setTodayAttendance({ ...todayAttendance, checkOut: now, duration })

      toast({
        title: "Checked out successfully!",
        description: `Session duration: ${duration} minutes`,
      })
    } else if (!todayAttendance) {
      // Check in
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        date: today,
        checkIn: now,
      }

      setAttendance([...attendance, newRecord])
      setTodayAttendance(newRecord)

      toast({
        title: "Checked in successfully!",
        description: "Your gym session has started.",
      })
    }
  }

  const handleAddExercise = () => {
    const exercise: ExerciseRecord = {
      id: Date.now().toString(),
      date: selectedDate,
      exerciseName: newExercise.exerciseName,
      sets: newExercise.sets,
      reps: newExercise.reps,
      weight: newExercise.weight > 0 ? newExercise.weight : undefined,
      duration: newExercise.duration > 0 ? newExercise.duration : undefined,
      notes: newExercise.notes || undefined,
      category: newExercise.category,
    }

    setExercises([...exercises, exercise])
    setIsExerciseDialogOpen(false)

    // Reset form
    setNewExercise({
      exerciseName: "",
      sets: 1,
      reps: 10,
      weight: 0,
      duration: 0,
      notes: "",
      category: "Strength",
    })

    toast({
      title: "Exercise added successfully!",
      description: `${exercise.exerciseName} has been added to your workout log.`,
    })
  }

  const handleDeleteExercise = (id: string) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id))
    toast({
      title: "Exercise deleted",
      description: "The exercise has been removed from your workout log.",
    })
  }

  const handleSaveProfile = () => {
    // Update user profile
    const updatedUser = {
      ...user!,
      profile: profileData,
    }

    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
    setEditingProfile(false)

    toast({
      title: "Profile updated successfully!",
      description: "Your profile information has been saved.",
    })
  }

  const getExercisesForDate = (date: string) => {
    return exercises.filter((exercise) => exercise.date === date)
  }

  const getAttendanceForMonth = () => {
    const currentMonth = new Date().getMonth()
    return attendance.filter((record) => {
      const recordMonth = new Date(record.date).getMonth()
      return recordMonth === currentMonth
    })
  }

  const getTotalWorkoutTime = () => {
    return attendance.reduce((total, record) => {
      return total + (record.duration || 0)
    }, 0)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <DashboardLayout userRole="user">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and track your fitness journey</p>
          </div>
          <div className="flex gap-3">
            {!editingProfile ? (
              <Button onClick={() => setEditingProfile(true)} variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <Button onClick={handleSaveProfile} className="gradient-electric text-white">
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}
            <Button onClick={handleLogout} variant="destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {todayAttendance ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Check-in</p>
                      <p className="text-lg font-bold">{todayAttendance.checkIn}</p>
                    </div>
                    {todayAttendance.checkOut ? (
                      <div className="text-right">
                        <p className="text-sm font-medium">Check-out</p>
                        <p className="text-lg font-bold">{todayAttendance.checkOut}</p>
                      </div>
                    ) : null}
                  </div>
                  {todayAttendance.duration ? (
                    <div className="mt-2">
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-lg font-bold">{todayAttendance.duration} minutes</p>
                    </div>
                  ) : (
                    <Button
                      onClick={handleMarkAttendance}
                      className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Check Out
                    </Button>
                  )}
                </>
              ) : (
                <div className="text-center py-2">
                  <p className="text-sm text-muted-foreground mb-2">You haven't checked in today</p>
                  <Button onClick={handleMarkAttendance} className="gradient-electric text-white">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Check In
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Attendance</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getAttendanceForMonth().length}</div>
              <p className="text-xs text-muted-foreground">Days this month</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="text-sm">
                  <span className="font-medium">Total time:</span>{" "}
                  <span>{Math.round(getTotalWorkoutTime() / 60)} hours</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exercises.length}</div>
              <p className="text-xs text-muted-foreground">Exercises logged</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-medium">Strength:</span>{" "}
                  <span>{exercises.filter((e) => e.category === "Strength").length}</span>
                </div>
                <div>
                  <span className="font-medium">Cardio:</span>{" "}
                  <span>{exercises.filter((e) => e.category === "Cardio").length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Personal Info</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="exercises">Workout Log</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your personal details and fitness goals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    {editingProfile ? (
                      <Input id="name" value={user.name} disabled />
                    ) : (
                      <p className="text-lg font-semibold">{user.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    {editingProfile ? (
                      <Input id="email" value={user.email} disabled />
                    ) : (
                      <p className="text-lg font-semibold">{user.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {editingProfile ? (
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      />
                    ) : (
                      <p className="text-lg font-semibold">{profileData.phone}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    {editingProfile ? (
                      <Input
                        id="age"
                        type="number"
                        value={profileData.age}
                        onChange={(e) => setProfileData({ ...profileData, age: Number.parseInt(e.target.value) })}
                      />
                    ) : (
                      <p className="text-lg font-semibold">{profileData.age} years</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    {editingProfile ? (
                      <Input
                        id="height"
                        type="number"
                        value={profileData.height}
                        onChange={(e) => setProfileData({ ...profileData, height: Number.parseInt(e.target.value) })}
                      />
                    ) : (
                      <p className="text-lg font-semibold">{profileData.height} cm</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    {editingProfile ? (
                      <Input
                        id="weight"
                        type="number"
                        value={profileData.weight}
                        onChange={(e) => setProfileData({ ...profileData, weight: Number.parseInt(e.target.value) })}
                      />
                    ) : (
                      <p className="text-lg font-semibold">{profileData.weight} kg</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fitnessGoal">Fitness Goal</Label>
                  {editingProfile ? (
                    <Select
                      value={profileData.fitnessGoal}
                      onValueChange={(value) => setProfileData({ ...profileData, fitnessGoal: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your fitness goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                        <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                        <SelectItem value="Strength Training">Strength Training</SelectItem>
                        <SelectItem value="Endurance">Endurance</SelectItem>
                        <SelectItem value="General Fitness">General Fitness</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {profileData.fitnessGoal}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Membership Status</Label>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Active</Badge>
                    <span className="text-sm text-muted-foreground">
                      Expires on {new Date(user.subscription.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Body Metrics</CardTitle>
                <CardDescription>Your current body measurements and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                    <Weight className="h-8 w-8 text-blue-400 mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">Weight</p>
                    <p className="text-2xl font-bold">{profileData.weight} kg</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                    <Ruler className="h-8 w-8 text-green-400 mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">Height</p>
                    <p className="text-2xl font-bold">{profileData.height} cm</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted/30 rounded-lg">
                    <Target className="h-8 w-8 text-purple-400 mb-2" />
                    <p className="text-sm font-medium text-muted-foreground">BMI</p>
                    <p className="text-2xl font-bold">
                      {(profileData.weight / ((profileData.height / 100) * (profileData.height / 100))).toFixed(1)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>Track your gym visits and session durations</CardDescription>
              </CardHeader>
              <CardContent>
                {attendance.length > 0 ? (
                  <div className="space-y-4">
                    {attendance
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                          <div>
                            <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Check-in: {record.checkIn}</span>
                              {record.checkOut && <span>Check-out: {record.checkOut}</span>}
                            </div>
                          </div>
                          <div className="text-right">
                            {record.duration ? (
                              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                                {record.duration} minutes
                              </Badge>
                            ) : (
                              <Badge variant="secondary">In Progress</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No attendance records found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Exercises Tab */}
          <TabsContent value="exercises">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Workout Log</CardTitle>
                  <CardDescription>Track your exercises and progress</CardDescription>
                </div>
                <Dialog open={isExerciseDialogOpen} onOpenChange={setIsExerciseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gradient-electric text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Exercise
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Exercise</DialogTitle>
                      <DialogDescription>Log your workout details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="exerciseDate">Date</Label>
                        <Input
                          id="exerciseDate"
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exerciseName">Exercise Name</Label>
                        <Input
                          id="exerciseName"
                          value={newExercise.exerciseName}
                          onChange={(e) => setNewExercise({ ...newExercise, exerciseName: e.target.value })}
                          placeholder="e.g., Bench Press, Squats, Treadmill"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newExercise.category}
                          onValueChange={(value) => setNewExercise({ ...newExercise, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Strength">Strength</SelectItem>
                            <SelectItem value="Cardio">Cardio</SelectItem>
                            <SelectItem value="Flexibility">Flexibility</SelectItem>
                            <SelectItem value="Sports">Sports</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="sets">Sets</Label>
                          <Input
                            id="sets"
                            type="number"
                            min="1"
                            value={newExercise.sets}
                            onChange={(e) => setNewExercise({ ...newExercise, sets: Number.parseInt(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reps">Reps</Label>
                          <Input
                            id="reps"
                            type="number"
                            min="1"
                            value={newExercise.reps}
                            onChange={(e) => setNewExercise({ ...newExercise, reps: Number.parseInt(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            min="0"
                            value={newExercise.weight}
                            onChange={(e) =>
                              setNewExercise({ ...newExercise, weight: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="duration">Duration (min)</Label>
                          <Input
                            id="duration"
                            type="number"
                            min="0"
                            value={newExercise.duration}
                            onChange={(e) =>
                              setNewExercise({ ...newExercise, duration: Number.parseInt(e.target.value) })
                            }
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={newExercise.notes}
                          onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
                          placeholder="Add any notes about your workout"
                        />
                      </div>
                      <Button onClick={handleAddExercise} className="w-full gradient-electric text-white">
                        Add Exercise
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {exercises.length > 0 ? (
                  <div className="space-y-6">
                    {Array.from(new Set(exercises.map((e) => e.date)))
                      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
                      .map((date) => (
                        <div key={date} className="space-y-3">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(date).toLocaleDateString()}
                          </h3>
                          <div className="space-y-2">
                            {getExercisesForDate(date).map((exercise) => (
                              <div key={exercise.id} className="p-3 bg-muted/20 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium">{exercise.exerciseName}</h4>
                                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                                        {exercise.category}
                                      </Badge>
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                      <span>
                                        {exercise.sets} sets × {exercise.reps} reps
                                      </span>
                                      {exercise.weight && <span> • {exercise.weight} kg</span>}
                                      {exercise.duration && <span> • {exercise.duration} min</span>}
                                    </div>
                                    {exercise.notes && (
                                      <p className="text-sm mt-2 bg-muted/30 p-2 rounded">{exercise.notes}</p>
                                    )}
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={() => handleDeleteExercise(exercise.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No exercises logged yet. Add your first workout!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
