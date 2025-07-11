"use client"

import { Conversation, Message } from "@/types/message"
import { User } from "@/types/user"
import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"

interface ChatContextType {
  conversations: Conversation[]
  activeConversation: string | null
  isGlobalChatOpen: boolean
  unreadTotal: number
  currentUser: User | null

  // Actions
  openGlobalChat: () => void
  closeGlobalChat: () => void
  setActiveConversation: (conversationId: string | null) => void
  sendMessage: (conversationId: string, content: string) => void
  markAsRead: (conversationId: string) => void
  startConversation: (userId: string) => string
  searchUsers: (query: string) => User[]
  getOrCreateConversation: (userId: string) => string
  setCurrentUser: (user: User) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Mock users data - moved outside component to prevent recreation
const mockUsers: User[] = [
  {
    id: "user_1",
    username: "John Smith",
    email: "john.smith@example.com",
    provider: "google",
    googleId: "google_123456789",
    isActive: 1,
    userRoles: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    messages: [],
    conversations: [],
  },
  {
    id: "user_2",
    username: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    provider: "google",
    googleId: "google_987654321",
    isActive: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
    userRoles: [],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    messages: [],
    conversations: [],
  },
  {
    id: "user_3",
    username: "Mike Wilson",
    email: "mike.wilson@example.com",
    provider: "google",
    googleId: "google_456789123",
    isActive: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    messages: [],
    userRoles: [],
    conversations: [],
  },
  {
    id: "user_4",
    username: "Emma Davis",
    email: "emma.davis@example.com",
    provider: "google",
    googleId: "google_789123456",
    isActive: 0,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    userRoles: [],
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    messages: [],
    conversations: [],
  },
  {
    id: "user_5",
    username: "Alex Brown",
    email: "alex.brown@example.com",
    provider: "google",
    googleId: "google_321654987",
    isActive: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    userRoles: [],
    updatedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    messages: [],
    conversations: [],
  },
]

// Current user mock data
const mockCurrentUser: User = {
  id: "current_user",
  username: "You",
  email: "current.user@example.com",
  provider: "google",
  googleId: "google_current_user",
  userRoles: [],
  isActive: 1,
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
  updatedAt: new Date().toISOString(),
  messages: [],
  conversations: [],
}

// Create initial mock conversations with the new structure
const createInitialConversations = (): Conversation[] => {
  const now = new Date()

  const conversation1: Conversation = {
    id: "conv_1",
    participants: [mockCurrentUser, mockUsers[0]],
    messages: [
      {
        id: "msg_1",
        content: "Hey! How are you doing?",
        sender: mockUsers[0],
        isRead: false,
        createdAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: "msg_2",
        content: "I'm doing great! Thanks for asking.",
        sender: mockCurrentUser,
        isRead: true,
        createdAt: new Date(now.getTime() - 1000 * 60 * 25).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 25).toISOString(),
      },
      {
        id: "msg_3",
        content: "That's awesome! Want to catch up later?",
        sender: mockUsers[0],
        isRead: false,
        createdAt: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
      },
    ],
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updatedAt: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
  }

