import http from "./http";

export const banUser = async (userId: string) => {
  try {
    const response = await http.put('/admin/users/ban-user', { userId });
    return response.data;
  } catch (error) {
    console.error('Failed to ban user:', error);
    throw error;
  }
}

export const unbanUser = async (userId: string) => {
  try {
    const response = await http.put('/admin/users/unban-user', { userId });
    return response.data;
  } catch (error) {
    console.error('Failed to unban user:', error);
    throw error;
  }
}

export const assignRoleToUser = async (userId: string, roleName: string) => {
  try {
    const response = await http.put('/admin/users/assign-role', { userId, roleName });
    return response.data;
  } catch (error) {
    console.error('Failed to assign role to user:', error);
    throw error;
  }
}

export const unassignRoleToUser = async (userId: string, roleName: string) => {
  try {
    const response = await http.put('/admin/users/unassign-role', { userId, roleName });
    return response.data;
  }
  catch (error) {
    console.error('Failed to unassign role from user:', error);
    throw error;
  }
}