import http from "./http";

export const getAllUsers = async () => {
  try {
    const response = await http.get('/users/all-users');
    return response.data.result;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
}