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
    status: number;
    createdAt: string;
    updatedAt: string;
}
