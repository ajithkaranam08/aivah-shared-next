import { DataReceivedProps } from "@/services/conversation/query";
import { ChatMessage } from "@/types/chat";
import { create } from "zustand";

interface ConversationStore {
  greeding: DataReceivedProps;
  setGreeding: (greeding: DataReceivedProps) => void;

  transcription: string;
  setTranscription: (transcription: string) => void;

  messages: ChatMessage[];
  setMessages: (messages: ChatMessage | ChatMessage[]) => void;

  loadingType: "INIT" | "GREEDING" | "GENERATING" | "NONE";
  setLoadingType: (type: "INIT" | "GREEDING" | "GENERATING" | "NONE") => void;
}

const useConversationStore = create<ConversationStore>((set, get) => ({
  greeding: {
    topic: null,
    message: "Hi there! Welcome to the chat.",
    timestamp: null,
  },
  setGreeding: (greeding) => set({ greeding }),

  transcription: "",
  setTranscription: (words) => {
    set({ transcription: words });
  },

  messages: [],
  setMessages: (newMessages) => {
    if (Array.isArray(newMessages)) {
      set({ messages: [...get().messages, ...newMessages] });
    } else {
      set({ messages: [...get().messages, newMessages] });
    }
  },

  loadingType: "INIT",
  setLoadingType: (type) => {
    if (get().loadingType === type) return;
    set({ loadingType: type });
  },
}));

export default useConversationStore;
