import { useEffect } from "react";

import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

export interface GLTFWithNodes extends GLTF {
  nodes: Record<string, any>;
  materials?: Record<string, any>;
}
export function useAvatarModel(modelUrl: string) {
  const { nodes, scene } = useGLTF(modelUrl) as GLTFWithNodes;
  const { nodes: morphNodes } = useGLTF(
    "/models/BaseModelOptimized.glb"
  ) as GLTFWithNodes;

  useEffect(() => {
    if (!nodes || !morphNodes) return;

    const dst = nodes.Wolf3D_Avatar ?? nodes.Wolf3D_Head ?? null;
    const src = morphNodes.Wolf3D_Head ?? null;

    if (dst && src) {
      if (!dst.morphTargetDictionary && src.morphTargetDictionary) {
        dst.morphTargetDictionary = { ...src.morphTargetDictionary };
      }
      if (
        (!dst.morphTargetInfluences ||
          dst.morphTargetInfluences.length === 0) &&
        src.morphTargetInfluences
      ) {
        dst.morphTargetInfluences = src.morphTargetInfluences.slice();
      }
      if (dst.geometry && src.geometry && !dst.geometry.morphAttributes) {
        dst.geometry.morphAttributes = src.geometry.morphAttributes;
      }
      nodes.Wolf3D_Avatar = dst;
    }
  }, [nodes, morphNodes]);

  useEffect(() => {
    if (!scene) return;
    scene.traverse((child: any) => {
      if (child.isMesh) child.castShadow = true;
    });
  }, [scene]);

  return { nodes, scene };
}
