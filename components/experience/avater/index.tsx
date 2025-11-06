import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import useAvatarAnimations from '@/hooks/avatar/use-avatar-animations';
import useAvatarAudio from './hooks/useAvatarAudio';
import useAvatarBlink from './hooks/useAvatarBlink';
import useAvatarPosition from './hooks/useAvatarPosition';
import useMorphTargets from './hooks/useMorphTargets';
import { AvatarProps } from './types/avatar.types';

export default function Avatar({
  modelUrl,
  currentMessage,
  activeSceneName,
}: AvatarProps) {
  const { nodes, scene } = useGLTF(modelUrl);
  const { group, actions } = useAvatarAnimations();
  const { handleAudioEvents } = useAvatarAudio(currentMessage);
  const { handleBlink } = useAvatarBlink(nodes);
  const { handleMovement } = useAvatarPosition(group, activeSceneName);
  const { resetMorphTargets, updateMorphTargets } = useMorphTargets(nodes);

  // Handle audio play/pause
  useEffect(() => handleAudioEvents(), [currentMessage?.audio]);

  // Enable natural blinking
  useEffect(() => handleBlink(), []);

  // Movement update per frame
  useEffect(() => handleMovement(), [activeSceneName]);

  // Basic mesh setup
  useEffect(() => {
    scene.traverse((child: Record<string, unknown>) => {
      if (child.isMesh) child.castShadow = true;
    });
  }, [scene]);

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}
