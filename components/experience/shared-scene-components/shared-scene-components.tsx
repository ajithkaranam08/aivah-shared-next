import { Environment, Lightformer } from '@react-three/drei';

export default function EnvironmentLightSetup() {
  return (
    <>
      <Environment background={false}>
        <Lightformer
          intensity={40}
          rotation-y={Math.PI / 4}
          position={[-5, 0, -3]}
          scale={[10, 1, 1]}
        />
        <Lightformer
          intensity={30}
          rotation-y={-Math.PI / 2}
          position={[8, 1, -5]}
          scale={[3, 10, 1]}
        />
        <Lightformer
          intensity={8}
          rotation-y={-Math.PI / 2}
          position={[1, -0.5, 3]}
          scale={[5, 1, 1]}
          target={[0, 0, 0]}
        />
      </Environment>
    </>
  );
}