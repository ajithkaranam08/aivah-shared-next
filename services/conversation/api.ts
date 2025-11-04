import { apiFetch, ConnectOptions } from "@/connector/client-api";
import { ApiResponseWithChat } from "@/types/response";

export interface ConversationApiProps {
  create: {
    sessionId: string;
    ipAddress: string;
    deliveryType: "text" | "companion" | "vision";
  };
  syncChat: {
    chat: string;
    conversationId: number;
    chatType: "normal";
  };
}

export interface ConversationApiResponse {
  conversationId: number;
  message: string;
  userSessionId: number;
}

const conversationAPi = {
  create: (body: ConversationApiProps["create"], options?: ConnectOptions) =>
    apiFetch.post<ConversationApiResponse>(
      `embed-share/conversation`,
      body,
      options
    ),
  syncChat: (
    body: ConversationApiProps["syncChat"],
    options?: ConnectOptions
  ) => apiFetch.post(`lk-session/sync-chat`, body, options),

  getChats: (conversationId: number) =>
    apiFetch.get<ApiResponseWithChat>(
      `embed-share/conversation/${conversationId}/chat`
    ),
};

export default conversationAPi;
