'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Heart, MessageCircle, MapPin } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserDropdown } from "@/components/user-dropdown";
import { useAuth } from "@/context/auth-context";

// Mock data for available items
const availableItems = [
  {
    id: 1,
    title: "MacBook Pro 2021",
    price: 1200,
    location: "New York, NY",
    seller: "TechSeller",
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=200",
    category: "Electronics",
  },
  {
    id: 2,
    title: "Vintage Leather Jacket",
    price: 85,
    location: "Los Angeles, CA",
    seller: "VintageStyle",
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=200",
    category: "Fashion",
  },
  {
    id: 3,
    title: "Mountain Bike",
    price: 300,
    location: "Denver, CO",
    seller: "BikeExpert",
    rating: 4.7,
    image: "/placeholder.svg?height=200&width=200",
    category: "Sports",
  },
  {
    id: 4,
    title: "Coffee Table",
    price: 120,
    location: "Chicago, IL",
    seller: "FurnitureHub",
    rating: 4.6,
    image: "/placeholder.svg?height=200&width=200",
    category: "Furniture",
  },
  {
    id: 5,
    title: "Guitar Acoustic",
    price: 200,
    location: "Austin, TX",
    seller: "MusicLover",
    rating: 4.9,
    image: "/placeholder.svg?height=200&width=200",
    category: "Music",
  },
  {
    id: 6,
    title: "Designer Handbag",
    price: 450,
    location: "Miami, FL",
    seller: "LuxuryItems",
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=200",
    category: "Fashion",
  },
]

const categories = ["All", "Electronics", "Fashion", "Sports", "Furniture", "Music", "Books", "Home"]

export default function BuyerDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
              <p className="text-gray-600 dark:text-gray-300">Discover amazing items from sellers</p>
            </div>
            <div className="flex gap-4">
              <ThemeToggle />
              {user && (
                <UserDropdown user={user} onLogout={logout} />
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 border dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search for items..."
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "All" ? "default" : "secondary"}
                className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableItems.map((item) => (
            <Card
              key={item.id}
              className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700"
            >
              <CardHeader className="p-0 relative">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Button size="sm" variant="secondary" className="absolute top-2 right-2 p-2">
                  <Heart className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg dark:text-white">{item.title}</CardTitle>
                  <Badge variant="outline">{item.category}</Badge>
                </div>

                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">${item.price}</p>

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {item.location}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <span>Seller: {item.seller}</span>
                  <span className="flex items-center">⭐ {item.rating}</span>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1">View Details</Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="bg-transparent">
            Load More Items
          </Button>
        </div>
      </div>
    </div>
  )
}
