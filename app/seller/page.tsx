'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Package, Eye, MessageCircle, TrendingUp } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

// Mock data for seller's items
const sellerItems = [
  {
    id: 1,
    title: "Vintage Camera",
    price: 250,
    status: "active",
    views: 45,
    messages: 3,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    title: "Gaming Laptop",
    price: 800,
    status: "sold",
    views: 120,
    messages: 8,
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    title: "Bicycle",
    price: 150,
    status: "active",
    views: 23,
    messages: 1,
    image: "/placeholder.svg?height=200&width=200",
  },
]

export default function SellerDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Items</p>
                <p className="text-2xl font-bold dark:text-white">12</p>
              </div>
              <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Active Listings</p>
                <p className="text-2xl font-bold dark:text-white">8</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Views</p>
                <p className="text-2xl font-bold dark:text-white">1,234</p>
              </div>
              <Eye className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Messages</p>
                <p className="text-2xl font-bold dark:text-white">23</p>
              </div>
              <MessageCircle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold dark:text-white">Your Listings</h2>
        <Link href="/seller/add-item">
          <Button className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600">
            <Plus className="w-4 h-4 mr-2" />
            Add New Item
          </Button>
        </Link>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sellerItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="p-0">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg dark:text-white">{item.title}</CardTitle>
                <Badge variant={item.status === "active" ? "default" : "secondary"}>{item.status}</Badge>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">${item.price}</p>

              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {item.views} views
                </span>
                <span className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {item.messages} messages
                </span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
