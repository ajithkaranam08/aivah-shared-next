// src/store/useAvatarStore.ts
import { create } from "zustand";

interface AvatarStateProps {
  currentAnimation: string;
  facialExpression: string;
  isWalking: boolean;
  position: [number, number, number];
  currentFacialExpression: "Focused" | "Happy" | "Sad" | "Angry" | "Neutral";

  setCurrentAnimation: (anim: string) => void;
  setFacialExpression: (expr: string) => void;
  setWalking: (isWalking: boolean) => void;
  setPosition: (pos: [number, number, number]) => void;
  setCurrentFacialExpression: (
    expression: "Focused" | "Happy" | "Sad" | "Angry" | "Neutral"
  ) => void;
  reset: () => void;
}

const avatarStoreInit = {
  currentAnimation: "Idle0",
  facialExpression: "Neutral",
  isWalking: false,
  position: [0, 0, 0] as [number, number, number],
  currentFacialExpression: "Neutral" as const,
};

export const useAvatarStore = create<AvatarStateProps>((set) => ({
  ...avatarStoreInit,

  setCurrentAnimation: (anim) => set({ currentAnimation: anim }),
  setFacialExpression: (expr) => set({ facialExpression: expr }),
  setWalking: (isWalking) => set({ isWalking }),
  setPosition: (pos) => set({ position: pos }),
  setCurrentFacialExpression: (expression) =>
    set({ currentFacialExpression: expression }),
  reset: () => set(avatarStoreInit),
}));
