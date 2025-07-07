export interface CreatePostRequest {
  title: string;
  description: string;
  price: number;
  images: { name: string; base64: string }[];
  campus: string;
  type: string;
  categories: string[];
}
