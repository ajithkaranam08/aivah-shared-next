import { useEffect, useRef, useState } from "react";

import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { toast } from "sonner";
import * as THREE from "three";
import { randInt } from "three/src/math/MathUtils.js";
// import {
//   setAudioStopped,
//   setCurrentAnimation,
//   setCurrentFacialExpression,
//   setHighlightMuteButton,
//   setIsAudioPlaying
// } from '../../../../store/companion';

import { VISEMES } from "wawa-lipsync";

import { facialExpressions } from "@/constants/avatar/avater-facial-expressions";
import {
  DEBUG_MODE,
  FADE_DURATION,
  MOVEMENT_SPEED,
  ROTATION_SPEED,
} from "@/constants/avatar/config";
import { getCurrentState } from "@/helper/wawa-lipsync-manager";
import useAvatarAnimations from "@/hooks/avatar/use-avatar-animations";
import { useAvatarStore } from "@/store/avatar";
import { useCompanionStore } from "@/store/companion";
import { useLipsyncStore } from "@/store/lipsync";

const cameraDirection = new THREE.Vector3();
const targetQuaternion = new THREE.Quaternion();
const avatarPositionVec3 = new THREE.Vector3();
const targetDirection = new THREE.Vector3();
const targetQuaternionVector = new THREE.Vector3();

interface AvatarProps {
  modelUrl: string;
  currentMessage?: any;
  muteStatus?: boolean;
  stopAudio: number;
  chatId: number;
  activeSceneName: string;
}

