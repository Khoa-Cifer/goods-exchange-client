import { Post } from "./post";
import { User } from "./user";

export type Violation = {
    id: string;
    reportedUserId: string;
    reportedUser: User;
    reporterId: string;
    postId: string;
    post: Post;
    reason: string;
    reporter: User;
    createdAt: string;
    updatedAt: string;
}

export type Report = {
    id: string;
    status: number;
    reason: string;
    createdAt: string;
    updatedAt: string;
    reportedUser: {
        id: string;
        username: string;
        email: string;
        provider: string;
        googleId: string;
        isActive: number;
        createdAt: string;
        updatedAt: string;
    };
    post: {
        id: string;
        title: string;
        description: string;
        price: number;
        userId: string;
        campus: string;
        status: number;
        type: number;
        createdAt: string;
        updatedAt: string;
    };
    reporter: {
        id: string;
        username: string;
        email: string;
        provider: string;
        googleId: string;
        isActive: number;
        createdAt: string;
        updatedAt: string;
    };
};
