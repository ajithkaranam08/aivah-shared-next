import * as THREE from 'three';
import { useCallback } from 'react';

export const useMorphTargets = (scene: THREE.Object3D, nodes: any) => {
  const lerpMorph = useCallback((target: string, value: number, speed = 0.1) => {
    scene.traverse((child: any) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (index !== undefined)
          child.morphTargetInfluences[index] = THREE.MathUtils.lerp(
            child.morphTargetInfluences[index],
            value,
            speed
          );
      }
    });
  }, [scene]);

  const applyWolf3DMorph = useCallback((target: string, value: number, speed = 0.1) => {
    const wolf3DNodes = [
      nodes.Wolf3D_Head,
      nodes.Wolf3D_Teeth,
      nodes.EyeLeft,
      nodes.EyeRight,
      nodes.Wolf3D_Avatar
    ].filter(Boolean);

    wolf3DNodes.forEach((node: any) => {
      const idx = node.morphTargetDictionary?.[target];
      if (idx !== undefined)
        node.morphTargetInfluences[idx] = THREE.MathUtils.lerp(
          node.morphTargetInfluences[idx],
          value,
          speed
        );
    });
  }, [nodes]);

  return { lerpMorph, applyWolf3DMorph };
};
