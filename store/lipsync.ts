import { create } from "zustand";

export interface LipsyncData {
  viseme: string;
  volume: number;
  isActive: boolean;
  lastActiveTime?: number;
  intensity: number;
}

interface LipsyncState {
  lipsyncData: LipsyncData;
  setLipsyncData: (data: LipsyncData) => void;
}

export const useLipsyncStore = create<LipsyncState>((set) => ({
  lipsyncData: {
    viseme: "viseme_sil",
    volume: 0,
    isActive: false,
    lastActiveTime: undefined,
    intensity: 0,
  },
  setLipsyncData: (data) => set({ lipsyncData: data }),
}));
