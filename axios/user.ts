import http from "./http";

export async function getRequestTypes() {
  const response = await http.get(`/users/all-request-types`);
  return response.data.result;
}

export async function getUserById(userId: string) {
  const response = await http.get(`/users/selected-user/${userId}`);
  return response.data.result;
}

export async function submitRequest(requestTypeId: string, requestDescription: string) {
  const response = await http.post("/users/request", {
    requestTypeId: requestTypeId,
    requestDescription: requestDescription,
  });
  return response.data
}

export async function getUserSubmittedRequests() {
  const response = await http.get("/users/submitted-requests");
  return response.data.result;
}

export async function getAllUsers() {
  const response = await http.get('/users/all-users');
  return response.data.result;
}