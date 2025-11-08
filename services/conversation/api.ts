import { ConnectOptions, apiFetch } from "@/connector/client-api";
import { ApiRequestPageParams, ApiResponseWithChat } from "@/types/api";

export interface ConversationApiProps {
  create: {
    sessionId: string;
    ipAddress: string;
    deliveryType: "text" | "companion" | "vision";
  };
  syncChat: {
    chat: string;
    conversationId: number;
    chatType: "normal" | "image" | "video";
    imagePath?: string;
    videoPath?: string;
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

  getChats: (conversationId: number, params?: ApiRequestPageParams) => {
    const queryParams = new URLSearchParams();

    Object.entries(params || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, String(value));
      }
    });
    return apiFetch.get<ApiResponseWithChat>(
      `embed-share/conversation/${conversationId}/chat?${queryParams}`, {revalidate: false}
    );
  },
};

export default conversationAPi;
