import http from "./http";

export const getAllCategories = async () => {
  const response = await http.get('/users/categories/all-categories');
  return response.data.result;
}

export async function getRequestTypes() {
  const response = await http.get(`/users/all-request-types`);
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