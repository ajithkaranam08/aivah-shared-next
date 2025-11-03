import { LivekitConnectionResult } from "@/@type/livekit";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { RemoteAudioTrack, RemoteTrack, RoomEvent, Track, TranscriptionSegment } from "livekit-client";
import useConversationStore from "@/store/conversation";

export interface DataReceivedProps {
  topic: "message" | null;
  message: string;
  timestamp: number | null;
}

type HookRoom = LivekitConnectionResult["room"] | null;

export const conversationKeys = {
  create: (id: string) => ["conversation", id] as const,
};

export const useChatInitListener = (
  room: HookRoom
) => {
  const { setGreeting } = useConversationStore();

  const handleEvent = useEffectEvent(() => {
    return {
      setGreeting,
    };
  });

  useEffect(() => {
    if (!room) return;
    const handleReceive = (data: Uint8Array<ArrayBufferLike>) => {
      const textDecoder = new TextDecoder();
      const dataString = textDecoder.decode(data);
      const jsonData = JSON.parse(dataString) as DataReceivedProps;
      handleEvent().setGreeting(jsonData);
    };

    room.on(RoomEvent.DataReceived, handleReceive);

    return () => {
      room.off(RoomEvent.DataReceived, handleReceive);
    };
  }, [room]);
};

export const useChatTranscription = (
  room: HookRoom
) => {
  const { setTranscription, setGreeting } = useConversationStore();
  
  const handleEvent = useEffectEvent(() => {
    return {
      setTranscription,
      setGreeting,
    };
  });

  useEffect(() => {
    if (!room) return;
    const handleReceive = (transcription: TranscriptionSegment[]) => {
      transcription.forEach((segment) => {
        if (segment.final) {
          const text = segment.text.trim();
          handleEvent().setTranscription(text);
          handleEvent().setGreeting({
            topic: null,
            message: "",
            timestamp: null,
          });
        }
      });
    };

    room.on(RoomEvent.TranscriptionReceived, handleReceive);

    return () => {
      room.off(RoomEvent.TranscriptionReceived, handleReceive);
    };
  }, [room]);
};


export const useAudioTrack = (room?: HookRoom) => {
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioUnlockAttempted = useRef(false);

  // Unlock audio once user interacts (click, keypress)
  useEffect(() => {
    if (audioUnlocked || room?.state !== "connected") return;
    const unlockAudio = async () => {
      if (audioUnlockAttempted.current) return;
      audioUnlockAttempted.current = true;
      try {
        const ctx = new AudioContext();
        await ctx.resume();
        setAudioUnlocked(true);
        console.log("🔊 AudioContext unlocked");
        document.removeEventListener("click", unlockAudio);
        document.removeEventListener("keydown", unlockAudio);
      } catch (err) {
        console.warn("Failed to unlock audio:", err);
      }
    };

    document.addEventListener("click", unlockAudio);
    document.addEventListener("keydown", unlockAudio);

    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };
  }, [audioUnlocked, room?.state]);

  // Subscribe to LiveKit audio tracks
  useEffect(() => {
    if (!room) return;

    const handleTrackSubscribed = (track: RemoteTrack) => {
      if (track.kind === Track.Kind.Audio) {
        try {
          const audioEl = document.createElement("audio");
          audioEl.autoplay = true;
          audioEl.controls = false;
          audioEl.setAttribute("playsinline", "true");

          // Attach track
          track.attach(audioEl);
          document.body.appendChild(audioEl);

          // Only try play after unlock
          const playAudio = async () => {
            try {
              await audioEl.play();
            } catch (err) {
              console.warn("Playback failed (will retry after user gesture):", err);
            }
          };

          if (audioUnlocked) playAudio();
        } catch (error) {
          console.warn("Failed to attach LiveKit audio track:", error);
        }
      }
    };

    room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);

    return () => {
      room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
    };
  }, [room, audioUnlocked]);
};
