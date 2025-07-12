"use client"

import { getConversationHistory, sendMessageApi } from "@/axios/chat"
import { Conversation } from "@/types/chat"
import { User } from "@/types/user"
import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react"

interface ChatContextType {
  conversations: Conversation[]
  activeConversation: string | null
  isGlobalChatOpen: boolean
  unreadTotal: number
  currentUser: User | null
  loading: boolean

  // Actions
  openGlobalChat: () => void
  closeGlobalChat: () => void
  setActiveConversation: (conversationId: string | null) => void
  sendMessage: (conversationId: string, content: string) => Promise<void>
  markAsRead: (conversationId: string) => Promise<void>
  startConversation: (userId: string) => Promise<string>
  searchUsers: (query: string) => Promise<User[]>
  getOrCreateConversation: (userId: string) => Promise<string>
  setCurrentUser: (user: User) => void
  refreshConversations: () => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [isGlobalChatOpen, setIsGlobalChatOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch conversations from API
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getConversationHistory();
      setConversations(response)
    } catch (error) {
      console.error("Error fetching conversations:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Initialize conversations on mount
  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // Memoize unread total to prevent recalculation on every render
  const unreadTotal = useMemo(() => {
    return conversations.reduce((total, conv) => {
      const unreadCount = (conv.messages ?? []).filter((msg) => !msg.isRead && msg.sender.id !== currentUser?.id).length
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
    async (conversationId: string, content: string) => {
      if (!currentUser) return

      try {
        const message = await sendMessageApi(conversationId, content);

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === conversationId
              ? {
                ...conv,
                messages: [...conv.messages ?? [], message],
                updatedAt: new Date().toISOString(),
              }
              : conv,
          ),
        )
      } catch (error) {
        console.error("Error sending message:", error)
      }
    },
    [currentUser],
  )

  const markAsRead = useCallback(
    async (conversationId: string) => {
      if (!currentUser) return

      try {
        const response = await fetch(`/api/chat/conversations/${conversationId}/read`, {
          method: "POST",
        })

        const result = await response.json()

        if (result.success) {
          // Update local state to mark messages as read
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === conversationId
                ? {
                  ...conv,
                  messages: (conv.messages ?? []).map((msg) =>
                    msg.sender.id !== currentUser.id ? { ...msg, isRead: true } : msg,
                  ),
                }
                : conv,
            ),
          )
        } else {
          console.error("Failed to mark messages as read:", result.error)
        }
      } catch (error) {
        console.error("Error marking messages as read:", error)
      }
    },
    [currentUser],
  )

  const getOrCreateConversation = useCallback(
    async (userId: string): Promise<string> => {
      if (!currentUser) return ""

      try {
        // Check if conversation already exists
        const existingConv = conversations.find((conv) => conv.participants.some((p) => p.user.id === userId))
        console.log(existingConv);
        if (existingConv) {
          return existingConv.id
        }

        // Create new conversation via API
        const response = await fetch("/api/chat/conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        })

        const result = await response.json()

        if (result.success) {
          setConversations((prev) => [result.data, ...prev])
          return result.data.id
        } else {
          console.error("Failed to create conversation:", result.error)
          return ""
        }
      } catch (error) {
        console.error("Error creating conversation:", error)
        return ""
      }
    },
    [conversations, currentUser],
  )

  const startConversation = useCallback(
    async (userId: string): Promise<string> => {
      return await getOrCreateConversation(userId)
    },
    [getOrCreateConversation],
  )

  const searchUsers = useCallback(async (query: string): Promise<User[]> => {
    try {
      const response = await fetch(`/api/chat/users/search?q=${encodeURIComponent(query)}`)
      const result = await response.json()

      if (result.success) {
        return result.data
      } else {
        console.error("Failed to search users:", result.error)
        return []
      }
    } catch (error) {
      console.error("Error searching users:", error)
      return []
    }
  }, [])

  const refreshConversations = useCallback(async () => {
    await fetchConversations()
  }, [fetchConversations])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
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
      startConversation,
      searchUsers,
      getOrCreateConversation,
      setCurrentUser,
      refreshConversations,
    }),
    [
      conversations,
      activeConversation,
      isGlobalChatOpen,
      unreadTotal,
      currentUser,
      loading,
      openGlobalChat,
      closeGlobalChat,
      sendMessage,
      markAsRead,
      startConversation,
      searchUsers,
      getOrCreateConversation,
      refreshConversations,
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
