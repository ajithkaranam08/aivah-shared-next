import React, { useEffect, useMemo, useRef, useState } from "react";

import { Float, Html, Text, useGLTF } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { RoundedPlaneGeometry } from "maath/geometry";
import { Color, ColorRepresentation, Group, MeshStandardMaterial } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

import Overlay from "./shared-scene-components/overlay";

// Extend RoundedPlaneGeometry to Fiber
extend({ RoundedPlaneGeometry });

// === Types ===
export type SceneWidget = {
  type: "iframe" | "image" | "video";
  url: string;
};

export type SceneProps = {
  widgets?: SceneWidget[];
  sceneRotation?: number;
  dashboard: boolean;
  color: ColorRepresentation;
};

extend({ RoundedPlaneGeometry });

const useSceneSetup = (scene: any, color: any) => {
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.receiveShadow = true;
        child.material = new MeshStandardMaterial({
          map: child.material.map,
          color: color || child.material.color,
          roughness: 1,
          metalness: 0,
          emissiveIntensity: 10,
          side: child.material.side,
        });
      }
    });
  }, [scene, color]);
};

// === Main Component ===
const Scene: React.FC<SceneProps> = ({
  widgets = [],
  sceneRotation = degToRad(50),
  color,
}) => {
  const gltf = useGLTF("/models/zen.glb"); // Example 3D model path

  const memoizedBackgroundColor = useMemo(() => new Color(color), [color]);

  useSceneSetup(gltf, color);

  return (
    <group>
      {/* === Base 3D Model === */}

      <primitive object={gltf} rotation-y={sceneRotation} />

      <Overlay backgroundColor={memoizedBackgroundColor} />
    </group>
  );
};

export default Scene;

useGLTF.preload("/models/zen.glb");
