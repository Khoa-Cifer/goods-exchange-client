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

export async function confirmPost(postId: string) {
  const response = await http.put(`/posts/confirm-post/${postId}`);
  return response.data;
}

export async function rejectPost(postId: string) {
  const response = await http.put(`/posts/reject-post/${postId}`);
  return response.data;
}

export async function hidePost(postId: string) {
  const response = await http.put(`/posts/hide-post/${postId}`);
  return response.data;
}

export async function getPostsByUser() {
  const response = await http.get("/posts/get-posts-by-user");
  return response.data.result;
}