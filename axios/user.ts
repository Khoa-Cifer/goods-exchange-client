import http from "./http";

export async function getUserById(userId: string) {
  const response = await http.get(`/users/selected-user/${userId}`);
  return response.data.result;
}

export async function getAllUsers() {
  const response = await http.get('/users/all-users');
  return response.data.result;
}

export async function searchUserByName(username: string) {
    const response = await http.get(`/users/search-users?username=${username}`);
  return response.data.result;
}