"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"

export interface ChatUser {
  id: string
  name: string
  avatar?: string
  isOnline: boolean
  lastSeen?: Date
}

export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  type: "text" | "image" | "file" | "system"
  isRead: boolean
  replyTo?: string
}

export interface ChatConversation {
  id: string
  participants: ChatUser[]
  lastMessage?: ChatMessage
  unreadCount: number
  createdAt: Date
  updatedAt: Date
}

interface ChatContextType {
  conversations: ChatConversation[]
  messages: { [conversationId: string]: ChatMessage[] }
  activeConversation: string | null
  isGlobalChatOpen: boolean
  unreadTotal: number

  // Actions
  openGlobalChat: () => void
  closeGlobalChat: () => void
  setActiveConversation: (conversationId: string | null) => void
  sendMessage: (conversationId: string, content: string, type?: "text" | "image" | "file") => void
  markAsRead: (conversationId: string) => void
  startConversation: (userId: string) => string
  searchUsers: (query: string) => ChatUser[]
  getOrCreateConversation: (userId: string) => string
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Mock users data - moved outside component to prevent recreation
const mockUsers: ChatUser[] = [
  {
    id: "user_1",
    name: "John Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
  },
  {
    id: "user_2",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "user_3",
    name: "Mike Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
  },
  {
    id: "user_4",
    name: "Emma Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "user_5",
    name: "Alex Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
  },
]

// Initial mock data - moved outside component
const initialMockConversations: ChatConversation[] = [
  {
    id: "conv_1",
    participants: [{ id: "current_user", name: "You", isOnline: true }, mockUsers[0]],
    unreadCount: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "conv_2",
    participants: [{ id: "current_user", name: "You", isOnline: true }, mockUsers[1]],
    unreadCount: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "conv_3",
    participants: [{ id: "current_user", name: "You", isOnline: true }, mockUsers[2]],
    unreadCount: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60),
  },
]

const initialMockMessages: { [conversationId: string]: ChatMessage[] } = {
  conv_1: [
    {
      id: "msg_1",
      senderId: "user_1",
      receiverId: "current_user",
      content: "Hey! How are you doing?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "text",
      isRead: false,
    },
    {
      id: "msg_2",
      senderId: "current_user",
      receiverId: "user_1",
      content: "I'm doing great! Thanks for asking.",
      timestamp: new Date(Date.now() - 1000 * 60 * 25),
      type: "text",
      isRead: true,
    },
    {
      id: "msg_3",
      senderId: "user_1",
      receiverId: "current_user",
      content: "That's awesome! Want to catch up later?",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: "text",
      isRead: false,
    },
  ],
  conv_2: [
    {
      id: "msg_4",
      senderId: "user_2",
      receiverId: "current_user",
      content: "Thanks for your help yesterday!",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: "text",
      isRead: true,
    },
    {
      id: "msg_5",
      senderId: "current_user",
      receiverId: "user_2",
      content: "No problem at all! Happy to help.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 60 * 5),
      type: "text",
      isRead: true,
    },
  ],
  conv_3: [
    {
      id: "msg_6",
      senderId: "user_3",
      receiverId: "current_user",
      content: "Are you available for a quick call?",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      type: "text",
      isRead: false,
    },
  ],
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [messages, setMessages] = useState<{ [conversationId: string]: ChatMessage[] }>({})
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [isGlobalChatOpen, setIsGlobalChatOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize data only once
  useEffect(() => {
    if (!isInitialized) {
      // Set initial conversations with last messages
      const conversationsWithLastMessages = initialMockConversations.map((conv) => {
        const convMessages = initialMockMessages[conv.id] || []
        const lastMessage = convMessages[convMessages.length - 1]
        return { ...conv, lastMessage }
      })

      setConversations(conversationsWithLastMessages)
      setMessages(initialMockMessages)
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Memoize unread total to prevent recalculation on every render
  const unreadTotal = useMemo(() => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0)
  }, [conversations])

  // Memoize action functions to prevent recreation on every render
  const openGlobalChat = useCallback(() => setIsGlobalChatOpen(true), [])

  const closeGlobalChat = useCallback(() => {
    setIsGlobalChatOpen(false)
    setActiveConversation(null)
  }, [])

  const sendMessage = useCallback(
    (conversationId: string, content: string, type: "text" | "image" | "file" = "text") => {
      const newMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        senderId: "current_user",
        receiverId: "",
        content,
        timestamp: new Date(),
        type,
        isRead: false,
      }

      // Update messages
      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMessage],
      }))

      // Update conversation's last message and timestamp
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, lastMessage: newMessage, updatedAt: new Date() } : conv,
        ),
      )

      // Simulate response after a delay
      const timeoutId = setTimeout(
        () => {
          const responses = [
            "Thanks for your message!",
            "I'll get back to you soon.",
            "That sounds great!",
            "Let me think about that.",
            "Sure, no problem!",
            "I appreciate you reaching out.",
          ]

          const responseMessage: ChatMessage = {
            id: `msg_${Date.now()}_response`,
            senderId: "other_user",
            receiverId: "current_user",
            content: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
            type: "text",
            isRead: false,
          }

          setMessages((prev) => ({
            ...prev,
            [conversationId]: [...(prev[conversationId] || []), responseMessage],
          }))

          // Update unread count only if conversation is not active
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === conversationId
                ? {
                    ...conv,
                    lastMessage: responseMessage,
                    updatedAt: new Date(),
                    unreadCount: conv.unreadCount + 1,
                  }
                : conv,
            ),
          )
        },
        1000 + Math.random() * 2000,
      )

      // Cleanup timeout on unmount
      return () => clearTimeout(timeoutId)
    },
    [],
  )

  const markAsRead = useCallback((conversationId: string) => {
    setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv)))

    setMessages((prev) => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map((msg) =>
        msg.receiverId === "current_user" ? { ...msg, isRead: true } : msg,
      ),
    }))
  }, [])

  const getOrCreateConversation = useCallback(
    (userId: string): string => {
      // Check if conversation already exists
      const existingConv = conversations.find((conv) => conv.participants.some((p) => p.id === userId))

      if (existingConv) {
        return existingConv.id
      }

      // Create new conversation
      const user = mockUsers.find((u) => u.id === userId)
      if (!user) return ""

      const newConversation: ChatConversation = {
        id: `conv_${Date.now()}`,
        participants: [{ id: "current_user", name: "You", isOnline: true }, user],
        unreadCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setConversations((prev) => [newConversation, ...prev])
      setMessages((prev) => ({ ...prev, [newConversation.id]: [] }))

      return newConversation.id
    },
    [conversations],
  )

  const startConversation = useCallback(
    (userId: string): string => {
      return getOrCreateConversation(userId)
    },
    [getOrCreateConversation],
  )

  const searchUsers = useCallback((query: string): ChatUser[] => {
    if (!query.trim()) return mockUsers

    return mockUsers.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()))
  }, [])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      conversations,
      messages,
      activeConversation,
      isGlobalChatOpen,
      unreadTotal,
      openGlobalChat,
      closeGlobalChat,
      setActiveConversation,
      sendMessage,
      markAsRead,
      startConversation,
      searchUsers,
      getOrCreateConversation,
    }),
    [
      conversations,
      messages,
      activeConversation,
      isGlobalChatOpen,
      unreadTotal,
      openGlobalChat,
      closeGlobalChat,
      sendMessage,
      markAsRead,
      startConversation,
      searchUsers,
      getOrCreateConversation,
    ],
  )

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
