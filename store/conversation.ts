import { create } from "zustand";

import { DataReceivedProps } from "@/services/conversation/query";
import { ChatMessage } from "@/types/chat";

export interface ConversationStoreProps {
  greeting: DataReceivedProps;
  setGreeting: (greeting: DataReceivedProps) => void;

  transcription: string;
  setTranscription: (transcription: string) => void;

  messages: ChatMessage[];
  setMessages: (messages: ChatMessage | ChatMessage[]) => void;

  loadingType: "INIT" | "GREETING" | "GENERATING" | "NONE";
  setLoadingType: (type: "INIT" | "GREETING" | "GENERATING" | "NONE") => void;

  reset: () => void;
}

const conversationStoreInit = {
  transcription: "",
  greeting: {
    topic: null,
    message: "INIT",
    timestamp: null,
  },
  messages: [],
  loadingType: "INIT" as const,
};

const useConversationStore = create<ConversationStoreProps>((set, get) => ({
  ...conversationStoreInit,
  setGreeting: (greeting) => set({ greeting }),

  setTranscription: (words) => {
    set({ transcription: words });
  },

  setMessages: (newMessages) => {
    if (Array.isArray(newMessages)) {
      set((state) => ({ messages: state.messages.concat(newMessages) }));
    } else {
      set((state) => ({ messages: state.messages.concat(newMessages) }));
    }
  },

  setLoadingType: (type) => {
    if (type === get().loadingType) return;
    set({ loadingType: type });
  },

  reset: () => set(conversationStoreInit),
}));

export default useConversationStore;
