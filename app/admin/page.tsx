'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, XCircle, CheckCircle, Package } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { assignRoleToUser, banUser, getAllPosts, getAllReports, getAllRequests, unassignRoleToUser, unbanUser } from "@/axios/admin";
import { User } from "@/types/user";
import { formatDate, getStatusBadge } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { showNotification } from "@/components/notification-helper";
import { useAuth } from "@/context/auth-context";
import { Category } from "@/types/category";
import { Post } from "@/types/post";
import { AdminPostCard } from "@/components/admin-post-card";
import { PostStatus } from "@/enum/post-status";
import { getAllUsers } from "@/axios/user";
import { getAllCategories } from "@/axios/category";
import { Request } from "@/types/request";

export default function AdminDashboard() {
  const { authenticatedUser } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

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

  const handleViewPreviewImage = (base64Image: string) => {
    setShowPreviewImage(true);
    setImageBase64(base64Image);
  }

  const handleUpdatePost = (updatedPost: Post) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === updatedPost.id ? { ...post, status: updatedPost.status } : post
      )
    );
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
    setPosts(response);
  }

  const fetchUserRequests = async () => {
    const response = await getAllRequests();
    setRequests(response);
    console.log(response);
  }

  const fetchUserReports = async () => {
    const response = await getAllReports();
    setReports(response);
    console.log(response);
  }

  useEffect(() => {
    fetchUsers();
    fetchCategories();
    fetchPosts();
    fetchUserRequests();
    fetchUserReports();
  }, []);

  const handleActivate = async (user: User) => {
    const response = await unbanUser(user.id);
    if (response) {
      showNotification.success("Unban successfully", "Reload the user list.")
    }
  }

  const handleSuspend = async (user: User) => {
    const response = await banUser(user.id);
    if (response) {
      showNotification.success("Ban successfully", "Reload the user list.")
    }
  }

  const handleApproveRequest = (request: Request) => {
  }

  const handleRejectRequest = (request: Request) => {
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-5 dark:bg-gray-800">
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
            Post Management
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
          >
            User Request
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
          >
            User Report
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
                <CardTitle className="dark:text-white">Post Management</CardTitle>
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
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-6 mb-6 dark:bg-gray-700">
                    <TabsTrigger
                      value="all"
                      className="dark:text-gray-300 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white"
                    >
                      All Posts ({posts.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="created"
                      className="dark:text-gray-300 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white"
                    >
                      Created ({posts.filter((p) => p.status === PostStatus.Created).length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="confirmed"
                      className="dark:text-gray-300 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white"
                    >
                      Confirmed ({posts.filter((p) => p.status === PostStatus.Confirmed).length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="completed"
                      className="dark:text-gray-300 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white"
                    >
                      Completed ({posts.filter((p) => p.status === PostStatus.Completed).length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="rejected"
                      className="dark:text-gray-300 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white"
                    >
                      Rejected ({posts.filter((p) => p.status === PostStatus.Rejected).length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="hidden"
                      className="dark:text-gray-300 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white"
                    >
                      Hidden ({posts.filter((p) => p.status === PostStatus.Hidden).length})
                    </TabsTrigger>
                  </TabsList>

                  {/* All Posts */}
                  <TabsContent value="all" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold dark:text-white">All Posts</h3>
                      <div className="flex gap-2">
                        <Badge variant="default">{posts.length} Total</Badge>
                        <Badge variant="secondary">{posts.filter((p) => p.status === PostStatus.Created).length} Created</Badge>
                        <Badge variant="secondary">{posts.filter((p) => p.status === PostStatus.Confirmed).length} Confirmed</Badge>
                        <Badge variant="secondary">{posts.filter((p) => p.status === PostStatus.Completed).length} Completed</Badge>
                        <Badge variant="destructive">{posts.filter((p) => p.status === PostStatus.Rejected).length} Rejected</Badge>
                        <Badge variant="destructive">{posts.filter((p) => p.status === PostStatus.Hidden).length} Hidden</Badge>
                      </div>
                    </div>
                    {posts && posts.map && posts
                      .map((post) => (
                        <AdminPostCard
                          key={post.id} post={post}
                          onSelectPreviewImage={handleViewPreviewImage}
                          onUpdatePost={handleUpdatePost} />
                      ))}
                  </TabsContent>

                  <TabsContent value="created" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold dark:text-white">Active Posts</h3>
                      <Badge variant="secondary">{posts.filter((p) => p.status === PostStatus.Created).length} Posts</Badge>
                    </div>
                    {posts && posts.map && posts
                      .filter((post) => post.status === PostStatus.Created)
                      .map((post) => (
                        <AdminPostCard key={post.id} post={post} onSelectPreviewImage={handleViewPreviewImage} onUpdatePost={handleUpdatePost} />
                      ))}
                    {posts.filter((post) => post.status === PostStatus.Created).length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No active posts found</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="confirmed" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold dark:text-white">Confirmed Posts</h3>
                      <Badge variant="secondary">{posts.filter((p) => p.status === PostStatus.Confirmed).length} Posts</Badge>
                    </div>
                    {posts && posts.map && posts
                      .filter((post) => post.status === PostStatus.Confirmed)
                      .map((post) => (
                        <AdminPostCard key={post.id} post={post} onSelectPreviewImage={handleViewPreviewImage} onUpdatePost={handleUpdatePost} />
                      ))}
                    {posts.filter((post) => post.status === PostStatus.Confirmed).length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No sold posts found</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold dark:text-white">Completed Posts</h3>
                      <Badge variant="secondary">{posts.filter((p) => p.status === PostStatus.Completed).length} Posts</Badge>
                    </div>
                    {posts && posts.map && posts
                      .filter((post) => post.status === PostStatus.Completed)
                      .map((post) => (
                        <AdminPostCard key={post.id} post={post} onSelectPreviewImage={handleViewPreviewImage} onUpdatePost={handleUpdatePost} />
                      ))}
                    {posts.filter((post) => post.status === PostStatus.Completed).length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No sold posts found</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="rejected" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold dark:text-white">Rejected Posts</h3>
                      <Badge variant="destructive">{posts.filter((p) => p.status === PostStatus.Rejected).length} Posts</Badge>
                    </div>
                    {posts && posts.map && posts
                      .filter((post) => post.status === PostStatus.Rejected)
                      .map((post) => (
                        <AdminPostCard key={post.id} post={post} onSelectPreviewImage={handleViewPreviewImage} onUpdatePost={handleUpdatePost} />
                      ))}
                    {posts.filter((post) => post.status === PostStatus.Rejected).length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <XCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No inactive posts found</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="hidden" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold dark:text-white">Hidden Posts</h3>
                      <Badge variant="destructive">{posts.filter((p) => p.status === PostStatus.Hidden).length} Posts</Badge>
                    </div>
                    {posts && posts.map && posts
                      .filter((post) => post.status === PostStatus.Hidden)
                      .map((post) => (
                        <AdminPostCard key={post.id} post={post} onSelectPreviewImage={handleViewPreviewImage} onUpdatePost={handleUpdatePost} />
                      ))}
                    {posts.filter((post) => post.status === PostStatus.Hidden).length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <XCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No inactive posts found</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="dark:text-white">User Request</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b dark:border-gray-700">
                      <th className="text-left text-sm py-3 px-4 dark:text-white">User</th>
                      <th className="text-left text-sm py-3 px-4 dark:text-white">Request Description</th>
                      <th className="text-left text-sm py-3 px-4 dark:text-white">Type</th>
                      <th className="text-left text-sm py-3 px-4 dark:text-white">Response</th>
                      <th className="text-left text-sm py-3 px-4 dark:text-white">Status</th>
                      <th className="text-left text-sm py-3 px-4 dark:text-white">Created At</th>
                      <th className="text-left text-sm py-3 px-4 dark:text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests && requests.length > 0 && requests.map && requests.map((request) => (
                      <tr
                        key={request.id}
                        className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium dark:text-white">{request.user.username}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{request.user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{request.description}</td>
                        <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">{request.requestType.type}</td>
                        <td className="py-3 px-4 text-sm dark:text-white">{request.response && request.response?.length > 0 ? request.response : "No response yet"}</td>
                        <td className="py-3 px-4 text-sm dark:text-white">{getStatusBadge(request.status)}</td>
                        <td className="py-3 px-4 text-sm dark:text-white">{formatDate(request.createdAt)}</td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="bg-dark:bg-gray-700 dark:text-white">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem
                                onClick={() => handleApproveRequest(request)}
                                className="text-blue-600 dark:text-blue-400">
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleRejectRequest(request)}
                                className="text-red-600 dark:text-red-400">
                                Reject
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="dark:text-white">User Report</CardTitle>
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
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-6 mb-6 dark:bg-gray-700">
                    <TabsTrigger
                      value="all"
                      className="dark:text-gray-300 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white"
                    >
                      All Posts ({posts.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="created"
                      className="dark:text-gray-300 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white"
                    >
                      Created ({posts.filter((p) => p.status === PostStatus.Created).length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="confirmed"
                      className="dark:text-gray-300 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white"
                    >
                      Confirmed ({posts.filter((p) => p.status === PostStatus.Confirmed).length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="completed"
                      className="dark:text-gray-300 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white"
                    >
                      Completed ({posts.filter((p) => p.status === PostStatus.Completed).length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="rejected"
                      className="dark:text-gray-300 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white"
                    >
                      Rejected ({posts.filter((p) => p.status === PostStatus.Rejected).length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="hidden"
                      className="dark:text-gray-300 dark:data-[state=active]:bg-gray-600 dark:data-[state=active]:text-white"
                    >
                      Hidden ({posts.filter((p) => p.status === PostStatus.Hidden).length})
                    </TabsTrigger>
                  </TabsList>

                  {/* All Posts */}
                  <TabsContent value="all" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold dark:text-white">All Posts</h3>
                      <div className="flex gap-2">
                        <Badge variant="default">{posts.length} Total</Badge>
                        <Badge variant="secondary">{posts.filter((p) => p.status === PostStatus.Created).length} Created</Badge>
                        <Badge variant="secondary">{posts.filter((p) => p.status === PostStatus.Confirmed).length} Confirmed</Badge>
                        <Badge variant="secondary">{posts.filter((p) => p.status === PostStatus.Completed).length} Completed</Badge>
                        <Badge variant="destructive">{posts.filter((p) => p.status === PostStatus.Rejected).length} Rejected</Badge>
                        <Badge variant="destructive">{posts.filter((p) => p.status === PostStatus.Hidden).length} Hidden</Badge>
                      </div>
                    </div>
                    {posts && posts.map && posts
                      .map((post) => (
                        <AdminPostCard
                          key={post.id} post={post}
                          onSelectPreviewImage={handleViewPreviewImage}
                          onUpdatePost={handleUpdatePost} />
                      ))}
                  </TabsContent>

                  <TabsContent value="created" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold dark:text-white">Active Posts</h3>
                      <Badge variant="secondary">{posts.filter((p) => p.status === PostStatus.Created).length} Posts</Badge>
                    </div>
                    {posts && posts.map && posts
                      .filter((post) => post.status === PostStatus.Created)
                      .map((post) => (
                        <AdminPostCard key={post.id} post={post} onSelectPreviewImage={handleViewPreviewImage} onUpdatePost={handleUpdatePost} />
                      ))}
                    {posts.filter((post) => post.status === PostStatus.Created).length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No active posts found</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="confirmed" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold dark:text-white">Confirmed Posts</h3>
                      <Badge variant="secondary">{posts.filter((p) => p.status === PostStatus.Confirmed).length} Posts</Badge>
                    </div>
                    {posts && posts.map && posts
                      .filter((post) => post.status === PostStatus.Confirmed)
                      .map((post) => (
                        <AdminPostCard key={post.id} post={post} onSelectPreviewImage={handleViewPreviewImage} onUpdatePost={handleUpdatePost} />
                      ))}
                    {posts.filter((post) => post.status === PostStatus.Confirmed).length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No sold posts found</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="completed" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold dark:text-white">Completed Posts</h3>
                      <Badge variant="secondary">{posts.filter((p) => p.status === PostStatus.Completed).length} Posts</Badge>
                    </div>
                    {posts && posts.map && posts
                      .filter((post) => post.status === PostStatus.Completed)
                      .map((post) => (
                        <AdminPostCard key={post.id} post={post} onSelectPreviewImage={handleViewPreviewImage} onUpdatePost={handleUpdatePost} />
                      ))}
                    {posts.filter((post) => post.status === PostStatus.Completed).length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No sold posts found</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="rejected" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold dark:text-white">Rejected Posts</h3>
                      <Badge variant="destructive">{posts.filter((p) => p.status === PostStatus.Rejected).length} Posts</Badge>
                    </div>
                    {posts && posts.map && posts
                      .filter((post) => post.status === PostStatus.Rejected)
                      .map((post) => (
                        <AdminPostCard key={post.id} post={post} onSelectPreviewImage={handleViewPreviewImage} onUpdatePost={handleUpdatePost} />
                      ))}
                    {posts.filter((post) => post.status === PostStatus.Rejected).length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <XCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No inactive posts found</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="hidden" className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold dark:text-white">Hidden Posts</h3>
                      <Badge variant="destructive">{posts.filter((p) => p.status === PostStatus.Hidden).length} Posts</Badge>
                    </div>
                    {posts && posts.map && posts
                      .filter((post) => post.status === PostStatus.Hidden)
                      .map((post) => (
                        <AdminPostCard key={post.id} post={post} onSelectPreviewImage={handleViewPreviewImage} onUpdatePost={handleUpdatePost} />
                      ))}
                    {posts.filter((post) => post.status === PostStatus.Hidden).length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <XCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No inactive posts found</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
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
