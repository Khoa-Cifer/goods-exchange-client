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

export const sendMessageApi = async (conversationId: string, content: string) => {
    const response = await http.post(`/chat/conversations/${conversationId}/message`, {
        content: content
    });
    return response.data.result;
}

export const readMessagesInConversation = async (conversationId: string) => {
    const response = await http.put('/chat/conversations/read', {
        conversationId: conversationId
    })
    return response.data.result;
}
