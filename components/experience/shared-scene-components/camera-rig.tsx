import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

import { easing } from 'maath';
import { Group } from 'three';

interface CameraRigProps {
  children: React.ReactNode;
}
export default function CameraRig({ children }: CameraRigProps) {
  const group = useRef<Group>(null!);
  useFrame((state, delta) => {
    easing.dampE(
      group.current.rotation,
      [-state.pointer.y / 16, -state.pointer.x / 8.5, 0],
      0.55,
      delta
    );
  });
  return <group ref={group}>{children}</group>;
}