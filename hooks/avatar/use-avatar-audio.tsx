import { toast } from 'sonner';
import { useCompanionStore } from '@/store/companion';

export default function useAvatarAudio(currentMessage: any) {
  const { setAudioPlaying, setAudioStopped } = useCompanionStore();
  const audio = currentMessage?.audio;

  const handleAudioEvents = () => {
    if (!audio) return;

    const onPlay = () => setAudioPlaying(true);
    const onPause = () => setAudioPlaying(false);
    const onEnd = () => setAudioStopped(1);

    audio.addEventListener('playing', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnd);

    const playPromise = audio.play();
    if (playPromise)
      playPromise.catch(() => toast.warning('Cannot auto-play audio'));

    return () => {
      audio.removeEventListener('playing', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnd);
    };
  };

  return { handleAudioEvents };
}
