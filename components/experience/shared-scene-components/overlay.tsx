"use client";

import { useEffect, useRef } from "react";

import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { animate, motionValue } from "motion";
import { AdditiveBlending, Color, ShaderMaterial, Vector2 } from "three";

// ----------------------
// 🎨 Shader Code
// ----------------------
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  #define PI 3.14159
  uniform float time;
  uniform float uProgress;
  uniform vec2 iResolution;
  uniform vec3 color;
  varying vec2 vUv;

  float random(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);
    float res = mix(
      mix(random(ip), random(ip + vec2(1.0, 0.0)), u.x),
      mix(random(ip + vec2(0.0, 1.0)), random(ip + vec2(1.0, 1.0)), u.x),
      u.y
    );
    return res * res;
  }

  float fbm(vec2 p, int octaves) {
    float n = 0.0;
    float a = 1.0;
    float norm = 0.0;
    for (int i = 0; i < octaves; ++i) {
      n += noise(p) * a;
      norm += a;
      p *= 2.0;
      a *= 0.5;
    }
    return n / norm;
  }

  void main() {
    vec2 uv = 0.5 - gl_FragCoord.xy / iResolution.xy;
    uv.y *= iResolution.y / iResolution.x;
    vec2 p = vec2(fbm(vec2(uv.x + time * 0.05, uv.y) * 18.0, 2) * 0.25);

    float t = uProgress * uProgress;
    float l = dot(uv / t, uv / t);
    l -= (fbm(normalize(uv) * 2.0, 20) - 0.5) * 3.5;
    float ink = fbm(p * 8.0, 1) + 1.5 - l + uProgress;

    vec3 col = clamp(vec3(smoothstep(0.7, ink, 0.1)) * color, 0., 1.);
    gl_FragColor = vec4(col, clamp(-ink, 0.0, 1.0));
  }
`;

// ----------------------
// 🧩 Define Custom Material
// ----------------------
const OverlayMaterial = shaderMaterial(
  {
    time: 0,
    uProgress: 0,
    iResolution: new Vector2(),
    color: new Color("#ffffff"),
  },
  vertexShader,
  fragmentShader
);

// 👇 Register the material so <overlayMaterial /> works as a JSX element
extend({ OverlayMaterial });

// 🔧 Custom Type for TypeScript
type OverlayMaterialImpl = ShaderMaterial & {
  time: number;
  uProgress: number;
  iResolution: Vector2;
  color: Color;
};

interface OverlayProps {
  backgroundColor: Color;
}

// ----------------------
// 🚀 Main Component
// ----------------------
export default function Overlay({ backgroundColor }: OverlayProps) {
  const materialRef = useRef<OverlayMaterialImpl>(null!);
  const { size, viewport } = useThree();

  // 🕒 Animate time
  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.time += delta;
    }
  });

  // 📏 Sync resolution on resize
  useEffect(() => {
    const mat = materialRef.current;
    mat.iResolution.set(
      size.width * Math.min(viewport.dpr, 1.5),
      size.height * Math.min(viewport.dpr, 1.5)
    );
  }, [size, viewport]);

  // 🌈 Animate progress
  useEffect(() => {
    const mat = materialRef.current;
    mat.color.copy(backgroundColor);

    const progress = motionValue(0);
    const animation = animate(progress, 1.5, {
      duration: 1.95,
      ease: "easeOut",
      onUpdate: (v) => (mat.uProgress = v),
    });

    return () => animation.stop();
  }, [backgroundColor]);

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      {/* @ts-ignore because JSX intrinsic type is dynamically extended */}
      <overlayMaterial
        ref={materialRef}
        depthTest={false}
        depthWrite={false}
        transparent
        blending={AdditiveBlending}
      />
    </mesh>
  );
}
