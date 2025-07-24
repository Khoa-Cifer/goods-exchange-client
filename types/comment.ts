import { Post } from "./post";
import { User } from "./user";

export type Comment = {
  id: string;
  userId: string;
  user: User;
  postId: string;
  post: Post;
  content: string;
  createdAt: string;
  updatedAt: string;
};
