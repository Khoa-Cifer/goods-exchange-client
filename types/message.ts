import { User } from "./user"

export type Message = {
    id: string
    content: string
    sender: User
    isRead: boolean
    createdAt: string;
    updatedAt: string;
}

export type Conversation = {
    id: string;
    participants: User[];
    messages: Message[];
    createdAt: string;
    updatedAt: string;
}
