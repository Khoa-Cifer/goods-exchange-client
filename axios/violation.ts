import http from "./http";

export async function reportUser(postId: string, reportedUserId: string, reason: string) {
    const response = await http.post('/violation/report', {
        postId: postId,
        reportedUserId: reportedUserId,
        reason: reason,
    });
    return response.data.result;
}