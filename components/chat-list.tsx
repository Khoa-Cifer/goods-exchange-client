"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { ChatModal } from "@/components/chat-modal"
import { mockPosts } from "@/data/mock-posts"
import { Conversation, Participant } from "@/types/message"
import { Post } from "@/types/post"
import { User } from "@/types/user"

interface ChatPreview {
  id: string
  post: Post
  conversation: Conversation
  otherUser: User
}

export function ChatList() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [chats, setChats] = useState<ChatPreview[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch chat conversations from API
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/chat/conversations")
        const result = await response.json()

        if (result.success) {
          // Transform conversations into chat previews
          const chatPreviews: ChatPreview[] = result.data.map((conv: Conversation, index: number) => {
            const otherParticipant = conv.participants.find((p: Participant) => p.user.id !== "current_user")
            return {
              id: `chat_${conv.id}`,
              post: mockPosts[index % mockPosts.length], // Mock association with posts
              conversation: conv,
              otherUser: otherParticipant?.user || {
                id: "unknown",
                username: "Unknown User",
                email: "unknown@example.com",
                provider: "unknown",
                googleId: "",
                isActive: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            }
          })
          setChats(chatPreviews)
        } else {
          console.error("Failed to fetch chats:", result.error)
        }
      } catch (error) {
        console.error("Error fetching chats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChats()
  }, [])

  const filteredChats = chats.filter(
    (chat) =>
      chat.post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleChatClick = (chat: ChatPreview) => {
    setSelectedPost(chat.post)
    setIsChatModalOpen(true)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const getUnreadCount = (conversation: Conversation) => {
    return conversation.messages.filter((msg) => !msg.isRead && msg.sender.id !== "current_user").length
  }

  const getUserInitials = (username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const totalUnread = chats.reduce((total, chat) => total + getUnreadCount(chat.conversation), 0)

  return (
    <>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <MessageCircle className="w-5 h-5" />
            Messages
            {totalUnread > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {totalUnread}
              </Badge>
            )}
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
              <p>Loading conversations...</p>
            </div>
          ) : filteredChats.length > 0 ? (
            <div className="divide-y dark:divide-gray-700">
              {filteredChats.map((chat) => {
                const lastMessage = chat.conversation.messages[chat.conversation.messages.length - 1]
                const unreadCount = getUnreadCount(chat.conversation)

                return (
                  <div
                    key={chat.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => handleChatClick(chat)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {getUserInitials(chat.otherUser.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-sm dark:text-white truncate">{chat.otherUser.username}</h3>
                          <div className="flex items-center gap-2">
                            {lastMessage && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {formatTime(lastMessage.createdAt)}
                              </span>
                            )}
                            {unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs h-5 min-w-5 px-1">
                                {unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate mb-1">
                          About: {chat.post.title}
                        </p>
                        {lastMessage && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {lastMessage.sender.id === "current_user" ? "You: " : ""}
                            {lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No conversations found</p>
              {searchQuery && <p className="text-sm mt-2">Try adjusting your search terms</p>}
            </div>
          )}
        </CardContent>
      </Card>

      <ChatModal
        post={selectedPost}
        isOpen={isChatModalOpen}
        onClose={() => {
          setIsChatModalOpen(false)
          setSelectedPost(null)
        }}
      />
    </>
  )
}
