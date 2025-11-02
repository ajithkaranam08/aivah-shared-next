import { apiFetch, ConnectOptions } from "@/connector/client-api";


export interface ConversationApiProps {
    create: {
        sessionId: string;
        ipAddress: string;
        deliveryType: 'text' | 'companion' | 'vision';
    }
}


export interface ConversationApiResponse {
    conversationId: number;
    message: string;
    userSessionId: number;
}

const conversationAPi = {
    create: (body: ConversationApiProps["create"], options?: ConnectOptions) => apiFetch.post<ConversationApiResponse>(`embed-share/conversation`, body, options)
}

export default conversationAPi