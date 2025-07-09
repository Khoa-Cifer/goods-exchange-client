'use client';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"
import { PostCard } from "@/components/post-card";
import { useEffect, useState } from "react";
import { getPostsByStatus } from "@/axios/post";
import { PostStatus } from "@/enum/post-status";
import { Post } from "@/types/post";

const categories = ["All", "Electronics", "Fashion", "Sports", "Furniture", "Music", "Books", "Home"]

export default function BuyerDashboard() {
  const [confirmedPosts, setConfirmedPosts] = useState<Post[]>([]);

  const getConfirmedPost = async () => {
    const response = await getPostsByStatus(PostStatus.Confirmed);
    console.log(response);
    setConfirmedPosts(response);
  }

  useEffect(() => {
    getConfirmedPost();
  }, []);

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
        {confirmedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            showLoginPrompt={false}
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
