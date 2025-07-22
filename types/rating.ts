import { Post } from "./post";
import { User } from "./user";

export type Rating = {
    id: string;
    userId: string;
    user: User;
    postId: string;
    post: Post;
    star: number;
    createdAt: string;
    updatedAt: string;
}