  const conversation2: Conversation = {
    id: "conv_2",
    participants: [mockCurrentUser, mockUsers[1]],
    messages: [
      {
        id: "msg_4",
        content: "Thanks for your help yesterday!",
        sender: mockUsers[1],
        isRead: true,
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: "msg_5",
        content: "No problem at all! Happy to help.",
        sender: mockCurrentUser,
        isRead: true,
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2 + 1000 * 60 * 5).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 2 + 1000 * 60 * 5).toISOString(),
      },
    ],
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 2 + 1000 * 60 * 5).toISOString(),
  }

  const conversation3: Conversation = {
    id: "conv_3",
    participants: [mockCurrentUser, mockUsers[2]],
    messages: [
      {
        id: "msg_6",
        content: "Are you available for a quick call?",
        sender: mockUsers[2],
        isRead: false,
        createdAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString(),
      },
    ],
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(),
    updatedAt: new Date(now.getTime() - 1000 * 60 * 60).toISOString(),
  }

  return [conversation1, conversation2, conversation3]
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [isGlobalChatOpen, setIsGlobalChatOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(mockCurrentUser)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize data only once
  useEffect(() => {
    if (!isInitialized) {
      const initialConversations = createInitialConversations()
      setConversations(initialConversations)
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Memoize unread total to prevent recalculation on every render
  const unreadTotal = useMemo(() => {
    return conversations.reduce((total, conv) => {
      const unreadCount = conv.messages.filter((msg) => !msg.isRead && msg.sender.id !== currentUser?.id).length
      return total + unreadCount
    }, 0)
  }, [conversations, currentUser?.id])

  // Memoize action functions to prevent recreation on every render
  const openGlobalChat = useCallback(() => setIsGlobalChatOpen(true), [])

  const closeGlobalChat = useCallback(() => {
    setIsGlobalChatOpen(false)
    setActiveConversation(null)
  }, [])

  const sendMessage = useCallback(
    (conversationId: string, content: string) => {
      if (!currentUser) return

      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        content: content.trim(),
        sender: currentUser,
        isRead: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Update conversation with new message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              updatedAt: new Date().toISOString(),
            }
            : conv,
        ),
      )

      // Simulate response after a delay
      const timeoutId = setTimeout(
        () => {
          const conversation = conversations.find((c) => c.id === conversationId)
          if (!conversation) return

          const otherParticipant = conversation.participants.find((p) => p.id !== currentUser.id)
          if (!otherParticipant) return

          const responses = [
            "Thanks for your message!",
            "I'll get back to you soon.",
            "That sounds great!",
            "Let me think about that.",
            "Sure, no problem!",
            "I appreciate you reaching out.",
          ]

          const responseMessage: Message = {
            id: `msg_${Date.now()}_response`,
            content: responses[Math.floor(Math.random() * responses.length)],
            sender: otherParticipant,
            isRead: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === conversationId
                ? {
                  ...conv,
                  messages: [...conv.messages, responseMessage],
                  updatedAt: new Date().toISOString(),
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
    [currentUser, conversations],
  )

  const markAsRead = useCallback(
    (conversationId: string) => {
      if (!currentUser) return

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
              ...conv,
              messages: conv.messages.map((msg) =>
                msg.sender.id !== currentUser.id ? { ...msg, isRead: true } : msg,
              ),
            }
            : conv,
        ),
      )
    },
    [currentUser],
  )

  const getOrCreateConversation = useCallback(
    (userId: string): string => {
      if (!currentUser) return ""

      // Check if conversation already exists
      const existingConv = conversations.find((conv) => conv.participants.some((p) => p.id === userId))

      if (existingConv) {
        return existingConv.id
      }

      // Create new conversation
      const user = mockUsers.find((u) => u.id === userId)
      if (!user) return ""

      const newConversation: Conversation = {
        id: `conv_${Date.now()}`,
        participants: [currentUser, user],
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setConversations((prev) => [newConversation, ...prev])

      return newConversation.id
    },
    [conversations, currentUser],
  )

  const startConversation = useCallback(
    (userId: string): string => {
      return getOrCreateConversation(userId)
    },
    [getOrCreateConversation],
  )

  const searchUsers = useCallback((query: string): User[] => {
    if (!query.trim()) return mockUsers.filter((user) => user.isActive === 1)

    return mockUsers.filter(
      (user) =>
        user.isActive === 1 &&
        (user.username.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase())),
    )
  }, [])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      conversations,
      activeConversation,
      isGlobalChatOpen,
      unreadTotal,
      currentUser,
      openGlobalChat,
      closeGlobalChat,
      setActiveConversation,
      sendMessage,
      markAsRead,
      startConversation,
      searchUsers,
      getOrCreateConversation,
      setCurrentUser,
    }),
    [
      conversations,
      activeConversation,
      isGlobalChatOpen,
      unreadTotal,
      currentUser,
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
