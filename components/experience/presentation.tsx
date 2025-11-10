import React, { useEffect, useMemo } from "react";

import { Float, Html, RoundedBoxGeometry, useGLTF } from "@react-three/drei";
import { extend, ObjectMap } from "@react-three/fiber";
import { RoundedPlaneGeometry } from "maath/geometry";
import { Color, ColorRepresentation, Mesh, MeshStandardMaterial } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

import Overlay from "./shared-scene-components/overlay";
import { GLTF } from "three-stdlib";

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
  color: ColorRepresentation;
};
/**
 * 
 * @param scene 
 * @param color 
 */
const useSceneSetup = (gltf?: GLTF & ObjectMap, color?: ColorRepresentation) => {
  useEffect(() => {
    console.log(gltf?.scene)
    if (!gltf) return;
    gltf.scene?.traverse?.((child) => {
      console.log({ child })
      const mesh = child as Mesh;
      if (mesh.isMesh) {
        mesh.receiveShadow = true;
        const material = mesh.material as MeshStandardMaterial;
        mesh.material = new MeshStandardMaterial({
          map: material.map,
          color: color || material.color,
          roughness: 1,
          metalness: 0,
          emissiveIntensity: 10,
          side: material.side,
        });
      }
    });
  }, [gltf, color]);
};

// === Main Component ===
const Scene: React.FC<SceneProps> = ({
  widgets = [],
  color,
}) => {
  const gltf = useGLTF("/models/zen.glb");
  const drone = useGLTF('/models/quadrocopter_drone.glb');

  const memoizedBackgroundColor = useMemo(() => new Color(color), [color]);

  useSceneSetup(gltf, color);

  return (
    <group>
      <Float floatIntensity={5} rotationIntensity={2} position-z={-1} position-x={-3} position-y={2}>
        <group scale={0.3}>
          <primitive object={drone.scene} />
        </group>
      </Float>
      {/* === Base 3D Model === */}

      <Html
        castShadow
        receiveShadow
        occlude="blending"
        position-y={1.3}
        position-z={-0.4}
        transform
        scale={0.101}
        className="p-0 m-0"
        geometry={<RoundedBoxGeometry args={[4, 2.225, 0.06]} />}

      >
        <div className="overflow-hidden bg-transparent p-0">
          <iframe
            allowFullScreen
            width={1600}
            height={900}
            src={"https://www.youtube.com/embed/7j_NE6Pjv-E?si=R6_1zzCKdUwHcA69"}
          />

        </div>

      </Html>

      <primitive object={gltf.scene} rotation-y={degToRad(50)} />

      <Overlay backgroundColor={memoizedBackgroundColor} />
    </group>
  );
};

export default Scene;

useGLTF.preload("/models/zen.glb");
useGLTF.preload("/models/quadrocopter_drone.glb");
