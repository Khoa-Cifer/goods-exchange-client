import http from "./http";

export async function getRequestTypes() {
    const response = await http.get(`/requests/all-request-types`);
    return response.data.result;
}

export async function submitRequest(requestTypeId: string, requestDescription: string) {
    const response = await http.post("/requests/request", {
        requestTypeId: requestTypeId,
        requestDescription: requestDescription,
    });
    return response.data
}

export async function getUserSubmittedRequests() {
    const response = await http.get("/requests/submitted-requests");
    return response.data.result;
}