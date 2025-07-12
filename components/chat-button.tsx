"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { showNotification } from "@/components/notification-helper"
import { useChat } from "@/context/chat-context"

interface ChatButtonProps {
    userId?: string
    userName?: string
    variant?: "default" | "outline" | "ghost"
    size?: "sm" | "default" | "lg"
    className?: string
    children?: React.ReactNode
}

export function ChatButton({
    userId,
    userName,
    variant = "default",
    size = "default",
    className = "",
    children,
}: ChatButtonProps) {
    const { openGlobalChat, getOrCreateConversation, setActiveConversation } = useChat()

    const handleClick = async () => {
        if (userId) {
            // Start conversation with specific user
            const conversationId = await getOrCreateConversation(userId)
            setActiveConversation(conversationId)
            openGlobalChat()
            showNotification.success("Chat Started", `Starting conversation${userName ? ` with ${userName}` : ""}`)
        } else {
            // Just open global chat
            openGlobalChat()
            showNotification.success("Chat Opened", "Opening your messages")
        }
    }

    return (
        <Button variant={variant} size={size} className={className} onClick={handleClick}>
            {children || (
                <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {userId ? "Send Message" : "Messages"}
                </>
            )}
        </Button>
    )
}
