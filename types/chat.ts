export enum ChatInputExpandTypes {
  MULTI_LINE = "MULTI_LINE",
  SINGLE_LINE = "SINGLE_LINE",
  TEXT_EMPTY = "TEXT_EMPTY",
}

export interface ChatMessage {
  chatId: number;
  sender: "user" | "bot";
  content: string;
  timestamp: string | Date;
  image_url?: string;
  video_url?: string;
}

export interface ChatResponse {
  chatId: number;
  chat: string;
  customerId: number;
  userSessionId: number;
  isAttended: number;
  dateTime: string;
  isLike: number;
  imagePath?: string;
  videoPath?: string;
}

export interface ChatRequest {
  chatId: number;
  chat: string;
  customerId: number;
  userSessionId: number;
  isAttended: number;
  dateTime: string;
  isLike: number;
  chatType?: "normal" | "websearch" | "vision" | "smalltalk" | "realtime";
}
