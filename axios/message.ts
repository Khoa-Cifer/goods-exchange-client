import http from "./http";

export const getConversationHistory = async (userId: string) => {
    const response = await http.get(`/chat/conversation?userId=${userId}`);
    return response.data.result;
}

export const sendMessage = async (receiverId: string, content: string) => {
    const response = await http.post('/chat/chat-message', {
        receiverId: receiverId,
        content: content
    });
    return response.data.result;
}