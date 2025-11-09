import { useGLTF, useAnimations } from "@react-three/drei";
import { useMemo, useRef } from "react";

export const useAllAnimations = () => {
  const group = useRef(null);

  // ─────────── ✅ Load all GLTFs safely (no loops, no dynamic calls) ───────────
  const a0 = useGLTF("/models/animations/masculine/idle/F_Standing_Idle_001.glb");
  const a1 = useGLTF("/models/animations/masculine/idle/F_Standing_Idle_Variations_001.glb");
  const a2 = useGLTF("/models/animations/masculine/idle/F_Standing_Idle_Variations_002.glb");
  const a3 = useGLTF("/models/animations/masculine/idle/F_Standing_Idle_Variations_003.glb");
  const a4 = useGLTF("/models/animations/masculine/idle/M_Standing_Idle_Variations_007.glb");
  const a5 = useGLTF("/models/animations/masculine/idle/M_Standing_Idle_Variations_005.glb");
  const a6 = useGLTF("/models/animations/masculine/idle/M_Standing_Idle_002.glb");
  const a7 = useGLTF("/models/animations/masculine/idle/M_Standing_Idle_Variations_010.glb");

  const a8 = useGLTF("/models/animations/masculine/locomotion/M_Walk_001.glb");

  const a9 = useGLTF("/models/animations/masculine/expression/M_Talking_Variations_001.glb");
  const a10 = useGLTF("/models/animations/masculine/expression/M_Talking_Variations_002.glb");
  const a11 = useGLTF("/models/animations/masculine/expression/M_Talking_Variations_003.glb");
  const a12 = useGLTF("/models/animations/masculine/expression/M_Talking_Variations_007.glb");
  const a13 = useGLTF("/models/animations/masculine/expression/M_Talking_Variations_009.glb");
  const a14 = useGLTF("/models/animations/masculine/expression/F_Talking_Variations_002.glb");
  const a15 = useGLTF("/models/animations/masculine/expression/M_Standing_Expressions_004.glb");
  const a16 = useGLTF("/models/animations/masculine/expression/M_Standing_Expressions_002.glb");
  const a17 = useGLTF("/models/animations/masculine/expression/M_Standing_Expressions_001.glb");
  const a18 = useGLTF("/models/animations/masculine/expression/M_Standing_Expressions_012.glb");
  const a19 = useGLTF("/models/animations/masculine/expression/M_Standing_Expressions_010.glb");
  const a20 = useGLTF("/models/animations/masculine/expression/M_Talking_Variations_005.glb");
  const a21 = useGLTF("/models/animations/masculine/expression/M_Talking_Variations_006.glb");

  // ─────────── ✅ Combine animations safely ───────────
  const allAnimations = useMemo(() => [
    ...a0.animations, ...a1.animations, ...a2.animations, ...a3.animations,
    ...a4.animations, ...a5.animations, ...a6.animations, ...a7.animations,
    ...a8.animations, ...a9.animations, ...a10.animations, ...a11.animations,
    ...a12.animations, ...a13.animations, ...a14.animations, ...a15.animations,
    ...a16.animations, ...a17.animations, ...a18.animations, ...a19.animations,
    ...a20.animations, ...a21.animations,
  ], [a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21]);

  // ─────────── ✅ Bind to character group ───────────
  const { actions, names } = useAnimations(allAnimations, group);

  return { group, actions, names };
};


export default useAllAnimations;