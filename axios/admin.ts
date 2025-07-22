import http from "./http";

export const banUser = async (userId: string) => {
  const response = await http.put('/admin/users/ban-user', { userId });
  return response.data;
}

export const unbanUser = async (userId: string) => {
  const response = await http.put('/admin/users/unban-user', { userId });
  return response.data;
}

export const assignRoleToUser = async (userId: string, roleName: string) => {
  const response = await http.put('/admin/users/assign-role', { userId, roleName });
  return response.data;
}

export const unassignRoleToUser = async (userId: string, roleName: string) => {
  const response = await http.put('/admin/users/unassign-role', { userId, roleName });
  return response.data;
}

export async function getAllPosts() {
  const response = await http.get('/admin/all-posts');
  return response.data.result;
}

export async function getAllReports() {
  const response = await http.get('/admin/all-reports');
  return response.data.result;
}

export async function getAllRequests() {
  const response = await http.get('/admin/all-requests');
  return response.data.result;
}

export async function approveRequest(id: string) {
  const response = await http.put(`/admin/requests/approve/${id}`);
  return response.data;
}

export async function rejectRequest(id: string) {
  const response = await http.put(`/admin/requests/reject/${id}`);
  return response.data;
}

export async function approveReport(id: string) {
  const response = await http.put(`/admin/reports/approve/${id}`);
  return response.data;
}

export async function rejectReport(id: string) {
  const response = await http.put(`/admin/reports/reject/${id}`);
  return response.data;
}