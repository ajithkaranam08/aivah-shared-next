// src/store/useAvatarStore.ts
import { create } from "zustand";

interface AvatarState {
    currentAnimation: string;
    facialExpression: string;
    isWalking: boolean;
    position: [number, number, number];
    currentFacialExpression: 'Focused' | 'Happy' | 'Sad' | 'Angry' | 'Neutral';

    setCurrentAnimation: (anim: string) => void;
    setFacialExpression: (expr: string) => void;
    setWalking: (isWalking: boolean) => void;
    setPosition: (pos: [number, number, number]) => void;
    setCurrentFacialExpression: (expression: 'Focused' | 'Happy' | 'Sad' | 'Angry' | 'Neutral') => void;

}

export const useAvatarStore = create<AvatarState>((set) => ({
    currentAnimation: "Idle0",
    facialExpression: "Neutral",
    isWalking: false,
    position: [0, 0, 0],
    currentFacialExpression: 'Neutral',

    setCurrentAnimation: (anim) => set({ currentAnimation: anim }),
    setFacialExpression: (expr) => set({ facialExpression: expr }),
    setWalking: (isWalking) => set({ isWalking }),
    setPosition: (pos) => set({ position: pos }),
    setCurrentFacialExpression: (expression) => set({ currentFacialExpression: expression }),

}));
