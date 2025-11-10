import { create } from "zustand";

interface CompanionState {
  isAudioPlaying: boolean;
  muteAvatar: boolean;
  stopGeneration: number;
  configureConversation: number;
  audioStopped: number;

  setAudioPlaying: (state: boolean) => void;
  setAudioStopped: (state: number) => void;
  setMute: (state: boolean) => void;
  setStopGeneration: (count: number) => void;
  setConfigureConversation: (state: number) => void;
  reset: () => void;
}

const companionStateInit = {
  isAudioPlaying: false,
  muteAvatar: false,
  stopGeneration: 0,
  audioStopped: 0,
};

export const useCompanionStore = create<CompanionState>((set) => ({
  ...companionStateInit,
  configureConversation: 0,
  setAudioPlaying: (s) => set({ isAudioPlaying: s }),
  setAudioStopped: (s) => set({ audioStopped: s }),
  setMute: (s) => set({ muteAvatar: s }),
  setStopGeneration: (n) => set({ stopGeneration: n }),
  setConfigureConversation: (s) => set({ configureConversation: s }),
  reset: () => set(companionStateInit),
}));

export interface VoiceModalStateProps {
  isRecording: boolean;
  voiceModalOpen: boolean;
  recordedType?: "SAVE" | "CANCEL" | "INIT";

  setIsRecording: (isRecording: boolean) => void;
  setVoiceModalOpen: (voiceModalOpen: boolean) => void;
  setRecordedType: (recordedType: "SAVE" | "CANCEL" | "INIT") => void;
  reset: () => void;
}

const voiceModalStateInit = {
  isRecording: false,
  voiceModalOpen: false,
  recordedType: "INIT",
} as const;

export const useVoiceModalStore = create<VoiceModalStateProps>((set) => ({
  ...voiceModalStateInit,
  setIsRecording: (isRecording) => set({ isRecording }),
  setVoiceModalOpen: (voiceModalOpen) => set({ voiceModalOpen }),
  setRecordedType: (recordedType) => set({ recordedType }),
  reset: () => set(voiceModalStateInit),
}));
