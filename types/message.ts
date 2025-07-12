import { User } from "./user"

export type Message = {
    id: string
    content: string
    sender: User
    isRead: boolean
    createdAt: string;
    updatedAt: string;
}

export type Participant = {
    id: string;
    createdAt: string;
    updatedAt: string;
    user: User;
}

export type Conversation = {
    id: string;
    participants: Participant[];
    messages: Message[];
    createdAt: string;
    updatedAt: string;
}
