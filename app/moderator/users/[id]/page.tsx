import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Star, Package, MessageCircle } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

// Mock user data
const userData = {
  id: 1,
  name: "John Smith",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  role: "seller",
  status: "active",
  joinDate: "2024-01-15",
  lastActive: "2024-01-16 14:30",
  rating: 4.8,
  totalRatings: 156,
  itemsListed: 12,
  itemsSold: 8,
  totalEarnings: 2450,
  avatar: "/placeholder.svg?height=100&width=100",
}

const userItems = [
  {
    id: 1,
    title: "MacBook Pro 2021",
    price: 1200,
    status: "active",
    views: 45,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 2,
    title: "iPhone 14",
    price: 800,
    status: "sold",
    views: 120,
    image: "/placeholder.svg?height=100&width=100",
  },
]

const userActivity = [
  { action: "Listed new item: MacBook Pro 2021", date: "2024-01-16 10:30" },
  { action: "Sold item: iPhone 14", date: "2024-01-15 16:45" },
  { action: "Updated profile information", date: "2024-01-14 09:15" },
  { action: "Received 5-star rating", date: "2024-01-13 14:20" },
]

export default function UserDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline" size="sm" className="bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Admin
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Profile</h1>
                <p className="text-gray-600 dark:text-gray-300">Detailed user information and activity</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info Sidebar */}
          <div className="space-y-6">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="text-center">
                  <img
                    src={userData.avatar || "/placeholder.svg"}
                    alt={userData.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <h2 className="text-xl font-bold dark:text-white">{userData.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{userData.email}</p>
                  <div className="flex justify-center gap-2 mb-4">
                    <Badge variant={userData.role === "seller" ? "default" : "secondary"}>{userData.role}</Badge>
                    <Badge variant={userData.status === "active" ? "default" : "destructive"}>{userData.status}</Badge>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button size="sm" variant="outline" className="bg-transparent">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 dark:text-red-400 bg-transparent">
                      {userData.status === "active" ? "Suspend" : "Activate"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-white">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm dark:text-white">{userData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm dark:text-white">{userData.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm dark:text-white">Joined {userData.joinDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm dark:text-white">
                    {userData.rating} ({userData.totalRatings} reviews)
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 dark:bg-gray-800">
                <TabsTrigger
                  value="overview"
                  className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="items"
                  className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
                >
                  Items
                </TabsTrigger>
                <TabsTrigger
                  value="activity"
                  className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
                >
                  Activity
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="dark:text-gray-300 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white"
                >
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Items Listed</p>
                          <p className="text-2xl font-bold dark:text-white">{userData.itemsListed}</p>
                        </div>
                        <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Items Sold</p>
                          <p className="text-2xl font-bold dark:text-white">{userData.itemsSold}</p>
                        </div>
                        <Star className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="dark:bg-gray-800 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Total Earnings</p>
                          <p className="text-2xl font-bold dark:text-white">${userData.totalEarnings}</p>
                        </div>
                        <MessageCircle className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {userActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b dark:border-gray-700 last:border-b-0"
                        >
                          <span className="text-sm dark:text-white">{activity.action}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{activity.date}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="items" className="space-y-6">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="dark:text-white">User's Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h3 className="font-medium dark:text-white">{item.title}</h3>
                              <p className="text-lg font-bold text-green-600 dark:text-green-400">${item.price}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={item.status === "active" ? "default" : "secondary"}>
                                  {item.status}
                                </Badge>
                                <span className="text-sm text-gray-600 dark:text-gray-300">{item.views} views</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="bg-transparent">
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 dark:text-red-400 bg-transparent"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity" className="space-y-6">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Activity Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 border dark:border-gray-700 rounded-lg">
                          <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <p className="text-sm dark:text-white">{activity.action}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="dark:text-white">Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 border dark:border-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium dark:text-white">Account Status</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Current status: {userData.status}</p>
                      </div>
                      <Button variant="outline" className="text-red-600 dark:text-red-400 bg-transparent">
                        {userData.status === "active" ? "Suspend Account" : "Activate Account"}
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-3 border dark:border-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium dark:text-white">Email Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Manage user's notification preferences
                        </p>
                      </div>
                      <Button variant="outline" className="bg-transparent">
                        Configure
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-3 border dark:border-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium dark:text-white">Data Export</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Export user's data for compliance</p>
                      </div>
                      <Button variant="outline" className="bg-transparent">
                        Export Data
                      </Button>
                    </div>

                    <div className="flex justify-between items-center p-3 border border-red-200 dark:border-red-800 rounded-lg">
                      <div>
                        <p className="font-medium text-red-600 dark:text-red-400">Delete Account</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Permanently delete this user account</p>
                      </div>
                      <Button variant="destructive">Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
