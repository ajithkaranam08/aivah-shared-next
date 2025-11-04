import { DataReceivedProps } from "@/services/conversation/query";
import { create } from "zustand";

interface ConversationStore {
  greeding: DataReceivedProps;
  setGreeding: (greeding: DataReceivedProps) => void;

  transcription: string;
  setTranscription: (transcription: string) => void;

  messages: {
    content: string;
    sender: "user" | "bot";
    timestamp: string | Date;
  }[];
  setMesages: (messages: {
    content: string;
    sender: "user" | "bot";
    timestamp: string | Date;
  }) => void;
}

const useConversationStore = create<ConversationStore>((set, get) => ({
  greeding: {
    topic: null,
    message: "",
    timestamp: null,
  },
  setGreeding: (greeding) => set({ greeding }),

  transcription: "",
  setTranscription: (words) => {
    set({ transcription: words });
  },

  messages: [],
  setMesages: (newMessages) =>
    set({ messages: [newMessages, ...get().messages] }),
}));

export default useConversationStore;
