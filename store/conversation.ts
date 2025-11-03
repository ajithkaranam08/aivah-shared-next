import { DataReceivedProps } from "@/services/conversation/query";
import { create } from "zustand";

interface ConversationStore {
  greeding: DataReceivedProps;
  setGreeting: (greeding: DataReceivedProps) => void;

  transcription: string[];
  setTranscription: (transcription: string) => void;
}

const useConversationStore = create<ConversationStore>((set, get) => ({
  greeding: {
    topic: null,
    message: "",
    timestamp: null,
  },
  setGreeting: (greeding) => set({ greeding }),

  transcription: [],
  setTranscription: (transcription) => {
    const text = get().transcription;
    set({ transcription: [...text, transcription] });
  },
}));

export default useConversationStore;
