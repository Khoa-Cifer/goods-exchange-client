import { Conversation, Message } from "./chat";

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
    provider?: string;
    googleId?: string;
    isActive?: number;
    userRoles?: UserRole[];
    createdAt: string;
    updatedAt: string;
    messages?: Message[];
    conversations?: Conversation[];
};

export type Role = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}