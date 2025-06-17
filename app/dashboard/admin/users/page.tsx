"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Users, Search, Eye, Edit, Trash2, UserPlus, Activity, Calendar, Dumbbell } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  phone: string
  joinDate: string
  subscription: {
    category: string
    price: number
    startDate: string
    endDate: string
  }
  status: "active" | "expiring" | "expired"
  lastVisit?: string
  totalWorkouts?: number
}

export default function AdminUsersPage() {
  const [adminUser, setAdminUser] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
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
        phone: "+91 98765 43210",
        joinDate: "2024-01-01",
        subscription: {
          category: "Strength + Cardio",
          price: 1000,
          startDate: "2024-01-01",
          endDate: "2024-12-31",
        },
        status: "active",
        lastVisit: "2024-06-01",
        totalWorkouts: 45,
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "+91 98765 43211",
        joinDate: "2024-01-15",
        subscription: {
          category: "Strength Training",
          price: 800,
          startDate: "2024-01-15",
          endDate: "2024-06-05",
        },
        status: "expiring",
        lastVisit: "2024-05-30",
        totalWorkouts: 32,
      },
      {
        id: "3",
        name: "Mike Johnson",
        email: "mike@example.com",
        phone: "+91 98765 43212",
        joinDate: "2023-12-01",
        subscription: {
          category: "Strength + Cardio",
          price: 1000,
          startDate: "2023-12-01",
          endDate: "2024-05-30",
        },
        status: "expired",
        lastVisit: "2024-05-25",
        totalWorkouts: 78,
      },
      {
        id: "4",
        name: "Sarah Wilson",
        email: "sarah@example.com",
        phone: "+91 98765 43213",
        joinDate: "2024-02-01",
        subscription: {
          category: "Strength Training",
          price: 800,
          startDate: "2024-02-01",
          endDate: "2025-01-31",
        },
        status: "active",
        lastVisit: "2024-06-02",
        totalWorkouts: 28,
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
    setFilteredUsers(usersWithStatus)
  }, [router])

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [users, searchTerm])

  const handleDeleteUser = (id: string) => {
    const updatedUsers = users.filter((user) => user.id !== id)
    setUsers(updatedUsers)
    toast({
      title: "User deleted",
      description: "User has been removed from the system.",
    })
  }

  if (!adminUser) {
    return <div>Loading...</div>
  }

  const activeUsers = users.filter((u) => u.status === "active").length
  const totalUsers = users.length
  const newUsersThisMonth = users.filter((u) => {
    const joinDate = new Date(u.joinDate)
    const now = new Date()
    return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear()
  }).length

  return (
    <DashboardLayout userRole="admin">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage all registered users and their details</p>
          </div>
          <Button className="gradient-electric text-white">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered members</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{activeUsers}</div>
              <p className="text-xs text-muted-foreground">With active subscriptions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{newUsersThisMonth}</div>
              <p className="text-xs text-muted-foreground">New registrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Workouts</CardTitle>
              <Dumbbell className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-500">
                {Math.round(users.reduce((sum, user) => sum + (user.totalWorkouts || 0), 0) / users.length)}
              </div>
              <p className="text-xs text-muted-foreground">Per user</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Complete list of registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Details</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Workouts</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{user.phone}</p>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.subscription.category}</p>
                        <p className="text-sm text-muted-foreground">₹{user.subscription.price}/month</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(user.joinDate).toLocaleDateString()}</TableCell>
                    <TableCell>{user.lastVisit ? new Date(user.lastVisit).toLocaleDateString() : "Never"}</TableCell>
                    <TableCell>
                      <div className="text-center">
                        <p className="font-semibold">{user.totalWorkouts || 0}</p>
                        <p className="text-xs text-muted-foreground">sessions</p>
                      </div>
                    </TableCell>
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
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>User Details</DialogTitle>
                              <DialogDescription>Complete information about {selectedUser?.name}</DialogDescription>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                                    <p className="text-lg font-semibold">{selectedUser.name}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                                    <p className="text-lg font-semibold">{selectedUser.email}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                                    <p className="text-lg font-semibold">{selectedUser.phone}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-muted-foreground">Join Date</Label>
                                    <p className="text-lg font-semibold">
                                      {new Date(selectedUser.joinDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-lg">
                                  <h3 className="font-semibold mb-3">Subscription Details</h3>
                                  <div className="grid gap-3 md:grid-cols-2">
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">Plan</Label>
                                      <p className="font-semibold">{selectedUser.subscription.category}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">Price</Label>
                                      <p className="font-semibold">₹{selectedUser.subscription.price}/month</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
                                      <p className="font-semibold">
                                        {new Date(selectedUser.subscription.startDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">End Date</Label>
                                      <p className="font-semibold">
                                        {new Date(selectedUser.subscription.endDate).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <div className="p-4 bg-muted/30 rounded-lg">
                                  <h3 className="font-semibold mb-3">Activity Summary</h3>
                                  <div className="grid gap-3 md:grid-cols-3">
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">
                                        Total Workouts
                                      </Label>
                                      <p className="text-2xl font-bold text-blue-500">
                                        {selectedUser.totalWorkouts || 0}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">Last Visit</Label>
                                      <p className="font-semibold">
                                        {selectedUser.lastVisit
                                          ? new Date(selectedUser.lastVisit).toLocaleDateString()
                                          : "Never"}
                                      </p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                                      <Badge
                                        variant={
                                          selectedUser.status === "active"
                                            ? "default"
                                            : selectedUser.status === "expiring"
                                              ? "secondary"
                                              : "destructive"
                                        }
                                        className={
                                          selectedUser.status === "active"
                                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                                            : selectedUser.status === "expiring"
                                              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                              : "bg-red-500/10 text-red-400 border-red-500/20"
                                        }
                                      >
                                        {selectedUser.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
