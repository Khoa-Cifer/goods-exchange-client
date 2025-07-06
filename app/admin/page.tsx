'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Package, AlertTriangle, TrendingUp, Eye, CheckCircle, XCircle, Search, Filter } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect, useState } from "react"
import { assignRoleToUser, getAllUsers, unassignRoleToUser } from "@/axios/user";
import { User } from "@/types/user";
import { formatDate } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showNotification } from "@/components/notification-helper";
import { useAuth } from "@/context/auth-context";

// Mock data for admin dashboard
const systemStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalItems: 3456,
  pendingItems: 23,
  reportedItems: 8,
  totalTransactions: 567,
}

const recentUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john@example.com",
    role: "seller",
    status: "active",
    joinDate: "2024-01-15",
    itemsListed: 12,
    rating: 4.8,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "buyer",
    status: "active",
    joinDate: "2024-01-10",
    itemsListed: 0,
    rating: 4.9,
  },
  {
    id: 3,
    name: "Mike Wilson",
    email: "mike@example.com",
    role: "seller",
    status: "suspended",
    joinDate: "2024-01-08",
    itemsListed: 5,
    rating: 3.2,
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma@example.com",
    role: "buyer",
    status: "active",
    joinDate: "2024-01-12",
    itemsListed: 0,
    rating: 4.7,
  },
]

