import { DataReceivedProps } from "@/services/conversation/query";
import { create } from "zustand";

interface ConversationStore {
  greeding: DataReceivedProps;
  setGreeting: (greeding: DataReceivedProps) => void;
}

const useConversationStore = create<ConversationStore>((set) => ({
  greeding: {
    topic: null,
    message: "",
    timestamp: null,
  },
  setGreeting: (greeding) => set({ greeding }),
}));

export default useConversationStore;