function Avatar({
  modelUrl,
  currentMessage,
  muteStatus,
  stopAudio,
  chatId,
  activeSceneName,
}: AvatarProps) {
  const {
    position,
    setPosition,
    isWalking,
    currentAnimation,
    currentFacialExpression,
    setCurrentAnimation,
    setCurrentFacialExpression,
    setWalking,
  } = useAvatarStore();
  const {
    isAudioPlaying,
    muteAvatar,
    stopGeneration,
    configureConversation,
    setAudioPlaying,
    setAudioStopped,
  } = useCompanionStore();
  const { lipsyncData } = useLipsyncStore();

  const { nodes, scene } = useGLTF(modelUrl);
  const { nodes: nodesMorphTargets } = useGLTF(
    "/models/BaseModelOptimized.glb"
  );
  const [blink, setBlink] = useState(false);
  const hips = nodes.Hips;
  const { camera } = useThree();

  const setAvatarPosition = setPosition;
  const avatarPosition = position;

  const storeStopGeneration = stopGeneration;

  const defaultSetting = {
    playAudio: true,
    headFollow: true,
    morphTargetSmoothing: 0.08,
    winkSmoothing: 0.5,
    script: {
      value: "speech",
      options: ["speech", "Idle0", "Greeting"],
    },
  };

  const { morphTargetSmoothing, winkSmoothing } = defaultSetting;

  const audio = currentMessage?.audio;

  // Use Redux state for animation and facial expression

  // Loading animations with enhanced categorization
  const { actions, group, idleAnimations, talkingAnimations } =
    useAvatarAnimations();

  const [audioError, setAudioError] = useState(false);

  // Demo-style viseme handling - no state needed, use lipsyncManager directly

  const muteWhenNeeded = () => {
    if (audio) {
      if (muteAvatar) {
        audio.muted = true;
        resetMorphTargets();
      } else {
        if (audioError && audio?.paused) {
          const promise = audio.play();
          if (promise !== undefined) {
            promise
              .catch(() => {
                toast.warning("Browser is unable to play audio.");
              })
              .then(() => {
                // dispatch(setHighlightMuteButton(false));
                setAudioError(false);
              });
          }
        }
        audio.muted = false;
      }
    }
  };

  useEffect(() => {
    muteWhenNeeded();
  }, [muteAvatar]);

  useEffect(() => {
    const audioEvent = (e: Event) => {
      if (e.type === "playing") {
        setAudioPlaying(true);
      } else {
        setAudioPlaying(false);
      }
    };
    if (audio) {
      audio.addEventListener("playing", audioEvent);
      audio.addEventListener("pause", audioEvent);
    }

    return () => {
      if (audio) {
        audio.removeEventListener("playing", audioEvent);
        audio.removeEventListener("pause", audioEvent);
      }
    };
  }, [audio]);

  // Initialize dispatch for wawa-lipsync-manager
  // useEffect(() => {
  //     setDispatch(dispatch);
  // }, [dispatch]);

  useEffect(() => {
    if (storeStopGeneration > 0) {
      if (audio) {
        audio.pause();
      }
      // Clean up any local state
      resetMorphTargets();
      const idleAnimation = "Idle" + randInt(0, idleAnimations.length - 1);
      setCurrentAnimation(idleAnimation);
    }
  }, [storeStopGeneration]);

  useEffect(() => {
    if (configureConversation) {
      if (audio) {
        resetMorphTargets();
        audio.pause();
      }
      // Clean up any local state
      resetMorphTargets();
      const idleAnimation = "Idle" + randInt(0, idleAnimations.length - 1);
      setCurrentAnimation(idleAnimation);
    }
  }, [configureConversation]);

  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (
          index === undefined ||
          child.morphTargetInfluences[index] === undefined
        ) {
          return;
        }
        child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );
      }
    });
  };

  // Wolf3D-style enhanced morph target handling
  const applyMorphTargetToWolf3DNodes = (target, value, speed = 0.1) => {
    const wolf3DNodes = [
      nodes.Wolf3D_Head,
      nodes.Wolf3D_Teeth,
      nodes.EyeLeft,
      nodes.EyeRight,
      nodes.Wolf3D_Avatar,
    ].filter(Boolean);

    wolf3DNodes.forEach((node) => {
      if (node?.morphTargetDictionary && node?.morphTargetInfluences) {
        const index = node.morphTargetDictionary[target];
        if (
          index !== undefined &&
          node.morphTargetInfluences[index] !== undefined
        ) {
          node.morphTargetInfluences[index] = THREE.MathUtils.lerp(
            node.morphTargetInfluences[index],
            value,
            speed
          );
        }
      }
    });
  };

  // DISABLED: Regular audio processing - Only use LiveKit lipsync to prevent conflicts
  // The avatar component should only handle visual animation, not audio processing
  // Audio processing is handled by conversation components with LiveKit integration
  useEffect(() => {
    if (!audio) {
      // Clean up when no audio
      return;
    }

    // DO NOT connect regular audio to wawa-lipsync to prevent dual audio
    // Only use for event handling, not lipsync processing
    const handleEnded = () => {
      setAudioStopped(1);
      resetMorphTargets();
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audio]); // Removed isProcessing dependency to prevent conflicts

  // UNIFIED ANIMATION CONTROLLER - Single source of truth
  useEffect(() => {
    const isLipsyncActive =
      lipsyncData && lipsyncData.isActive && isAudioPlaying;

    console.log("🎭 Unified Animation Controller:", {
      isLipsyncActive,
      volume: lipsyncData?.volume || 0,
      isWalking,
      currentMessage: !!currentMessage,
    });

    // CLEAR ALL PREVIOUS INTERVALS TO PREVENT CONFLICTS
    // This ensures only one animation system is active at a time

    if (isLipsyncActive) {
      // LIPSYNC MODE: Set a single talking animation and let lipsync handle mouth
      const talkingAnim =
        talkingAnimations[randInt(0, talkingAnimations.length - 1)];
      setCurrentAnimation(talkingAnim.name);

      // Set a neutral expression to not conflict with lipsync
      setCurrentFacialExpression("Focused");
    } else if (isWalking) {
      // WALKING MODE
      setCurrentAnimation("Walk");
      setCurrentFacialExpression("Neutral");
    } else {
      // IDLE MODE
      resetMorphTargets(); // Clean morphs for idle
      const idleAnim = idleAnimations[randInt(0, idleAnimations.length - 1)];
      setCurrentAnimation(idleAnim.name);
      setCurrentFacialExpression("Neutral");
    }

    // NO INTERVALS OR TIMEOUTS - Let animations play naturally
  }, [lipsyncData?.isActive, isAudioPlaying, isWalking]);

  // DISABLED: Animation updates from websocket - handled by unified controller
  // This prevents conflicts with the main animation system
  /*
    useEffect(() => {
      if (animationUpdate) {
        const animationAndExpression = generateRandomAnimationAndExpression();
        setAnimation(animationAndExpression.animation);
        dispatch(setCurrentAnimation(animationAndExpression.animation));
        setFacialExpression(animationAndExpression.facialExpression);
        dispatch(setCurrentFacialExpression(animationAndExpression.facialExpression));
      }
    }, [animationUpdate, dispatch]);
    */

  // ENHANCED WOLF3D APPROACH: Improved blinking and viseme handling
  useFrame(() => {
    // Enhanced Wolf3D-style blinking with better node targeting
    const blinkValue = blink ? 1 : 0;
    applyMorphTargetToWolf3DNodes("eyeBlinkLeft", blinkValue, winkSmoothing);
    applyMorphTargetToWolf3DNodes("eyeBlinkRight", blinkValue, winkSmoothing);
    // Fallback for non-Wolf3D nodes
    lerpMorphTarget("eyeBlinkLeft", blinkValue, winkSmoothing);
    lerpMorphTarget("eyeBlinkRight", blinkValue, winkSmoothing);

    // Handle avatar positioning
    if (hips) hips.position.set(0, hips.position.y, 0);
    handleAvatarPosition();

    // Handle facial expressions (when lipsync is not active)
    if (!DEBUG_MODE && !(lipsyncData && lipsyncData.isActive)) {
      Object.keys(nodes.Wolf3D_Avatar?.morphTargetDictionary || {}).forEach(
        (key) => {
          if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") {
            return; // eyes wink/blink are handled separately
          }
          const mapping = facialExpressions[currentFacialExpression];
          if (mapping?.[key]) {
            lerpMorphTarget(key, mapping[key], 0.1);
          } else {
            lerpMorphTarget(key, 0, 0.1);
          }
        }
      );
    }

    // ENHANCED WOLF3D PATTERN: Improved viseme handling with enhanced smoothing
    if (lipsyncData && lipsyncData.isActive) {
      const viseme = lipsyncData.viseme;
      const state = getCurrentState();

      // Wolf3D-style smooth movements with state-aware speeds
      const smoothMovements = true;
      const isVowel = state === "vowel";
      // Enhanced speed calculation based on Wolf3D demo
      const applySpeed = smoothMovements ? (isVowel ? 0.2 : 0.4) : 1;
      const resetSpeed = smoothMovements ? (isVowel ? 0.1 : 0.2) : 1;

      // Apply current viseme with Wolf3D-style intensity and speed
      applyMorphTargetToWolf3DNodes(viseme, 1.0, applySpeed);
      // Fallback for non-Wolf3D nodes
      lerpMorphTarget(viseme, 1.0, applySpeed);

      // Reset all other visemes with Wolf3D-style cleanup
      Object.values(VISEMES).forEach((value) => {
        if (viseme === value) return; // Skip current viseme
        applyMorphTargetToWolf3DNodes(value, 0, resetSpeed);
        lerpMorphTarget(value, 0, resetSpeed);
      });
    } else {
      // Enhanced reset for all visemes when idle
      Object.values(VISEMES).forEach((viseme) => {
        applyMorphTargetToWolf3DNodes(viseme, 0, morphTargetSmoothing);
        lerpMorphTarget(viseme, 0, morphTargetSmoothing);
      });
    }
  });

  const isInit = useRef(false);

  // Enhanced Wolf3D-style animation handling with improved transitions
  useEffect(() => {
    if (DEBUG_MODE) {
      return;
    }
    if (actions[currentAnimation]) {
      // Wolf3D-style animation transitions with mixer state awareness
      const mixer = actions[currentAnimation].getMixer();
      const fadeInDuration = isInit.current ? FADE_DURATION : 0;
      // Enhanced animation setup inspired by Wolf3D demo
      actions[currentAnimation]
        ?.reset()
        .fadeIn(mixer.stats.actions.inUse === 0 ? 0 : fadeInDuration)
        .play();
      isInit.current = true;
      return () => {
        // Wolf3D-style fadeOut with proper cleanup
        actions[currentAnimation]?.fadeOut(FADE_DURATION);
      };
    }
  }, [actions, currentAnimation]);

  useEffect(() => {
    if (audio) {
      audio.muted = muteStatus;
    }
  }, [muteStatus]);

  useEffect(() => {
    if (stopAudio === 1) if (audio) audio.pause();
  }, [stopAudio]);

  useEffect(() => {
    nodes.Scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        // child.receiveShadow = true;
      }
    });
  }, [nodes.Scene]);

  // Enhanced Wolf3D-style blinking system
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    let blinkDurationTimeout: NodeJS.Timeout;
    const nextBlink = () => {
      // Wolf3D-style random blink intervals (1-5 seconds)
      const nextBlinkDelay = THREE.MathUtils.randInt(1000, 5000);

      blinkTimeout = setTimeout(() => {
        setBlink(true);
        // Wolf3D-style blink duration (150-250ms for natural feel)
        const blinkDuration = THREE.MathUtils.randInt(150, 250);

        blinkDurationTimeout = setTimeout(() => {
          setBlink(false);
          nextBlink(); // Schedule next blink
        }, blinkDuration);
      }, nextBlinkDelay);
    };
    nextBlink();
    return () => {
      clearTimeout(blinkTimeout);
      clearTimeout(blinkDurationTimeout);
    };
  }, []);

  useEffect(() => {
    if (!nodes.Wolf3D_Avatar) {
      nodes.Wolf3D_Avatar = nodes.Wolf3D_Head;
      if (nodes.Wolf3D_Avatar?.morphTargetInfluences) {
        nodes.Wolf3D_Avatar.morphTargetInfluences[0] = 1;
      }
      if (
        nodes.Wolf3D_Avatar?.morphTargetInfluences &&
        nodesMorphTargets.Wolf3D_Head?.morphTargetInfluences
      ) {
        nodes.Wolf3D_Avatar.morphTargetInfluences =
          nodesMorphTargets.Wolf3D_Head.morphTargetInfluences;
        nodes.Wolf3D_Avatar.morphTargetDictionary =
          nodesMorphTargets.Wolf3D_Head.morphTargetDictionary;
        nodes.Wolf3D_Avatar.geometry.morphAttributes =
          nodesMorphTargets.Wolf3D_Head.geometry.morphAttributes;
      }
    }
  }, [nodes, nodesMorphTargets]);

  if (!nodes.Wolf3D_Avatar) {
    nodes.Wolf3D_Avatar = nodes.Wolf3D_Head;
    if (nodes.Wolf3D_Avatar) {
      nodes.Wolf3D_Avatar.morphTargetInfluences =
        nodesMorphTargets.Wolf3D_Head.morphTargetInfluences;
      nodes.Wolf3D_Avatar.morphTargetDictionary =
        nodesMorphTargets.Wolf3D_Head.morphTargetDictionary;
      nodes.Wolf3D_Avatar.geometry.morphAttributes =
        nodesMorphTargets.Wolf3D_Head.geometry.morphAttributes;
    }
  }

  useEffect(() => {
    avatarPositionVec3.set(
      avatarPosition[0],
      avatarPosition[1],
      avatarPosition[2]
    );
    if (!group?.current) return;
    cameraDirection
      .set(
        camera.position.x - group.current.position.x,
        0,
        camera.position.z - group.current.position.z
      )
      .normalize();
  }, [avatarPosition]);

  function handleAvatarPosition() {
    if (!group?.current) return;
    if (avatarPosition) {
      if (
        group.current.position &&
        group.current.position.distanceTo(avatarPositionVec3) > 0.1
      ) {
        const direction = avatarPositionVec3
          .clone()
          .sub(group.current.position)
          .normalize()
          .multiplyScalar(MOVEMENT_SPEED);
        group.current.position.add(direction);

        targetDirection
          .set(
            avatarPositionVec3.x - group.current.position.x,
            0,
            avatarPositionVec3.z - group.current.position.z
          )
          .normalize();

        targetQuaternion.setFromUnitVectors(
          targetQuaternionVector.set(0, 0, 1),
          targetDirection
        );

        group.current.quaternion.slerp(targetQuaternion, ROTATION_SPEED);

        setWalking(true);
      } else {
        cameraDirection
          .set(
            camera.position.x - group.current.position.x,
            0,
            camera.position.z - group.current.position.z
          )
          .normalize();

        targetQuaternion.setFromUnitVectors(
          targetQuaternionVector.set(0, 0, 1),
          cameraDirection
        );

        group.current.quaternion.slerp(targetQuaternion, ROTATION_SPEED);

        isWalking && setWalking(false);
      }
    }
  }

  useEffect(() => {
    const walkAnimation = isWalking ? "Walk" : "Idle0";
    setCurrentAnimation(walkAnimation);
  }, [isWalking]);

  useEffect(() => {
    const scenePositionMap: Record<string, [number, number, number]> = {
      zen: [-1.5, 0, -0.5],
      empty: [0, 0, 0],
      presentation: [-1.5, 0, -0.5],
      presentation2: [-1.5, 0, -0.5],
    };

    const scenePosition = scenePositionMap[activeSceneName];

    if (scenePosition) {
      setAvatarPosition(scenePosition);
    }
  }, [activeSceneName]);

  function resetMorphTargets() {
    const traditionalTargets = [
      "mouthOpen",
      "jawOpen",
      "teethOpen",
      "mouthClose",
      "jawClose",
      "mouthSmileLeft",
      "mouthSmileRight",
      "cheekSquintLeft",
      "cheekSquintRight",
    ];

    // Enhanced Wolf3D-style reset for traditional morph targets
    traditionalTargets.forEach((target) => {
      const speed =
        target.includes("Smile") || target.includes("Squint")
          ? morphTargetSmoothing / 2
          : morphTargetSmoothing;
      applyMorphTargetToWolf3DNodes(target, 0, speed);
      lerpMorphTarget(target, 0, speed);
    });

    // Enhanced reset for all viseme morph targets (Wolf3D approach)
    Object.values(VISEMES).forEach((viseme) => {
      applyMorphTargetToWolf3DNodes(viseme, 0, morphTargetSmoothing);
      lerpMorphTarget(viseme, 0, morphTargetSmoothing);
    });
  }

  return (
    <group dispose={null} ref={group}>
      <primitive object={nodes.Scene} />
    </group>
  );
}

