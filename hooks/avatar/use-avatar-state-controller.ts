import { useEffect } from "react";

import { randInt } from "three/src/math/MathUtils.js";

import { useAvatarStore } from "@/store/avatar";
import { useCompanionStore } from "@/store/companion";
import { useLipsyncStore } from "@/store/lipsync";

export const useAvatarStateController = (animations: any) => {
  const { idleAnimations, talkingAnimations } = animations;
  const { isWalking, currentAnimation, setCurrentAnimation, setWalking } =
    useAvatarStore();
  const {
    isAudioPlaying,
    currentFacialExpression,
    setCurrentFacialExpression,
  } = useCompanionStore();
  const { lipsyncData } = useLipsyncStore();

  useEffect(() => {
    const lipsyncActive = lipsyncData?.isActive && isAudioPlaying;

    if (lipsyncActive) {
      const talkingAnim =
        talkingAnimations[randInt(0, talkingAnimations.length - 1)];
      setCurrentAnimation(talkingAnim.name);
      setCurrentFacialExpression("Focused");
    } else if (isWalking) {
      setCurrentAnimation("Walk");
      setCurrentFacialExpression("Neutral");
    } else {
      const idleAnim = idleAnimations[randInt(0, idleAnimations.length - 1)];
      setCurrentAnimation(idleAnim.name);
      setCurrentFacialExpression("Neutral");
    }
  }, [isWalking, isAudioPlaying, lipsyncData]);
};
