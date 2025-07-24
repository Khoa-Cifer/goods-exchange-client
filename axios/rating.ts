import http from "./http";

export async function createOrUpdateRating(postId: string, star: number) {
    const response = await http.post("/rating/create-or-update-rating", {
        postId: postId,
        star: star,
    });
    return response.data.result;
}

export async function getCurrentRatingOnPost(postId: string) {
    const response = await http.get(`/rating/get-rating/${postId}`);
    return response.data.result;
}
