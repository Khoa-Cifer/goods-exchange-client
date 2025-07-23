import { Post } from "./post";
import { User } from "./user";

export type Comment = {
  id: string;
  userId: string;
  user: User;
  postId: string;
  post: Post;
  createdAt: string;
  updatedAt: string;
};
