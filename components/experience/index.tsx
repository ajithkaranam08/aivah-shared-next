"use client";
import { Suspense, useCallback, useEffect, useMemo, useRef } from "react";

import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Color, ColorRepresentation } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

import { Skeleton } from "../ui/skeleton";
import Avatar from "./avater";
import CameraRig from "./shared-scene-components/camera-rig";
import EnvironmentLightSetup from "./shared-scene-components/shared-scene-components";
import { Standard } from "./standard";
import PresentationScene from "./presentation";

export type SceneWidget = {
  type: "iframe" | "image" | "video" | "attachment" | "youtubeurl";
  url: string;
};

export type SceneProps = {
  widgets?: SceneWidget;
  sceneRotation?: number;
  dashboard: boolean;
  color: ColorRepresentation;
};

export type ExperienceProps = {
  modelUrl: string;
  currentMessage?: object;
  idleCase?: string;
  chatId?: number;
  focus?: "face" | "body";
  scene?:
  | "videowall"
  | "empty"
  | "zen"
  | "webresults"
  | "presentation"
  | "presentation2";
  color?: string;
  widget?: SceneWidget;
  companionType?: string;
};

const AVATAR_PLACEMENT: Record<
  string,
  { position: [number, number, number]; rotation: [number, number, number] }
> = {
  face: {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
  body: {
    position: [0, 0, -0.45],
    rotation: [0, 0, 0],
  },
  zen: {
    position: [0, 0, 0],
    rotation: [0, degToRad(27), 0],
  },
  dashboard: {
    position: [-1.5, 0, 0.5],
    rotation: [0, degToRad(27), 0],
  },
  webresults: {
    position: [0, 0, 0],
    rotation: [0, degToRad(27), 0],
  },
  videowall: {
    position: [0, 0, -1],
    rotation: [0, 0, 0],
  },
  orbe: {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
  },
  presentation: {
    position: [-2, 0, 0],
    rotation: [0, degToRad(27), 0],
  },
  presentation2: {
    position: [0, 0, 0],
    rotation: [0, degToRad(27), 0],
  },
};

const Experience = ({
  modelUrl,
  focus = "body",
  scene = "empty",
  color = "#4E5481",
  companionType,
  widget
}: ExperienceProps) => {
  const lightBackgroundColor = new Color(color).multiplyScalar(3.5);

  const avatarPlacement =
    scene === "empty" ? AVATAR_PLACEMENT["face"] : AVATAR_PLACEMENT[scene];

  return (
    <div className="flex-center relative size-full">
      <Suspense fallback={null}>
        <div className="pointer-events-none absolute inset-0 z-1 flex items-center justify-center">
          <Skeleton className="size-full" />
        </div>
      </Suspense>
      <Canvas
        shadows
        camera={{
          position: [0, 10, 10],
          fov: 70,
        }}
        className="h-full w-full z-10"
        dpr={[1, 1.5]}
      >
        <color
          attach="background"
          args={["#" + lightBackgroundColor.getHexString()]}
        />
        <CameraHandler
          focus={focus}
          scene={scene}
          companionType={companionType}
        />
        <ambientLight intensity={0.5} />

        <CameraRig>


          {scene === "presentation" ?
            <PresentationScene color={color} widget={widget} />
            : <Standard color={color} />}

          <group
            position={avatarPlacement.position}
            rotation={avatarPlacement.rotation}
          >
            <Suspense fallback={null}>
              <Avatar modelUrl={modelUrl} />
            </Suspense>
          </group>

          <directionalLight
            castShadow
            color="white"
            intensity={0.25}
            position={[5, 10, 5]}
            shadow-mapSize-width={256}
            shadow-mapSize-height={256}
            shadow-camera-far={50}
            shadow-camera-left={-3}
            shadow-camera-right={3}
            shadow-camera-top={6}
            shadow-camera-bottom={-3}
            shadow-bias={-0.0001}
            shadow-normalBias={0.1}
          />
        </CameraRig>
        <EnvironmentLightSetup />
      </Canvas>
    </div>
  );
};

type CameraVariants =
  | "face"
  | "body"
  | "zen"
  | "dashboard"
  | "webresults"
  | "videowall"
  | "orbe"
  | "presentation"
  | "presentation2";

const CAMERA_SETTINGS: Record<
  CameraVariants,
  { lookAt: number[]; fov: number }
> = {
  face: {
    lookAt: [0, 1.6, 1.5, 0, 1.6, 0],
    fov: 30,
  },
  body: {
    lookAt: [0, 1.5, 3.45, 0, 1.1, 0],
    fov: 70,
  },
  zen: {
    lookAt: [0, 1.5, 3.45, 0, 1.1, 0],
    fov: 70,
  },
  dashboard: {
    lookAt: [0, 1.5, 3.45, 0, 1.1, 0],
    fov: 70,
  },
  webresults: {
    lookAt: [0, 1.5, 3.45, 0, 1.1, 0],
    fov: 70,
  },
  videowall: {
    lookAt: [0, 1, 2.5, 0, 1.2, -1],
    fov: 65,
  },
  orbe: {
    lookAt: [0, 1.5, 3.45, 0, 1.1, 0],
    fov: 70,
  },
  presentation: {
    lookAt: [0, 1.5, 3.45, 0, 1.1, 0],
    fov: 70,
  },
  presentation2: {
    lookAt: [0, 1.5, 3.45, 0, 1.1, 0],
    fov: 70,
  },
};

export default Experience;

interface CameraHandlerProps {
  focus?: "face" | "body";
  scene?:
  | "videowall"
  | "empty"
  | "zen"
  | "webresults"
  | "presentation"
  | "presentation2";
  companionType?: string;
}

const CameraHandler = ({
  focus = "face",
  scene = "empty",
  companionType,
}: CameraHandlerProps) => {
  const controls = useRef<CameraControls | null>(null);

  const resetCameraPosition = useCallback(() => {
    if (controls.current) {
      const camera = controls.current.camera;
      const camSettings =
        scene === "empty" ? CAMERA_SETTINGS["body"] : CAMERA_SETTINGS[scene];
      // eslint-disable-next-line prefer-const
      let { lookAt, fov } = camSettings;
      // Use orbe-specific lookAt values if companionType is orbe
      if (companionType === "orbe" && focus === "face") {
        lookAt = [0, 1.5, 5.45, 0, 1.5, 0];
      }
      controls.current.setLookAt(
        lookAt[0],
        lookAt[1],
        lookAt[2],
        lookAt[3],
        lookAt[4],
        lookAt[5],
        true
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [scene, focus, companionType]);

  useEffect(() => {
    resetCameraPosition();
  }, [resetCameraPosition]);

  const { minPolarAngle, maxPolarAngle, minAzimuthAngle, maxAzimuthAngle } =
    useMemo(() => {
      return {
        minPolarAngle: degToRad(45),
        maxPolarAngle: degToRad(90),
        minAzimuthAngle: degToRad(-45),
        maxAzimuthAngle: degToRad(45),
      };
    }, [scene, resetCameraPosition, companionType]);

  return (
    <CameraControls
      minPolarAngle={minPolarAngle}
      maxPolarAngle={maxPolarAngle}
      minAzimuthAngle={minAzimuthAngle}
      maxAzimuthAngle={maxAzimuthAngle}
      ref={controls}
      dampingFactor={0.05}
      onEnd={resetCameraPosition}
      mouseButtons={{
        left: 1,
        middle: 0,
        right: 0,
        wheel: 0,
      }}
      touches={{
        one: 16,
        two: 0,
        three: 0,
      }}
    />
  );
};
