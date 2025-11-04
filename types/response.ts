import { ChatResponse } from "./chat";

export type ApiResponse<T> = {
  data: T;
  message?: string;
  error?: string;
};

export type ApiResponseWithChat = {
  chats: ChatResponse[];
  message: string;
  count?: string;
};
