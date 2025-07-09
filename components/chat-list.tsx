"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import type { Post } from "@/types/post"
import { mockPosts } from "@/data/mock-posts"
import { ChatModal } from "./chat-modal"

interface ChatPreview {
  id: string
  post: Post
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  otherUserName: string
  otherUserAvatar?: string
}

export function ChatList() {
  const [selectedChat, setSelectedChat] = useState<Post | null>(null)
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock chat data
  const chats: ChatPreview[] = [
    {
      id: "chat_1",
      post: mockPosts[0],
      lastMessage: "Is this still available?",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
      unreadCount: 2,
      otherUserName: "John Buyer",
      otherUserAvatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "chat_2",
      post: mockPosts[1],
      lastMessage: "Thanks for the quick response!",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
      unreadCount: 0,
      otherUserName: "Sarah Wilson",
      otherUserAvatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "chat_3",
      post: mockPosts[3],
      lastMessage: "Can we meet tomorrow?",
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
      unreadCount: 1,
      otherUserName: "Mike Johnson",
      otherUserAvatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const filteredChats = chats.filter(
    (chat) =>
      chat.post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.otherUserName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleChatClick = (chat: ChatPreview) => {
    setSelectedChat(chat.post)
    setIsChatModalOpen(true)
  }

  const formatTime = (date: Date) => {
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

  return (
    <>
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <MessageCircle className="w-5 h-5" />
            Messages
            {chats.reduce((total, chat) => total + chat.unreadCount, 0) > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {chats.reduce((total, chat) => total + chat.unreadCount, 0)}
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
          {filteredChats.length === 0 ? (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No conversations found</p>
            </div>
          ) : (
            <div className="space-y-0">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b dark:border-gray-700 last:border-b-0"
                  onClick={() => handleChatClick(chat)}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.otherUserAvatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-blue-600 text-white">{chat.otherUserName.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-sm dark:text-white truncate">{chat.otherUserName}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTime(chat.lastMessageTime)}
                        </span>
                        {chat.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs h-5 min-w-5 px-1">
                            {chat.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate mb-1">{chat.lastMessage}</p>

                    <div className="flex items-center gap-2">
                      {chat.post.images[0]?.imageBase64 ? (
                        <img
                          src={`data:image/jpeg;base64,${chat.post.images[0].imageBase64}`}
                          alt={chat.post.title}
                          className="w-6 h-6 object-cover rounded"
                        />
                      ) : (
                        <img
                          src="/placeholder.svg?height=24&width=24"
                          alt={chat.post.title}
                          className="w-6 h-6 object-cover rounded"
                        />
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{chat.post.title}</span>
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                        ${chat.post.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ChatModal
        post={selectedChat}
        isOpen={isChatModalOpen}
        onClose={() => {
          setIsChatModalOpen(false)
          setSelectedChat(null)
        }}
      />
    </>
  )
}
