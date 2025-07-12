import http from "./http";

export const createNewConversation = async (participantUserId: string) => {
    const response = await http.post("/chat/new-conversation", {
        participantUserId: participantUserId
    });
    return response.data.result;
}

export const getConversationHistory = async () => {
    const response = await http.get(`/chat/conversations`);
    return response.data.result;
}

export const sendMessage = async (receiverId: string, content: string) => {
    const response = await http.post('/chat/chat-message', {
        receiverId: receiverId,
        content: content
    });
    return response.data.result;
}