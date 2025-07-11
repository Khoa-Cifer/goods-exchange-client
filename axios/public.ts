import http from "./http";

export async function getAllUsers() {
    const response = await http.get('/public/all-users');
    return response.data.result;
}

export async function getAllPosts() {
    const response = await http.get('/public/all-posts');
    return response.data.result;
}

export async function getAllCategories() {
    const response = await http.get('/public/all-categories');
    return response.data.result;
}
