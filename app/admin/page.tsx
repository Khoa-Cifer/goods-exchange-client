'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Calendar, DollarSign, Eye, FileText, MapPin, Tag, XCircle } from "lucide-react"
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
import { getAllPosts } from "@/axios/post";
import { Post } from "@/types/post";

export default function AdminDashboard() {
  const { authenticatedUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  const [showPreviewImage, setShowPreviewImage] = useState<boolean>(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
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

  const handleViewPreviewImage = (base64: string) => {
    setShowPreviewImage(true);
    setImageBase64(base64);
  }

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

  const fetchPosts = async () => {
    const response = await getAllPosts();
    console.log(response);
    setPosts(response);
  }

  useEffect(() => {
    fetchUsers();
    fetchCategories();
    fetchPosts();
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
        <TabsList className="grid w-full grid-cols-3 dark:bg-gray-800">
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
          <TabsTrigger
            value="posts"
            className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
          >
            Posts Management
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

        <TabsContent value="posts" className="space-y-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="dark:text-white">Posts Management</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      placeholder="Search posts..."
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
              <div className="space-y-4">
                {posts && posts.map && posts.map((post) => (
                  <div
                    key={post.id}
                    className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      {/* Post Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg dark:text-white">{post.title}</h3>
                          <div className="flex gap-2">
                            <Badge
                              variant={
                                post.status === 1 ? "default" : post.status === 2 ? "secondary" : "destructive"
                              }
                            >
                              {post.status === 1 ? "Active" : post.status === 2 ? "Sold" : "Inactive"}
                            </Badge>
                            <Badge variant="outline">
                              {post.type === 1 ? "Sell" : post.type === 2 ? "Buy" : "Exchange"}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                          {post.description}
                        </p>

                        {/* Post Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span className="font-semibold text-green-600 dark:text-green-400">${post.price}</span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <MapPin className="w-4 h-4 mr-1" />
                            {post.campus}
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(post.createdAt)}
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <FileText className="w-4 h-4 mr-1" />
                            {post.images.length} image{post.images.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>

                      {/* Categories */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</h4>
                        <div className="flex flex-wrap gap-1">
                          {post.postCategories.map((pc) => (
                            <Badge key={pc.id} variant="secondary" className="text-xs">
                              <Tag className="w-3 h-3 mr-1" />
                              {pc.category.name}
                            </Badge>
                          ))}
                        </div>

                        {/* Images Preview */}
                        {post.images.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Images</h4>
                            <div className="flex flex-wrap gap-1">
                              {post.images.slice(0, 3).map((image, index) => (
                                <button
                                  key={image.id}
                                  onClick={() => handleViewPreviewImage(image.imageBase64)}
                                  className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded border flex items-center justify-center text-xs text-gray-500 dark:text-gray-400"
                                >
                                  {index + 1}
                                </button>
                              ))}
                              {post.images.length > 3 && (
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded border flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
                                  +{post.images.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm" className="bg-transparent">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`bg-transparent ${post.status === 1 ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"}`}
                        >
                          {post.status === 1 ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 dark:text-red-400 bg-transparent">
                          <XCircle className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>

                    {/* Timestamps */}
                    <div className="mt-4 pt-3 border-t dark:border-gray-600 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Created: {post.createdAt.toLocaleString()}</span>
                      <span>Updated: {post.updatedAt.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-300">Showing 1-4 of 4 posts</div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled className="bg-transparent">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" disabled className="bg-transparent">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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

        {showPreviewImage && imageBase64 && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setShowPreviewImage(false)}
          >
            <div
              className="max-w-full max-h-full p-4"
              onClick={(e) => e.stopPropagation()} // Prevent closing on image click
            >
              <img
                src={imageBase64}
                alt="Preview"
                className="max-w-full max-h-[80vh] rounded-lg shadow-lg"
              />
              <button
                onClick={() => setShowPreviewImage(false)}
                className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  )
}
