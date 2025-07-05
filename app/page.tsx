"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Store, ArrowRight, Search, MapPin, Star, Heart, MessageCircle } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import { UserDropdown } from "@/components/user-dropdown"

// Mock data for featured items
const featuredItems = [
  {
    id: 1,
    title: "MacBook Pro 2021",
    price: 1200,
    location: "New York, NY",
    seller: "TechSeller",
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=200",
    category: "Electronics",
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
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
    featured: true,
  },
]

const categories = ["Electronics", "Fashion", "Sports", "Furniture", "Music", "Books", "Home"]

export default function HomePage() {
  const { accessToken, user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Exchange Marketplace</h1>
              <p className="text-gray-600 dark:text-gray-300">Buy and sell amazing items</p>
            </div>
            <div className="flex gap-4 items-center">
              <ThemeToggle />
              <Link href="/login">
                {accessToken && user ? (
                  <UserDropdown user={user} onLogout={logout} />
                ) : (
                  <Link href="/login">
                    <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                      Sign In
                    </Button>
                  </Link>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Discover Amazing Items
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Browse thousands of items from trusted sellers. Find exactly what you're looking for or discover something
              new.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search for items, brands, or categories..."
                  className="pl-12 h-14 text-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <Button className="absolute right-2 top-2 h-10 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Shop by Category</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section id="browse-items" className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Items</h3>
            <Link href="/login">
              <Button variant="outline" className="bg-transparent">
                View All Items
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <Card
                key={item.id}
                className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-700 dark:border-gray-600"
              >
                <CardHeader className="p-0 relative">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2 p-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Redirect to login for unauthorized users
                      window.location.href = "/login"
                    }}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Badge className="absolute top-2 left-2 bg-blue-600 text-white">Featured</Badge>
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
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-500" />
                      {item.rating}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Link href="/login" className="flex-1">
                      <Button className="w-full">View Details</Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent"
                      onClick={() => {
                        // Redirect to login for unauthorized users
                        window.location.href = "/login"
                      }}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <Link href="/login">
              <Button variant="outline" size="lg" className="bg-transparent">
                View More Items
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users buying and selling on our platform. Sign in with Google to get started in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Store className="w-5 h-5 mr-2" />
                Start Selling Today
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Sign In to Shop
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">50K+</div>
              <div className="text-gray-600 dark:text-gray-300">Items Listed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">25K+</div>
              <div className="text-gray-600 dark:text-gray-300">Successful Sales</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">4.8★</div>
              <div className="text-gray-600 dark:text-gray-300">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-700 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Exchange Marketplace</h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Connect buyers and sellers in a seamless exchange platform
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
              <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                About
              </Link>
              <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                Terms
              </Link>
              <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                Privacy
              </Link>
              <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400">
                Support
              </Link>
              <Link href="/admin" className="hover:text-blue-600 dark:hover:text-blue-400">
                Admin
              </Link>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
              © 2024 Exchange Marketplace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
