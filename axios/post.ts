import { CreatePostRequest } from "@/interface/create-post";
import http from "./http";

export async function createPost(data: CreatePostRequest) {
  const response = await http.post('/posts/create-post', data, {
    withCredentials: true,
  });
  return response.data;
}