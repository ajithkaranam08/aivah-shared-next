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
}

export const useCompanionStore = create<CompanionState>((set) => ({
  isAudioPlaying: false,
  lipsyncData: null,
  muteAvatar: false,
  stopGeneration: 0,
  audioStopped: 0,

  configureConversation: 0,
  setAudioPlaying: (s) => set({ isAudioPlaying: s }),
  setAudioStopped: (s) => set({ audioStopped: s }),
  setMute: (s) => set({ muteAvatar: s }),
  setStopGeneration: (n) => set({ stopGeneration: n }),
  setConfigureConversation: (s) => set({ configureConversation: s }),
}));

interface VoiceModalState {
  isRecording: boolean;
  voiceModalOpen: boolean;

  setIsRecording: (isRecording: boolean) => void;
  setVoiceModalOpen: (voiceModalOpen: boolean) => void;
}

export const useVoiceModalStore = create<VoiceModalState>((set) => ({
  isRecording: false,
  voiceModalOpen: false,
  setIsRecording: (isRecording) => set({ isRecording }),
  setVoiceModalOpen: (voiceModalOpen) => set({ voiceModalOpen }),
}));
