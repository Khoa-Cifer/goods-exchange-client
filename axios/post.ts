import { CreatePostRequest } from "@/interface/create-post";
import http from "./http";

export async function createPost(data: CreatePostRequest) {
  const response = await http.post("/posts/create-post", data);
  return response.data;
}

export async function confirmPost(postId: string) {
  const response = await http.put(`/posts/confirm-post/${postId}`);
  return response.data;
}

export async function completePost(postId: string) {
  const response = await http.put(`/posts/complete-post/${postId}`);
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

export async function getPostsByStatus(
  status: number,
  options?: {
    search?: string;
    categoryIds?: string[];
  }
) {
  const params = new URLSearchParams();
  if (options?.search) {
    params.append("search", options.search);
  }

  if (options?.categoryIds?.length) {
    params.append("categoryIds", options.categoryIds.join(","));
  }

  const response = await http.get(
    `/posts/get-posts-by-status/${status}?${params.toString()}`
  );
  return response.data.result;
}

export async function createComment(postId: string, content: string) {
  const response = await http.post("/posts/post-comment", {
    postId: postId,
    content: content,
  });
  return response.data.result;
}

export async function getCommentsByPost(postId: string) {
  const response = await http.get(`/posts/all-comments/${postId}`);
  return response.data.result;
}
