"use client";

import React, { useEffect, useMemo } from "react";
import { Float, Html, RoundedBoxGeometry, useGLTF } from "@react-three/drei";
import { extend, ObjectMap } from "@react-three/fiber";
import { RoundedPlaneGeometry } from "maath/geometry";
import { Color, ColorRepresentation, Mesh, MeshStandardMaterial } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { GLTF } from "three-stdlib";
import YouTube, { YouTubeProps } from "react-youtube";

import Overlay from "./shared-scene-components/overlay";
import { SceneWidget } from ".";

// Extend geometry for Fiber
extend({ RoundedPlaneGeometry });

export type SceneProps = {
  widget?: SceneWidget;
  sceneRotation?: number;
  color: ColorRepresentation;
};

const useSceneSetup = (gltf?: GLTF & ObjectMap, color?: ColorRepresentation) => {
  useEffect(() => {
    if (!gltf) return;
    gltf.scene?.traverse?.((child) => {
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

const PresentationScene: React.FC<SceneProps> = ({
  widget,
  sceneRotation = degToRad(50),
  color,
}: SceneProps) => {
  const gltf = useGLTF("/models/zen.glb");
  const drone = useGLTF("/models/quadrocopter_drone.glb");
  const memoizedBackgroundColor = useMemo(() => new Color(color), [color]);

  useSceneSetup(gltf, color);

  // YouTube options
  const videoId = widget?.url
    ? widget.url.split("v=")[1]?.split("&")[0] // extract ID if it's a normal YouTube URL
    : "7j_NE6Pjv-E";

  const opts: YouTubeProps["opts"] = {
    height: "900",
    width: "1600",
    playerVars: {
      autoplay: 1,
      rel: 0,
      modestbranding: 1,
      controls: 0,
      mute: 1, // avoids autoplay block
      loop: 1,
      playlist: videoId, // needed for looping
    },
  };

  return (
    <group>
      <Float floatIntensity={5} rotationIntensity={2} position-z={-1} position-x={-3} position-y={2}>
        <group scale={0.3}>
          <primitive object={drone.scene} />
        </group>
      </Float>

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
        <div className="overflow-hidden rounded-lg bg-transparent p-0">
          <YouTube videoId={videoId} opts={opts} />
        </div>
      </Html>

      <primitive object={gltf.scene} rotation-y={sceneRotation} />

      <Overlay backgroundColor={memoizedBackgroundColor} />
    </group>
  );
};

export default PresentationScene;

useGLTF.preload("/models/zen.glb");
useGLTF.preload("/models/quadrocopter_drone.glb");
