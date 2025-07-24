"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  User,
  Tag,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Flag,
  MoreVertical,
  CircleCheckBig,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Post } from "@/types/post";
import { ChatButton } from "@/components/chat-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportModal } from "./report-modal";
import { PostStatus } from "@/enum/post-status";
import { useAuth } from "@/context/auth-context";
import { Rating } from "./rating";
import { formatDate } from "@/lib/utils";
import { Comment } from "@/types/comment";
import { Textarea } from "./ui/textarea";
import { createComment, getCommentsByPost } from "@/axios/post";

interface PostDetailModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

const mockComments = [
  {
    id: "1",
    content: "Is this still available? I'm very interested!",
    userId: "user1",
    userName: "John Doe",
    userAvatar: "/placeholder.svg?height=32&width=32",
    postId: "1",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    content: "Great condition! Would you consider $80?",
    userId: "user2",
    userName: "Sarah Smith",
    postId: "1",
    createdAt: "2024-01-15T14:20:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
  },
  {
    id: "3",
    content: "Can you provide more details about the specifications?",
    userId: "user3",
    userName: "Mike Johnson",
    postId: "1",
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
  },
];

export function PostDetailModal({
  post,
  isOpen,
  onClose,
}: PostDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const { authenticatedUser } = useAuth();

  if (!post) return null;

  const fetchPostComments = async () => {
    const response = await getCommentsByPost(post.id);
    setComments(response);
  }

  useEffect(() => {
    fetchPostComments();
  }, [])

  const handleRating = async () => { };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case PostStatus.Completed:
        return (
          <Badge variant="default" className="bg-green-600">
            Sold
          </Badge>
        );
      case PostStatus.Confirmed:
        return <Badge variant="secondary">Active</Badge>;
      default:
        return <Badge variant="destructive">Inactive</Badge>;
    }
  };

  const getTypeBadge = (type: number) => {
    switch (type) {
      case 1:
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            For Sale
          </Badge>
        );
      case 2:
        return (
          <Badge
            variant="outline"
            className="border-purple-500 text-purple-600"
          >
            Looking For
          </Badge>
        );
      case 3:
        return (
          <Badge
            variant="outline"
            className="border-orange-500 text-orange-600"
          >
            Exchange
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const nextImage = () => {
    if (post.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
    }
  };

  const prevImage = () => {
    if (post.images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + post.images.length) % post.images.length
      );
    }
  };

  const renderPostStatus = (currentPost: Post) => {
    if (currentPost.status === PostStatus.Confirmed) {
      return "This item is available";
    } else if (currentPost.status === PostStatus.Completed) {
      return "This item has been sold";
    } else {
      return "This listing is currently inactive";
    }
  };

  const handleSubmitComment = async (currentPost: Post) => {
    if (!newComment.trim()) return;
    setIsSubmittingComment(true);
    const response = await createComment(currentPost.id, newComment);
    setComments((prev) => [...prev, response]);
    setNewComment("");
    setIsSubmittingComment(false);
  };

  const handleCompletePost = (currentPost: Post) => { };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold dark:text-white">
                {post.title}
              </DialogTitle>

              {/* More Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="dark:bg-gray-800 dark:border-gray-700"
                >
                  {authenticatedUser &&
                    authenticatedUser.sub === post.userId ? (
                    <DropdownMenuItem
                      onClick={() => setIsReportModalOpen(true)}
                      className="text-green-600 dark:text-green-400 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <CircleCheckBig className="w-4 h-4 mr-2" />
                      Make post as complete
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => setIsReportModalOpen(true)}
                      className="text-red-600 dark:text-red-400 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <Flag className="w-4 h-4 mr-2" />
                      Report Post
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Gallery */}
            <div className="space-y-4">
              {post.images.length > 0 ? (
                <div className="relative">
                  <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    {post.images[currentImageIndex]?.imageBase64 ? (
                      <img
                        src={post.images[currentImageIndex].imageBase64}
                        alt={`${post.title} - Image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
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
                            className={`w-2 h-2 rounded-full ${index === currentImageIndex
                              ? "bg-white"
                              : "bg-white/50"
                              }`}
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
                      className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${index === currentImageIndex
                        ? "border-blue-500"
                        : "border-gray-200 dark:border-gray-600"
                        }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      {image.imageBase64 ? (
                        <img
                          src={image.imageBase64}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            {index + 1}
                          </span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
              {authenticatedUser?.sub !== post.userId && (
                <>
                  <Rating rating={rating} setRating={setRating} />
                  {rating > 0 && (
                    <Button onClick={handleRating}>Confirm</Button>
                  )}
                </>
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
                <h3 className="text-lg font-semibold mb-2 dark:text-white">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {post.description}
                </p>
              </div>

              <Separator className="dark:bg-gray-600" />

              {/* Post Information */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold dark:text-white">
                  Details
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="dark:text-white">{post.campus}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="dark:text-white">
                      Username: {post.user.username}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="dark:text-white">
                      Posted: {formatDate(post.createdAt)}
                    </span>
                  </div>

                  {post.updatedAt !== post.createdAt && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span className="dark:text-white">
                        Updated: {formatDate(post.updatedAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Categories */}
              {post.postCategories.length > 0 && (
                <>
                  <Separator className="dark:bg-gray-600" />
                  <div>
                    <h3 className="text-lg font-semibold mb-3 dark:text-white">
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.postCategories.map((pc) => (
                        <Badge
                          key={pc.id}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
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
                <ChatButton
                  userId={post.userId}
                  userName={`Seller of ${post.title}`}
                  className="flex-1"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Seller
                </ChatButton>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {renderPostStatus(post)}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-8 border-t pt-6 dark:border-gray-600">
            <h3 className="text-xl font-semibold mb-4 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Comments ({comments.length})
            </h3>

            {/* Add Comment Form */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex gap-3">
                <div className="flex-1 space-y-3">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px] resize-none dark:bg-gray-800 dark:border-gray-600"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleSubmitComment(post)}
                      disabled={!newComment.trim() || isSubmittingComment}
                      size="sm"
                    >
                      {isSubmittingComment ? (
                        "Posting..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Post Comment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm dark:text-white">
                          {comment.user.username}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ReportModal
        post={post}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </>
  );
}
