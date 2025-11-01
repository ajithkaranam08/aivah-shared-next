'use client;'
import { useValidateUUID } from "@/services/validate/query";
import { CameraControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { Color, ColorRepresentation } from "three";


import { degToRad } from "three/src/math/MathUtils.js";


export type SceneWidget = {
    type: "iframe" | "image" | "video" | "attachment" | "youtubeurl";
    url: string;
};

export type SceneProps = {
    widgets?: SceneWidget[];
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
    widgets?: SceneWidget[];
    companionType?: string;
};

const AVATAR_PLACEMENT = {
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
        position: [0, 0, 0],
        rotation: [0, degToRad(27), 0],
    },
    presentation2: {
        position: [0, 0, 0],
        rotation: [0, degToRad(27), 0],
    },
};

const Experience = ({
    modelUrl,
    currentMessage,
    idleCase,
    chatId,
    focus = "body",
    scene = "empty",
    color = "#4E5481",
    widgets,
    companionType,
}: ExperienceProps) => {

    const lightBackgroundColor = new Color(color).multiplyScalar(3.5);

    const [avatarIdx, setAvatarIdx] = useState(0);

    // Hacky technique to force rebind the avatar animation
    useEffect(() => {
        setAvatarIdx((curIdx) => {
            return curIdx === 0 ? 1 : 0;
        });
    }, [modelUrl]);

    const avatarPlacement = AVATAR_PLACEMENT[scene] || AVATAR_PLACEMENT[focus];

    return (
        <>
            <Canvas
                shadows
                camera={{
                    position: [0, 10, 10],
                    fov: 70,
                }}
                style={{
                    width: "100%",
                    zIndex: 0,
                }}
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

            </Canvas>
        </>
    );
};

const CAMERA_SETTINGS = {
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

const CameraHandler = ({ focus = "face", scene = "face", companionType }) => {
    const controls = useRef<CameraControls | null>(null);

    const resetCameraPosition = useCallback(() => {
        if (controls.current) {
            const camera = controls.current.camera;
            const camSettings = CAMERA_SETTINGS[scene] || CAMERA_SETTINGS[focus];
            let { lookAt, fov } = camSettings;
            // Use orbe-specific lookAt values if companionType is orbe
            if (companionType === "orbe" && focus === "face") {
                lookAt = [0, 1.5, 5.45, 0, 1.5, 0];
            }
            controls.current.setLookAt(...lookAt, true);
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

    const mouseButtons = useMemo(
        () => ({
            right: 0,
            middle: 0,
            left: 1,
            wheel: 0,
        }),
        []
    );

    const touches = useMemo(
        () => ({
            one: 1,
            two: 0,
            three: 0,
        }),
        []
    );

    return (
        <CameraControls
            ref={controls}
            onEnd={resetCameraPosition}
            mouseButtons={mouseButtons}
            touches={touches}
            makeDefault
            minPolarAngle={minPolarAngle}
            maxPolarAngle={maxPolarAngle}
            minAzimuthAngle={minAzimuthAngle}
            maxAzimuthAngle={maxAzimuthAngle}
        />
    );
};
