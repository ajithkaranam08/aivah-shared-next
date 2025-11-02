import { Room } from "livekit-client";

export interface LivekitConnectionParams {
  knowledgeBaseId: string;
  conversationId: string;
  llmModelId: string;
  voiceId: string;
  voiceType: string;
  sessionId: string;
}

export interface LivekitResponse {
  success: boolean;
  token: string;
  url: string;
  message?: string;
}

export interface LivekitConnectionResult {
  room: Room;
  url: string;
  token: string;
}
