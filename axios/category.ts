import http from "./http";

export async function getAllCategories() {
    const response = await http.get('/category/all-categories');
    return response.data.result;
}
