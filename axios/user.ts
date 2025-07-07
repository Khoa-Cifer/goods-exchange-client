import http from "./http";

export const getAllCategories = async () => {
  try {
    const response = await http.get('/users/categories/all-categories');
    return response.data.result;
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    throw error;
  }
}
