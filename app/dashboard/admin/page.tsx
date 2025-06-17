"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { Users, CreditCard, AlertTriangle, Plus, CalendarIcon, Edit, Download } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface User {
  id: string
  name: string
  email: string
  subscription: {
    category: string
    price: number
    startDate: string
    endDate: string
  }
  status: "active" | "expiring" | "expired"
}

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    subscription: "",
    startDate: new Date(),
    endDate: new Date(),
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "admin") {
      router.push("/auth/login")
      return
    }

    setAdminUser(parsedUser)

    // Load mock users data
    const mockUsers: User[] = [
      {
        id: "1",
        name: "John Doe",
        email: "user@pulsefit.com",
        subscription: {
          category: "Strength + Cardio",
          price: 1000,
          startDate: "2024-01-01",
          endDate: "2024-12-31",
        },
        status: "active",
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        subscription: {
          category: "Strength Training",
          price: 800,
          startDate: "2024-01-15",
          endDate: "2024-06-05",
        },
        status: "expiring",
      },
      {
        id: "3",
        name: "Mike Johnson",
        email: "mike@example.com",
        subscription: {
          category: "Strength + Cardio",
          price: 1000,
          startDate: "2023-12-01",
          endDate: "2024-05-30",
        },
        status: "expired",
      },
    ]

    // Calculate status for each user
    const usersWithStatus = mockUsers.map((user) => {
      const endDate = new Date(user.subscription.endDate)
      const today = new Date()
      const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 3600 * 24))

      let status: "active" | "expiring" | "expired" = "active"
      if (daysLeft <= 0) status = "expired"
      else if (daysLeft <= 3) status = "expiring"

      return { ...user, status }
    })

    setUsers(usersWithStatus)
  }, [router])

  const handleAddUser = () => {
    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      subscription: {
        category: newUser.subscription,
        price: newUser.subscription === "Strength Training" ? 800 : 1000,
        startDate: format(newUser.startDate, "yyyy-MM-dd"),
        endDate: format(newUser.endDate, "yyyy-MM-dd"),
      },
      status: "active",
    }

    setUsers([...users, user])
    setIsAddDialogOpen(false)
    setNewUser({
      name: "",
      email: "",
      subscription: "",
      startDate: new Date(),
      endDate: new Date(),
    })

    toast({
      title: "User added successfully",
      description: `${user.name} has been added to the system.`,
    })
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setNewUser({
      name: user.name,
      email: user.email,
      subscription: user.subscription.category,
      startDate: new Date(user.subscription.startDate),
      endDate: new Date(user.subscription.endDate),
    })
  }

  const handleUpdateUser = () => {
    if (!editingUser) return

    const updatedUsers = users.map((user) =>
      user.id === editingUser.id
        ? {
            ...user,
            name: newUser.name,
            email: newUser.email,
            subscription: {
              category: newUser.subscription,
              price: newUser.subscription === "Strength Training" ? 800 : 1000,
              startDate: format(newUser.startDate, "yyyy-MM-dd"),
              endDate: format(newUser.endDate, "yyyy-MM-dd"),
            },
          }
        : user,
    )

    setUsers(updatedUsers)
    setEditingUser(null)
    setNewUser({
      name: "",
      email: "",
      subscription: "",
      startDate: new Date(),
      endDate: new Date(),
    })

    toast({
      title: "User updated successfully",
      description: `${newUser.name}'s information has been updated.`,
    })
  }

  const exportData = () => {
    const csvContent = [
      ["Name", "Email", "Subscription", "Price", "Start Date", "End Date", "Status"],
      ...users.map((user) => [
        user.name,
        user.email,
        user.subscription.category,
        user.subscription.price.toString(),
        user.subscription.startDate,
        user.subscription.endDate,
        user.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "pulsefit-users.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Data exported",
      description: "User data has been exported to CSV file.",
    })
  }

  if (!adminUser) {
    return <div>Loading...</div>
  }

  const activeUsers = users.filter((u) => u.status === "active").length
  const expiringUsers = users.filter((u) => u.status === "expiring").length
  const expiredUsers = users.filter((u) => u.status === "expired").length
  const totalRevenue = users.reduce((sum, user) => sum + user.subscription.price, 0)

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage users and subscriptions</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-electric text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>Create a new user account with subscription details.</DialogDescription>
                </DialogHeader>
                <UserForm user={newUser} setUser={setNewUser} onSubmit={handleAddUser} submitLabel="Add User" />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Notifications */}
        {expiringUsers > 0 && (
          <Card className="border-yellow-500/50 bg-yellow-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <div>
                  <p className="font-semibold text-yellow-400">Subscriptions Expiring Soon</p>
                  <p className="text-sm text-muted-foreground">
                    {expiringUsers} user{expiringUsers === 1 ? "" : "s"} have subscriptions expiring within 3 days.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">{activeUsers} active members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">From {activeUsers} active subscriptions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{expiringUsers}</div>
              <p className="text-xs text-muted-foreground">Within 3 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{expiredUsers}</div>
              <p className="text-xs text-muted-foreground">Need renewal</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage user subscriptions and details</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.subscription.category}</p>
                        <p className="text-sm text-muted-foreground">₹{user.subscription.price}/month</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(user.subscription.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active"
                            ? "default"
                            : user.status === "expiring"
                              ? "secondary"
                              : "destructive"
                        }
                        className={
                          user.status === "active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : user.status === "expiring"
                              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>Update user subscription details.</DialogDescription>
                          </DialogHeader>
                          <UserForm
                            user={newUser}
                            setUser={setNewUser}
                            onSubmit={handleUpdateUser}
                            submitLabel="Update User"
                          />
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

function UserForm({
  user,
  setUser,
  onSubmit,
  submitLabel,
}: {
  user: any
  setUser: (user: any) => void
  onSubmit: () => void
  submitLabel: string
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          placeholder="Enter full name"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Enter email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subscription">Subscription Plan</Label>
        <Select value={user.subscription} onValueChange={(value) => setUser({ ...user, subscription: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Choose subscription plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Strength Training">Strength Training - ₹800/month</SelectItem>
            <SelectItem value="Strength + Cardio">Strength + Cardio - ₹1000/month</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !user.startDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {user.startDate ? format(user.startDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={user.startDate}
                onSelect={(date) => setUser({ ...user, startDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !user.endDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {user.endDate ? format(user.endDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={user.endDate}
                onSelect={(date) => setUser({ ...user, endDate: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Button onClick={onSubmit} className="w-full gradient-electric text-white">
        {submitLabel}
      </Button>
    </div>
  )
}
