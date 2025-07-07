import { CreatePostRequest } from "@/interface/create-post";
import http from "./http";

export async function createPost(data: CreatePostRequest) {
  const response = await http.post('/posts/create-post', data);
  return response.data;
}

export async function getAllPosts() {
  const response = await http.get('/posts/all-posts');
  return response.data.result;
}