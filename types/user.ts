import { Conversation, Message } from "./chat";
import { Post } from "./post";

export type UserRole = {
    id: string;
    userId: string;
    roleId: string;
    role: Role;
    assignedAt: string;
    updatedAt: string;
};

export type User = {
    id: string;
    username: string;
    email: string;
    posts: Post[];
    provider?: string;
    googleId?: string;
    isActive?: number;
    userRoles?: UserRole[];
    createdAt?: string;
    updatedAt?: string;
    messages?: Message[];
    conversations?: Conversation[];
};

export type Role = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}