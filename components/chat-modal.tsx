"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Phone, Video, MoreVertical, ImageIcon, Paperclip, Smile } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import type { Post } from "@/types/post"
import { Message } from "@/enum/message"
import { getConversationHistory, sendMessage } from "@/axios/message"

interface ChatModalProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
  currentUserId?: string
}

export function ChatModal({ post, isOpen, onClose, currentUserId = "current_user" }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const getConversation = async (userId: string) => {
    const response = await getConversationHistory(userId);
    setMessages(response)
  }

  // Mock initial messages
  useEffect(() => {
    if (post && isOpen) {
      getConversation(post.userId);
    }
  }, [post, isOpen])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !post) return

    const response = await sendMessage(post.userId, newMessage.trim());
    const message = response;

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate seller typing and response
    setTimeout(() => {
      setIsTyping(true)
      setTimeout(() => {
        const responses = [
          "Thanks for your message! I'll get back to you shortly.",
          "Great question! Let me check on that for you.",
          "I'm available to meet up this week if you're interested.",
          "The item is still available. Would you like to see more photos?",
          "I can offer a small discount if you're buying multiple items.",
        ]

        const response: Message = {
          id: `msg_${Date.now()}_response`,
          senderId: post.userId,
          senderName: "Seller",
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date(),
          type: "text",
          isRead: false,
        }

        setMessages((prev) => [...prev, response])
        setIsTyping(false)
      }, 2000)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  if (!post) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[600px] p-0 dark:bg-gray-800 dark:border-gray-700">
        {/* Chat Header */}
        <DialogHeader className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback className="bg-blue-600 text-white">S</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-lg font-semibold dark:text-white">Chat with Seller</DialogTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">About: {post.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">Price: ${post.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages && messages.map && messages.map((message, index) => {
              const showDate =
                index === 0 || formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt)

              return (
                <div key={message.id}>
                  {showDate && (
                    <div className="flex justify-center my-4">
                      <Badge variant="secondary" className="text-xs px-3 py-1">
                        {formatDate(message.createdAt)}
                      </Badge>
                    </div>
                  )}

                  {message.type === "system" ? (
                    <div className="flex justify-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <div className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`flex items-end gap-2 max-w-[70%] ${message.senderId === currentUserId ? "flex-row-reverse" : ""}`}
                      >
                        {message.senderId !== currentUserId && (
                          <Avatar className="h-6 w-6">
                            <AvatarImage src="/placeholder.svg?height=24&width=24" />
                            <AvatarFallback className="bg-blue-600 text-white text-xs">S</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={`rounded-2xl px-4 py-2 ${message.senderId === currentUserId
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                            }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${message.senderId === currentUserId ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                              }`}
                          >
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end gap-2 max-w-[70%]">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" />
                    <AvatarFallback className="bg-blue-600 text-white text-xs">S</AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              size="sm"
              className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Press Enter to send</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
