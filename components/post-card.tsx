"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, MapPin, Calendar, Tag, Eye } from "lucide-react"
import { useState } from "react"
import type { Post } from "@/types/post"
import { showNotification } from "@/components/notification-helper"
import { PostDetailModal } from "./post-detail-modal"
import { useAuth } from "@/context/auth-context"
import { PostStatus } from "@/enum/post-status"
import { ChatModal } from "./chat-modal"

interface PostCardProps {
  post: Post
  showLoginPrompt?: boolean
  onContact?: (post: Post) => void
  onFavorite?: (post: Post) => void
}

export function PostCard({ post, showLoginPrompt = false }: PostCardProps) {
  const { authenticatedUser } = useAuth();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <Badge variant="default" className="bg-green-600">
            Active
          </Badge>
        )
      case 2:
        return <Badge variant="secondary">Sold</Badge>
      default:
        return <Badge variant="destructive">Inactive</Badge>
    }
  }

  const getTypeBadge = (type: number) => {
    switch (type) {
      case 1:
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            For Sale
          </Badge>
        )
      case 2:
        return (
          <Badge variant="outline" className="border-purple-500 text-purple-600">
            Looking For
          </Badge>
        )
      case 3:
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-600">
            Exchange
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (showLoginPrompt) {
      showNotification.warning("Sign In Required", "Please sign in to view full details.")
      setTimeout(() => {
        window.location.href = "/login"
      }, 1500)
      return
    }
    setIsDetailModalOpen(true)
    showNotification.success("Loading Details", `Loading full details for ${post.title}`)
  }

  const primaryImage = post.images[0]

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-700 dark:border-gray-600">
        <CardHeader className="p-0 relative w-full h-48 justify-center">
          {primaryImage?.imageBase64 ? (
            <img
              src={primaryImage.imageBase64}
              alt={post.title}
              className="object-cover rounded-t-lg"
            />
          ) : (
            <img
              src="/placeholder.svg?height=200&width=200"
              alt={post.title}
              className="object-cover rounded-t-lg"
            />
          )}

          {/* Status and Type Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {getStatusBadge(post.status)}
            {getTypeBadge(post.type)}
          </div>

          {/* Image Count Badge */}
          {post.images.length > 1 && (
            <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">{post.images.length} photos</Badge>
          )}
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg dark:text-white line-clamp-1">{post.title}</CardTitle>
          </div>

          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">${post.price.toLocaleString()}</p>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{post.description}</p>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            {post.campus}
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(post.createdAt).toLocaleDateString()}
          </div>

          {/* Categories */}
          {post.postCategories.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.postCategories.slice(0, 2).map((pc) => (
                <Badge key={pc.id} variant="secondary" className="text-xs">
                  <Tag className="w-3 h-3 mr-1" />
                  {pc.category.name}
                </Badge>
              ))}
              {post.postCategories.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{post.postCategories.length - 2} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleViewDetails}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-transparent"
              onClick={() => setIsChatModalOpen(true)}
              disabled={post.status !== PostStatus.Confirmed || !authenticatedUser}
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <PostDetailModal
        post={post}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <ChatModal post={post} isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />
    </>
  )
}
