"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageCircle,
  Send,
  Search,
  X,
  ArrowLeft,
  Users,
  Plus,
  Smile,
  Loader2,
} from "lucide-react"
import { useChat } from "@/context/chat-context"
import { User } from "@/types/user"

export function ChatWidget() {
  const {
    conversations,
    activeConversation,
    isGlobalChatOpen,
    unreadTotal,
    currentUser,
    loading,
    openGlobalChat,
    closeGlobalChat,
    setActiveConversation,
    sendMessage,
    markAsRead,
    searchUsers,
    getOrCreateConversation,
  } = useChat()

  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserSearch, setShowUserSearch] = useState(false)
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  console.log(currentUser);
  // Memoize active conversation and messages to prevent unnecessary recalculations
  const activeConv = useMemo(
    () => conversations.find((c) => c.id === activeConversation),
    [conversations, activeConversation],
  )

  const activeMessages = useMemo(() => activeConv?.messages || [], [activeConv])

  const otherParticipant = useMemo(
    () => activeConv?.participants.find((p) => p.user.id !== currentUser?.id)?.user,
    [activeConv, currentUser?.id],
  )

  // Auto scroll to bottom - only when messages change
  useEffect(() => {
    if (activeMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [activeMessages.length])

  // Focus input when conversation changes
  useEffect(() => {
    if (activeConversation && isGlobalChatOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [activeConversation, isGlobalChatOpen])

  // Mark messages as read when conversation is active
  useEffect(() => {
    if (activeConversation && isGlobalChatOpen) {
      markAsRead(activeConversation)
    }
  }, [activeConversation, isGlobalChatOpen, markAsRead])

  // Handle user search with debouncing
  useEffect(() => {
    if (!showUserSearch) return

    const timer = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const results = await searchUsers(searchQuery)
        setSearchResults(results)
      } catch (error) {
        console.error("Error searching users:", error)
        setSearchResults([])
      } finally {
        setSearchLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, searchUsers, showUserSearch])

  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !activeConversation || sendingMessage) return

    setSendingMessage(true)
    try {
      await sendMessage(activeConversation, newMessage.trim())
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSendingMessage(false)
    }
  }, [newMessage, activeConversation, sendMessage, sendingMessage])

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage],
  )

  const handleConversationClick = useCallback(
    (conversationId: string) => {
      setActiveConversation(conversationId)
      setShowUserSearch(false)
      markAsRead(conversationId)
    },
    [setActiveConversation, markAsRead],
  )

  const handleUserClick = useCallback(
    async (user: User) => {
      try {
        const conversationId = await getOrCreateConversation(user.id)
        setActiveConversation(conversationId)
        setShowUserSearch(false)
        setSearchQuery("")
        setSearchResults([])
      } catch (error) {
        console.error("Error creating conversation:", error)
      }
    },
    [getOrCreateConversation, setActiveConversation],
  )

  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }, [])

  const formatLastSeen = useCallback((dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }, [])

  const getUnreadCount = useCallback(
    (conversation: any) => {
      if (!currentUser) return 0
      return conversation.messages.filter((msg: any) => !msg.isRead && msg.sender.id !== currentUser.id).length
    },
    [currentUser],
  )

  const getUserInitials = useCallback((username: string) => {
    return username
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }, [])

  // Chat toggle button (always visible)
  if (!isGlobalChatOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={openGlobalChat}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 shadow-lg"
          size="lg"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadTotal > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 min-w-6 bg-red-500 text-white">
              {unreadTotal > 99 ? "99+" : unreadTotal}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-96 h-[600px] shadow-2xl dark:bg-gray-800 dark:border-gray-700">
        {/* Header */}
        <CardHeader className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {activeConversation && !showUserSearch ? (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setActiveConversation(null)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              ) : null}
              <CardTitle className="text-lg dark:text-white">
                {activeConversation && otherParticipant
                  ? otherParticipant.username
                  : showUserSearch
                    ? "New Chat"
                    : "Messages"}
              </CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={closeGlobalChat}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex flex-col h-[calc(600px-80px)]">
          {/* User Search View */}
          {showUserSearch ? (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {searchLoading && (
                    <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-gray-400 dark:text-gray-500" />
                  )}
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {searchLoading ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin" />
                      <p>Searching users...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                        onClick={() => handleUserClick(user)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {getUserInitials(user.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium dark:text-white">{user.username}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    ))
                  ) : searchQuery.trim() ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No users found</p>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Search for users to start a conversation</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          ) : activeConversation ? (
            /* Chat View */
            <div className="flex flex-col h-full">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {activeMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender.id === currentUser?.id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-end gap-2 max-w-[80%] ${message.sender.id === currentUser?.id ? "flex-row-reverse" : ""
                          }`}
                      >
                        {message.sender.id !== currentUser?.id && (
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/placeholder.svg?height=24&width=24" />
                            <AvatarFallback className="bg-blue-600 text-white text-xs">
                              {getUserInitials(message.sender.username)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2 ${message.sender.id === currentUser?.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                            }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${message.sender.id === currentUser?.id
                              ? "text-blue-100"
                              : "text-gray-500 dark:text-gray-400"
                              }`}
                          >
                            {formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      disabled={sendingMessage}
                      className="pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-500 dark:text-gray-400"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || sendingMessage}
                    size="sm"
                    className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                  >
                    {sendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            /* Conversations List */
            <div className="flex flex-col h-full">
              <div className="p-4 border-b dark:border-gray-700">
                <Button
                  onClick={() => setShowUserSearch(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Chat
                </Button>
              </div>
              <ScrollArea className="flex-1">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <Loader2 className="w-8 h-8 mb-4 animate-spin" />
                    <p>Loading conversations...</p>
                  </div>
                ) : conversations.length > 0 ? (
                  <div className="p-2">
                    {conversations.map((conversation) => {
                      const otherUser = conversation.participants.find((p) => p.user.id !== currentUser?.id)?.user
                      const lastMessage = (conversation.messages ?? [])[(conversation.messages?.length ?? 0) - 1]
                      const unreadCount = getUnreadCount(conversation)

                      return (
                        <div
                          key={conversation.id}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
                          onClick={() => handleConversationClick(conversation.id)}
                        >
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="/placeholder.svg?height=48&width=48" />
                            <AvatarFallback className="bg-blue-600 text-white">
                              {otherUser ? getUserInitials(otherUser.username) : "?"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-sm dark:text-white truncate">
                                {otherUser?.username || "Unknown User"}
                              </h3>
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
                            {lastMessage && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                                {lastMessage.sender.id === currentUser?.id ? "You: " : ""}
                                {lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                    <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-center">No conversations yet</p>
                    <p className="text-sm text-center mt-2">Start a new chat to begin messaging</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