export default Avatar;

useGLTF.preload("/models/BaseModelOptimized.glb");
useGLTF.preload("/models/animations/masculine/idle/F_Standing_Idle_001.glb");
useGLTF.preload(
  "/models/animations/masculine/idle/F_Standing_Idle_Variations_002.glb"
);
useGLTF.preload(
  "/models/animations/masculine/idle/F_Standing_Idle_Variations_003.glb"
);
useGLTF.preload(
  "/models/animations/masculine/idle/M_Standing_Idle_Variations_007.glb"
);
useGLTF.preload(
  "/models/animations/masculine/idle/M_Standing_Idle_Variations_005.glb"
);
useGLTF.preload("/models/animations/masculine/idle/M_Standing_Idle_002.glb");
useGLTF.preload(
  "/models/animations/masculine/idle/M_Standing_Idle_Variations_010.glb"
);
useGLTF.preload("/models/animations/masculine/locomotion/M_Walk_001.glb");
useGLTF.preload(
  "/models/animations/masculine/expression/M_Talking_Variations_001.glb"
);
useGLTF.preload(
  "/models/animations/masculine/expression/M_Talking_Variations_002.glb"
);
useGLTF.preload(
  "/models/animations/masculine/expression/M_Talking_Variations_003.glb"
);
useGLTF.preload(
  "/models/animations/masculine/expression/M_Talking_Variations_007.glb"
);
useGLTF.preload(
  "/models/animations/masculine/expression/M_Talking_Variations_009.glb"
);
useGLTF.preload(
  "/models/animations/masculine/expression/F_Talking_Variations_002.glb"
);
useGLTF.preload(
  "/models/animations/masculine/expression/M_Standing_Expressions_004.glb"
);
useGLTF.preload(
  "/models/animations/masculine/expression/M_Standing_Expressions_002.glb"
);
useGLTF.preload(
  "/models/animations/masculine/expression/M_Standing_Expressions_001.glb"
);
useGLTF.preload(
  "/models/animations/masculine/expression/M_Standing_Expressions_012.glb"
);
useGLTF.preload(
  "/models/animations/masculine/expression/M_Standing_Expressions_010.glb"
);
useGLTF.preload(
  "/models/animations/masculine/expression/M_Talking_Variations_005.glb"
);
useGLTF.preload(
  "/models/animations/masculine/expression/M_Talking_Variations_006.glb"
);
useGLTF.preload(
  "/models/animations/masculine/expression/F_Talking_Variations_002.glb"
);
useGLTF.preload(
  "/models/animations/masculine/idle/F_Standing_Idle_Variations_001.glb"
);
