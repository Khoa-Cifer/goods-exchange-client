'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { assignRoleToUser, getAllUsers, unassignRoleToUser } from "@/axios/admin";
import { User } from "@/types/user";
import { formatDate } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showNotification } from "@/components/notification-helper";
import { useAuth } from "@/context/auth-context";
import { Category } from "@/types/category";
import { getAllCategories } from "@/axios/user";

export default function AdminDashboard() {
  const { authenticatedUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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

  const fetchCategories = async () => {
    const response = await getAllCategories();
    setCategories(response);
  }

  useEffect(() => {
    fetchUsers();
    fetchCategories();
  }, []);

  const handleView = (user: User) => {
  }

  const handleActivate = (user: User) => {
  }

  const handleSuspend = (user: User) => {
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-2 dark:bg-gray-800">
          <TabsTrigger
            value="users"
            className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
          >
            User Management
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
          >
            Categories
          </TabsTrigger>
        </TabsList>

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

        <TabsContent value="categories" className="space-y-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="dark:text-white">Post Category Management</CardTitle>
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
                      <th className="text-left py-3 px-4 dark:text-white">Name</th>
                      <th className="text-left py-3 px-4 dark:text-white">Created At</th>
                      <th className="text-left py-3 px-4 dark:text-white">Updated At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories && categories.length > 0 && categories.map && categories.map((category) => (
                      <tr
                        key={category.id}
                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{category.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{formatDate(category.createdAt)}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{formatDate(category.updatedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* <TabsContent value="categories" className="space-y-6">
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
        </TabsContent> */}

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
  )
}
