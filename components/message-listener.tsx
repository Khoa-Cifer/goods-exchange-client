'use client';

import { useAuth } from '@/context/auth-context';
import { useChat } from '@/context/chat-context';
import { getPusherClient } from '@/lib/pusher';
import { Conversation } from '@/types/chat';
import { useEffect } from 'react';

interface PusherMessage {
    conversationId: string;
    message: any;
}

export function MessageListener() {
    const { conversations, receiveMessage } = useChat();
    const { accessToken } = useAuth();

    useEffect(() => {
        const pusherAuthEndpoint = `${process.env.NEXT_PUBLIC_SERVER_URL!}${process.env.NEXT_PUBLIC_PUSHER_AUTH_ENDPOINT!}`

        if (!conversations?.length || !accessToken) {
            console.log("Waiting for authenticatedUser or conversations");
            return;
        }

        const pusherClient = getPusherClient({
            appKey: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
            authEndpoint: pusherAuthEndpoint,
            authToken: accessToken,
        });

        try {
            const channels: any[] = [];
            console.log("Subscribing to channels for conversations:", conversations);
            conversations.forEach((conversation: Conversation) => {
                const channel = pusherClient.subscribe(`private-chat-${conversation.id}`);
                channel.bind('new-message', (data: PusherMessage) => {
                    console.log('📩 New global message:', data.message);
                    receiveMessage(data.conversationId, data.message);
                });
                channels.push(channel);
            });

            return () => {
                console.log("Cleaning up subscriptions");
                channels.forEach((channel) => {
                    channel.unbind_all();
                    pusherClient.unsubscribe(channel.name);
                });
            };
        } catch (error) {
            console.error("Error in MessageListener:", error);
        }
    }, [accessToken, conversations]);

    return null;
}