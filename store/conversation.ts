import { DataReceivedProps } from "@/services/conversation/query";
import { create } from "zustand";

interface ConversationStore {
  greeding: DataReceivedProps;
  setGreeting: (greeding: DataReceivedProps) => void;

  transcription: string;
  setTranscription: (transcription: string) => void;
}

const useConversationStore = create<ConversationStore>((set) => ({
  greeding: {
    topic: null,
    message: "",
    timestamp: null,
  },
  setGreeting: (greeding) => set({ greeding }),

  transcription: "",
  setTranscription: (transcription) => set({ transcription }),
}));

export default useConversationStore;
