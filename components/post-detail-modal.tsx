"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, MapPin, User, Tag, Heart, MessageCircle, Share2, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import type { Post } from "@/types/post"

interface PostDetailModalProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
  onContact?: () => void
  onFavorite?: () => void
}

export function PostDetailModal({ post, isOpen, onClose, onContact, onFavorite }: PostDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!post) return null

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

  const nextImage = () => {
    if (post.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % post.images.length)
    }
  }

  const prevImage = () => {
    if (post.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold dark:text-white">{post.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            {post.images.length > 0 ? (
              <div className="relative">
                <div className="flex justify-center items-center aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden w-full h-full">
                  {post.images[currentImageIndex]?.imageBase64 ? (
                    <img
                      src={post.images[currentImageIndex].imageBase64}
                      alt={`${post.title} - Image ${currentImageIndex + 1}`}
                      className="object-contain w-[90%] h-[90%]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src="/placeholder.svg?height=400&width=400"
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Image Navigation */}
                {post.images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                      {post.images.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt={post.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}

            {/* Thumbnail Strip */}
            {post.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {post.images.map((image, index) => (
                  <button
                    key={image.id}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${index === currentImageIndex ? "border-blue-500" : "border-gray-200 dark:border-gray-600"
                      }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    {image.imageBase64 ? (
                      <img
                        src={`data:image/jpeg;base64,${image.imageBase64}`}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-xs text-gray-500">{index + 1}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Post Details */}
          <div className="space-y-6">
            {/* Price and Status */}
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                ${post.price.toLocaleString()}
              </div>
              <div className="flex gap-2">
                {getStatusBadge(post.status)}
                {getTypeBadge(post.type)}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Description</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{post.description}</p>
            </div>

            <Separator className="dark:bg-gray-600" />

            {/* Post Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold dark:text-white">Details</h3>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="dark:text-white">{post.campus}</span>
                </div>

                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <div>
                    <div className="dark:text-white text-sm">Username: {post.user.username}</div>
                    <div className="dark:text-white text-sm">Email: {post.user.email}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="dark:text-white">Posted: {new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                {post.updatedAt !== post.createdAt && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="dark:text-white">Updated: {new Date(post.updatedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Categories */}
            {post.postCategories.length > 0 && (
              <>
                <Separator className="dark:bg-gray-600" />
                <div>
                  <h3 className="text-lg font-semibold mb-3 dark:text-white">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.postCategories.map((pc) => (
                      <Badge key={pc.id} variant="secondary" className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {pc.category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1" onClick={onContact} disabled={post.status !== 1}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
              <Button variant="outline" onClick={onFavorite} className="bg-transparent">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="bg-transparent">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {post.status !== 1 && (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {post.status === 2 ? "This item has been sold" : "This listing is currently inactive"}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
