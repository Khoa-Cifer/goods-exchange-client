'use client';

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react";
import { Post } from "@/types/post";
import { getPostsByUser } from "@/axios/post";
import { PostCard } from "@/components/post-card";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/mock-categories";

export default function SellerDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);

  const getSellerPosts = async () => {
    const response = await getPostsByUser();
    setPosts(response);
  }

  useEffect(() => {
    getSellerPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              showLoginPrompt={false}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
