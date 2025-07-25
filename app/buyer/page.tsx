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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {confirmedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            showLoginPrompt={false}
          />
        ))}
      </div>
    </div>
  )
}
