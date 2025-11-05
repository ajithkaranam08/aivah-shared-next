import { DataReceivedProps } from "@/services/conversation/query";
import { ChatMessage } from "@/types/chat";
import { create } from "zustand";

interface ConversationStore {
  greeting: DataReceivedProps;
  setGreeting: (greeting: DataReceivedProps) => void;

  transcription: string;
  setTranscription: (transcription: string) => void;

  messages: ChatMessage[];
  setMessages: (messages: ChatMessage | ChatMessage[]) => void;

  loadingType: "INIT" | "GREETING" | "GENERATING" | "NONE";
  setLoadingType: (type: "INIT" | "GREETING" | "GENERATING" | "NONE") => void;
}

const useConversationStore = create<ConversationStore>((set, get) => ({
  greeting: {
    topic: null,
    message: "Hi there! Welcome to the chat.",
    timestamp: null,
  },
  setGreeting: (greeting) => set({ greeting }),

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