const pendingItems = [
  {
    id: 1,
    title: "iPhone 15 Pro",
    seller: "TechDealer",
    price: 999,
    category: "Electronics",
    submittedDate: "2024-01-16",
    status: "pending",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    title: "Vintage Watch",
    seller: "CollectorPro",
    price: 450,
    category: "Fashion",
    submittedDate: "2024-01-15",
    status: "pending",
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 3,
    title: "Gaming Chair",
    seller: "GamerHub",
    price: 200,
    category: "Furniture",
    submittedDate: "2024-01-14",
    status: "flagged",
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function AdminDashboard() {
  const { authenticatedUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [openAssignRoleDialog, setOpenAssignRoleDialog] = useState(false);
  const [openUnassignRoleDialog, setOpenUnassignRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUnassignedRole, setSelectedUnassignedRole] = useState("");

  const handleUnassignRole = (user: User, role: string) => {
    setSelectedUser(user);
    setSelectedUnassignedRole(role);
    setOpenUnassignRoleDialog(true);
  };

  const handleConfirmUnassignRole = async () => {
    if (!selectedUser || !selectedUnassignedRole) return;
    const response = await unassignRoleToUser(selectedUser.id, selectedUnassignedRole);
    showNotification.success("Unassign Role successfully", "Reload the user list.")
    if (response) {
      await fetchUsers(); // Refresh user list after assigning role
    }
    setOpenUnassignRoleDialog(false);
    setSelectedUser(null);
    setSelectedUnassignedRole("");
  }

  const handleAssignRole = (user: User) => {
    setSelectedUser(user);
    setOpenAssignRoleDialog(true);
  };

  const handleConfirmAssignRole = async () => {
    if (!selectedUser || !selectedRole) return;
    const response = await assignRoleToUser(selectedUser.id, selectedRole);
    showNotification.success("Assign Role successfully", "Reload the user list.")
    if (response) {
      await fetchUsers(); // Refresh user list after assigning role
    }
    setOpenAssignRoleDialog(false);
    setSelectedUser(null);
    setSelectedRole("");
  }

  const handleRoleChange = (value: string) => {
    if (!selectedUser) return;
    setSelectedRole(value);
    console.log("Selected role:", value, "for user:", selectedUser.id);
  };

  const fetchUsers = async () => {
    const response = await getAllUsers();
    setUsers(response);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleView = (user: User) => {
  }

  const handleActivate = (user: User) => {
  }

  const handleSuspend = (user: User) => {
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage users, items, and system settings</p>
            </div>
            <div className="flex gap-4">
              <ThemeToggle />
              <Link href="/buyer">
                <Button variant="outline" className="bg-transparent">
                  View as Buyer
                </Button>
              </Link>
              <Link href="/seller">
                <Button variant="outline" className="bg-transparent">
                  View as Seller
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="bg-transparent">
                  Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* System Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
                  <p className="text-2xl font-bold dark:text-white">{systemStats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Users</p>
                  <p className="text-2xl font-bold dark:text-white">{systemStats.activeUsers.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Items</p>
                  <p className="text-2xl font-bold dark:text-white">{systemStats.totalItems.toLocaleString()}</p>
                </div>
                <Package className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending Items</p>
                  <p className="text-2xl font-bold dark:text-white">{systemStats.pendingItems}</p>
                </div>
                <Eye className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Reported Items</p>
                  <p className="text-2xl font-bold dark:text-white">{systemStats.reportedItems}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Transactions</p>
                  <p className="text-2xl font-bold dark:text-white">{systemStats.totalTransactions}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3 dark:bg-gray-800">
            <TabsTrigger
              value="users"
              className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
            >
              User Management
            </TabsTrigger>
            <TabsTrigger
              value="items"
              className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
            >
              Item Moderation
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="dark:text-white">User Management</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                      <Input
                        placeholder="Search users..."
                        className="pl-10 w-64 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="text-left py-3 px-4 dark:text-white">User</th>
                        <th className="text-left py-3 px-4 dark:text-white">Role</th>
                        <th className="text-left py-3 px-4 dark:text-white">Status</th>
                        <th className="text-left py-3 px-4 dark:text-white">Join Date</th>
                        <th className="text-left py-3 px-4 dark:text-white">Items Listed</th>
                        <th className="text-left py-3 px-4 dark:text-white">Rating</th>
                        <th className="text-left py-3 px-4 dark:text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users && users.length > 0 && users.map && users.map((user) => (
                        <tr
                          key={user.id}
                          className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-medium dark:text-white">{user.username}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {user.userRoles && user.userRoles.length > 0 && user.userRoles.map && user.userRoles.map((role) => (
                              <Badge onClick={() => handleUnassignRole(user, role.role.name)}>{role.role.name}</Badge>
                            ))}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={user.isActive === 1 ? "default" : "destructive"}>{user.isActive === 1 ? "Active" : "Suspended"}</Badge>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{formatDate(user.createdAt)}</td>
                          <td className="py-3 px-4 dark:text-white">0</td> {/* Placeholder for items listed, as we don't have that data in the user object */}
                          <td className="py-3 px-4">
                            <span className="flex items-center dark:text-white">⭐ 5</span>
                          </td>
                          <td className="py-3 px-4">
                            {authenticatedUser?.googleId !== user.googleId && user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className="bg-dark:bg-gray-700 dark:text-white">
                                    Actions
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                  <DropdownMenuItem onClick={() => handleView(user)}>
                                    View
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() =>
                                      user.isActive === 0 ? handleActivate(user) : handleSuspend(user)
                                    }
                                    className={`${user.isActive === 0
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-red-600 dark:text-red-400"
                                      }`}
                                  >
                                    {user.isActive === 0 ? "Activate" : "Suspend"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleAssignRole(user)} className="text-blue-600 dark:text-blue-400">
                                    Assign Role
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Item Moderation Tab */}
          <TabsContent value="items" className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="dark:text-white">Item Moderation</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">{systemStats.pendingItems} Pending Review</Badge>
                    <Badge variant="destructive">{systemStats.reportedItems} Reported</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-medium dark:text-white">{item.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">by {item.seller}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">${item.price}</span>
                            <Badge variant="outline">{item.category}</Badge>
                            <Badge variant={item.status === "flagged" ? "destructive" : "secondary"}>
                              {item.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Eye className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 dark:text-green-400 bg-transparent"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400 bg-transparent">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">User Growth Chart Placeholder</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Item Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="dark:text-white">Electronics</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                          <div className="w-16 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">67%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="dark:text-white">Fashion</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                          <div className="w-12 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">50%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="dark:text-white">Sports</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                          <div className="w-8 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">33%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="dark:text-white">Furniture</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                          <div className="w-6 h-2 bg-orange-600 dark:bg-orange-400 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-300">25%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-600 dark:bg-green-400 rounded-full"></div>
                      <span className="dark:text-white">New user registered: john@example.com</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-auto">2 min ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                      <span className="dark:text-white">Item approved: MacBook Pro 2021</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-auto">5 min ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full"></div>
                      <span className="dark:text-white">Item reported: Suspicious listing</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-auto">10 min ago</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-purple-600 dark:bg-purple-400 rounded-full"></div>
                      <span className="dark:text-white">User suspended: mike@example.com</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-auto">15 min ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="dark:text-white">System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="dark:text-white">Server Status</span>
                      <Badge variant="default" className="bg-green-600 dark:bg-green-700">
                        Online
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="dark:text-white">Database</span>
                      <Badge variant="default" className="bg-green-600 dark:bg-green-700">
                        Healthy
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="dark:text-white">Storage</span>
                      <Badge variant="secondary">78% Used</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="dark:text-white">API Response</span>
                      <Badge variant="default" className="bg-green-600 dark:bg-green-700">
                        Fast
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {selectedUser && (
            <Dialog open={openUnassignRoleDialog} onOpenChange={setOpenUnassignRoleDialog}>
              {selectedUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL ? (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cannot modify admin's roles</DialogTitle>
                  </DialogHeader>
                  <Button variant={"secondary"} onClick={() => setOpenUnassignRoleDialog(false)}>Close</Button>
                </DialogContent>
              ) : selectedUser.email === authenticatedUser?.email ? (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cannot assign role to yourself</DialogTitle>
                  </DialogHeader>
                  <Button variant={"secondary"} onClick={() => setOpenUnassignRoleDialog(false)}>Close</Button>
                </DialogContent>
              ) : (
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Unassign Role {selectedUnassignedRole} from {selectedUser.username}</DialogTitle>
                  </DialogHeader>
                  <Button variant={"secondary"} onClick={handleConfirmUnassignRole}>Confirm</Button>
                </DialogContent>
              )}
            </Dialog>
          )}

          {selectedUser && (
            <Dialog open={openAssignRoleDialog} onOpenChange={setOpenAssignRoleDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Role to {selectedUser.username}</DialogTitle>
                </DialogHeader>
                <Select onValueChange={handleRoleChange}>
                  <SelectTrigger className="w-full mt-4">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Moderator">Moderator</SelectItem>
                    <SelectItem value="Seller">Seller</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant={"secondary"} onClick={handleConfirmAssignRole}>Confirm</Button>
              </DialogContent>
            </Dialog>
          )}
        </Tabs>
      </div>
    </div>
  )
}
