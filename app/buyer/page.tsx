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
import { PostCard } from "@/components/post-card";
import { mockPosts } from "@/data/mock-posts";

const categories = ["All", "Electronics", "Fashion", "Sports", "Furniture", "Music", "Books", "Home"]

export default function BuyerDashboard() {
  return (
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
        {mockPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            showLoginPrompt={false}
            onContact={(post) => console.log("Contact seller for:", post.title)}
            onFavorite={(post) => console.log("Added to favorites:", post.title)}
          />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <Button variant="outline" size="lg" className="bg-transparent">
          Load More Items
        </Button>
      </div>
    </div>
  )
}
