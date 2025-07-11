"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { ChatModal } from "@/components/chat-modal"
import { mockPosts } from "@/data/mock-posts"
import { Post } from "@/types/post"
import { User } from "@/types/user"
import { Conversation } from "@/types/message"

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

  // Mock chat data with new structure
  const mockOtherUsers: User[] = [
    {
      id: "buyer_1",
      username: "John Buyer",
      email: "john.buyer@example.com",
      provider: "google",
      googleId: "google_buyer_1",
      isActive: 1,
      userRoles: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      messages: [],
      conversations: [],
    },
    {
      id: "buyer_2",
      username: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      provider: "google",
      googleId: "google_buyer_2",
      isActive: 1,
      userRoles: [],
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      messages: [],
      conversations: [],
    },
    {
      id: "buyer_3",
      username: "Mike Johnson",
      email: "mike.johnson@example.com",
      provider: "google",
      googleId: "google_buyer_3",
      userRoles: [],
      isActive: 1,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      messages: [],
      conversations: [],
    },
  ]

  const chats: ChatPreview[] = [
    {
      id: "chat_1",
      post: mockPosts[0],
      otherUser: mockOtherUsers[0],
      conversation: {
        id: "conv_1",
        participants: [mockOtherUsers[0]],
        messages: [
          {
            id: "msg_1",
            content: "Is this still available?",
            sender: mockOtherUsers[0],
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
    },
    {
      id: "chat_2",
      post: mockPosts[1],
      otherUser: mockOtherUsers[1],
      conversation: {
        id: "conv_2",
        participants: [mockOtherUsers[1]],
        messages: [
          {
            id: "msg_2",
            content: "Thanks for the quick response!",
            sender: mockOtherUsers[1],
            isRead: true,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
    },
    {
      id: "chat_3",
      post: mockPosts[3],
      otherUser: mockOtherUsers[2],
      conversation: {
        id: "conv_3",
        participants: [mockOtherUsers[2]],
        messages: [
          {
            id: "msg_3",
            content: "Can we meet tomorrow?",
            sender: mockOtherUsers[2],
            isRead: false,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          },
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    },
  ]

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
          {filteredChats.length > 0 ? (
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
