import { create } from "zustand";
import { connectToLiveKit } from "@/connector/livekit";
import { toast } from "sonner";
import { LivekitConnectionResult } from "@/@type/livekit";
import { SESSION_CONVERSATION_ID, SESSION_ID } from "@/helper/storage";
import { ChatbotDetails } from "@/@type/validation";

// Define Zustand store type
interface LivekitState {
  room: LivekitConnectionResult["room"] | null;
  isConnecting: boolean;
  error: string | null;
  connect: (data: ChatbotDetails) => Promise<void>;
  disconnect: () => void;
  reset: () => void;
}

// Zustand store definition
export const useLivekitStore = create<LivekitState>((set, get) => ({
  room: null,
  isConnecting: false,
  error: null,

  connect: async (data) => {
    if (!data?.details) {
      toast.error("Invalid embed ID or validation missing");
      return;
    }

    try {
      set({ isConnecting: true, error: null });

      const { chatbotId, voiceSetup, llmModelId } = data.details;
      const conversationId = SESSION_CONVERSATION_ID.get()!;
      const sessionId = SESSION_ID.get()!;

      const connection = await connectToLiveKit({
        knowledgeBaseId: String(chatbotId),
        conversationId,
        llmModelId: String(llmModelId),
        voiceId: String(voiceSetup.voiceSetup),
        voiceType: voiceSetup.voiceType,
        sessionId,
      });

      connection.room.on("connected", () => {
        set({ room: connection.room, isConnecting: false });
        toast.success("✅ Connected to LiveKit");
      });

      connection.room.on("disconnected", () => {
        set({ room: null, isConnecting: false });
        toast.info("Disconnected from LiveKit");
      });
    } catch (err) {
      set({ isConnecting: false, error: (err as Error).message });
      toast.error(`LiveKit connection failed: ${(err as Error).message}`);
    }
  },

  disconnect: () => {
    const { room } = get();
    if (room) {
      room.disconnect();
      set({ room: null });
      toast.info("LiveKit room disconnected");
    }
  },

  reset: () => {
    set({ room: null, isConnecting: false, error: null });
  },
}));
