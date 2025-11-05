import { memo, useMemo, useRef } from "react";

import {
  Cylinder,
  MeshReflectorMaterial,
  Sparkles,
  useTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { Color, ColorRepresentation } from "three";

import DayNightScene from "../shared-scene-components/day-night";
import Overlay from "../shared-scene-components/overlay";

export const Standard = memo(({ color }: { color: ColorRepresentation }) => {
  // Load texture for alpha masking
  const alphaTexture = useTexture("/textures/radial_gradient.png");

  // Ref bound to the material (reflector or standard), never to the mesh
  const materialRef = useRef<any>(null);

  // Derived colors
  const baseColor = useMemo(() => new Color(color), [color]);
  const lightColor = useMemo(() => new Color(color).multiplyScalar(6), [color]);

  // Animate reflector color smoothing
  useFrame((_, delta) => {
    const mat = materialRef.current as any;
    const colorObj = mat?.color as Color | undefined;
    if (!colorObj) return;
    easing.dampC(colorObj, lightColor, 0.45, delta);
    easing.dampC(colorObj, lightColor, 0.25, delta);
  });

  const isMobile = () => {
    if (typeof navigator === "undefined") return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Reflective Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} receiveShadow>
        <circleGeometry args={[9, 32, 32]} />

        {isMobile() ? (
          <meshStandardMaterial ref={materialRef} />
        ) : (
          <MeshReflectorMaterial
            resolution={128}
            blur={[64, 64]}
            mixBlur={0.5}
            mixStrength={0.7}
            mirror={0.8}
            mixContrast={0.6}
            roughness={1}
            metalness={0.05}
            depthScale={0.5}
            minDepthThreshold={0.95}
            maxDepthThreshold={1}
            emissiveIntensity={0.3}
            transparent
            alphaMap={alphaTexture}
            alphaToCoverage
            ref={materialRef}
          />
        )}
      </mesh>

      {/* Background Cylinder */}
      <Cylinder
        args={[10, 10, 28, 32, 32, true, 1, Math.PI + 2.5]}
        position={[0, 5, -1]}
        rotation={[0, Math.PI / 2 - 1.5, 0]}
      >
        <DayNightScene backgroundColor={baseColor} />
      </Cylinder>

      {/* Sparkle Particles */}
      <Sparkles
        count={25}
        color="#c6c6c6"
        opacity={0.55}
        size={2.8}
        position={[0, 1, 0]}
        noise={[-0.05, 0.01, 0.05]}
        scale={[3, 4, 7]}
        speed={0.25}
      />

      {/* UI Overlay */}
      <Overlay backgroundColor={lightColor} />
    </group>
  );
});

Standard.displayName = "Standard";
