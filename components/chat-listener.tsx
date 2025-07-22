// components/ChatListener.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { pusher } from '@/lib/pusher';

export default function ChatListener() {
    const { authenticatedUser } = useAuth();

    useEffect(() => {
        if (!authenticatedUser) return;

        const channelName = `private-chat-${authenticatedUser.sub}`;
        const channel = pusher.subscribe(channelName);

        channel.bind('new-message', (data: any) => {
            console.log('New message received:', data);
            // Optionally update global state or show notification
        });

        return () => {
            pusher.disconnect();
        };
    }, [authenticatedUser]);

    return null;
}
