import envConfig from "@/config/env";
import { SESSION_TOKEN, SESSION_ID } from "@/helper/storage";
import { v4 as uuidv4 } from "uuid";
import { Room } from "livekit-client";
import { LivekitConnectionParams, LivekitResponse } from "@/@type/livekit";

export const connectToLiveKit = async ({
  knowledgeBaseId,
  conversationId,
  llmModelId,
  voiceId,
  voiceType,
  sessionId,
}: LivekitConnectionParams) => {
  if (!knowledgeBaseId || !conversationId || !llmModelId || !voiceId) {
    throw new Error("Missing required parameters for LiveKit connection");
  }

  const uuid = SESSION_ID.get() || uuidv4();
  const uniqueConversationId = `${conversationId}-${Date.now()}`;

  const tokenRequest = {
    userSessionId: sessionId || uuidv4(),
    conversationId: uniqueConversationId,
    knowledgebaseId: knowledgeBaseId.toString(),
    voice: voiceId,
    voiceType,
    enableStream: "true",
    llmName: llmModelId || "gpt-4o-realtime-preview",
    uuid,
  };

  const tokenUrl = envConfig.NEXT_PUBLIC_LIVEKIT_TOKEN_ENDPOINT || "";
  const sessionToken = SESSION_TOKEN.get();

  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (sessionToken) headers.Authorization = `Bearer ${sessionToken}`;

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(tokenRequest),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${res.statusText} - ${text}`);
  }

  const data: LivekitResponse = await res.json();

  if (!data.success || !data.token || !data.url) {
    throw new Error(data.message || "Invalid LiveKit token response");
  }

  const room = new Room({
    adaptiveStream: true,
    dynacast: true,
    disconnectOnPageLeave: true,
    publishDefaults: {
      audioPreset: { maxBitrate: 32000 },
    },
  });

  try {
    await room.prepareConnection(data.url, data.token);
  } catch (e) {
    console.warn("Pre-warm connection failed:", e);
  }



  return { room, url: data.url, token: data.token };
};
