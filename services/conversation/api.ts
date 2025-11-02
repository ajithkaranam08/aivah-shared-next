import { apiFetch, ConnectOptions } from "@/connector/client-api";


export interface ConversationApiProps {
    create: {
        sessionId: string;
        ipAddress: string;
        deliveryType: 'text' | 'companion' | 'vision';
    }
}

const conversationAPi = {
    create: (body: ConversationApiProps["create"], options?: ConnectOptions) => apiFetch.post(`embed-share/conversation`, body, options)
}

export default conversationAPi