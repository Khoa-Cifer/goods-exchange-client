"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  MapPin,
  Calendar,
  Tag,
  Eye,
  Flag,
  MoreVertical,
  CircleCheckBig,
} from "lucide-react";
import { useState } from "react";
import { Post } from "@/types/post";
import { PostDetailModal } from "@/components/post-detail-modal";
import { showNotification } from "@/components/notification-helper";
import { ChatButton } from "@/components/chat-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PostStatus } from "@/enum/post-status";
import { ReportModal } from "./report-modal";
import { useAuth } from "@/context/auth-context";
import { PostType } from "@/enum/post-type";

interface PostCardProps {
  post: Post;
  showLoginPrompt?: boolean;
}

export function PostCard({ post, showLoginPrompt = false }: PostCardProps) {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const { authenticatedUser } = useAuth();

  const getStatusBadge = (status: number) => {
    switch (status) {
      case PostStatus.Confirmed:
        return <Badge variant="secondary">Active</Badge>;
      case PostStatus.Completed:
        return <Badge variant="secondary">Sold</Badge>;
      default:
        return <Badge variant="destructive">Inactive</Badge>;
    }
  };

  const getTypeBadge = (type: number) => {
    switch (type) {
      case PostType.Sell:
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            For Sale
          </Badge>
        );
      case PostType.Trade:
        return (
          <Badge
            variant="outline"
            className="border-purple-500 text-purple-600"
          >
            Trade
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleInteraction = () => {
    if (showLoginPrompt) {
      showNotification.warning(
        "Sign In Required",
        "Please sign in to continue with this action."
      );
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showLoginPrompt) {
      showNotification.warning(
        "Sign In Required",
        "Please sign in to view full details."
      );
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }
    setIsDetailModalOpen(true);
    showNotification.success(
      "Loading Details",
      `Loading full details for ${post.title}`
    );
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showLoginPrompt) {
      showNotification.warning(
        "Sign In Required",
        "Please sign in to report posts."
      );
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }
    setIsReportModalOpen(true);
  };

  const primaryImage = post.images[0];

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-gray-700 dark:border-gray-600">
        <CardHeader className="p-0 relative">
          {primaryImage?.imageBase64 ? (
            <img
              src={post.images[0].imageBase64}
              alt={post.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          ) : (
            <img
              src="/placeholder.svg?height=200&width=200"
              alt={post.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex gap-1">
            {/* More Actions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  className="p-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="dark:bg-gray-800 dark:border-gray-700"
              >
                {authenticatedUser && authenticatedUser.sub === post.userId ? (
                  <DropdownMenuItem
                    onClick={() => setIsReportModalOpen(true)}
                    className="text-green-600 dark:text-green-400 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <CircleCheckBig className="w-4 h-4 mr-2" />
                    Make post as complete
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={handleReport}
                    className="text-red-600 dark:text-red-400 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Report Post
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status and Type Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {getStatusBadge(post.status)}
            {getTypeBadge(post.type)}
          </div>

          {/* Image Count Badge */}
          {post.images.length > 1 && (
            <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
              {post.images.length} photos
            </Badge>
          )}
        </CardHeader>

        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-lg dark:text-white line-clamp-1">
              {post.title}
            </CardTitle>
          </div>

          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
            ${post.price.toLocaleString()}
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
            {post.description}
          </p>

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
            {showLoginPrompt ? (
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent"
                onClick={handleInteraction}
                disabled={post.status !== PostStatus.Confirmed}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            ) : (
              <ChatButton
                userId={post.userId}
                userName={`Seller of ${post.title}`}
                variant="outline"
                size="sm"
                className="bg-transparent"
              >
                <MessageCircle className="w-4 h-4" />
              </ChatButton>
            )}
          </div>
        </CardContent>
      </Card>

      <PostDetailModal
        post={post}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <ReportModal
        post={post}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </>
  );
}
