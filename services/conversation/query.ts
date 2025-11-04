import { LivekitConnectionResult } from "@/types/livekit";
import { useEffect, useEffectEvent } from "react";
import {
  RemoteTrack,
  RoomEvent,
  Track,
  TranscriptionSegment,
} from "livekit-client";
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

export const useChatInitListener = (room: HookRoom) => {
  const { setGreeding } = useConversationStore();

  const handleEvent = useEffectEvent(() => {
    return {
      setGreeding,
    };
  });

  useEffect(() => {
    if (!room) return;
    const handleReceive = (data: Uint8Array<ArrayBufferLike>) => {
      const textDecoder = new TextDecoder();
      const dataString = textDecoder.decode(data);
      const jsonData = JSON.parse(dataString) as DataReceivedProps;
      handleEvent().setGreeding(jsonData);
    };

    room.on(RoomEvent.DataReceived, handleReceive);

    return () => {
      room.off(RoomEvent.DataReceived, handleReceive);
    };
  }, [room]);
};

export const useChatTranscription = (room: HookRoom) => {
  const { setTranscription, setGreeding, setMesages, greeding } =
    useConversationStore();

  const handleEvent = useEffectEvent(() => {
    return {
      setTranscription,
      setGreeding,
      setMesages,
    };
  });

  useEffect(() => {
    if (!room) return;
    const handleReceive = (transcription: TranscriptionSegment[]) => {
      const isFinal = transcription.find((segment) => segment.final);
      if (isFinal) {
        setMesages({
          content: transcription.map((segment) => segment.text).join(" "),
          sender: "bot",
          timestamp: new Date(),
        });

        handleEvent().setTranscription("");
      } else {
        const text = transcription.map((segment) => segment.text).join(" ");
        setTranscription(text);
      }
      if (greeding.topic) {
        setGreeding({
          topic: null,
          message: "",
          timestamp: null,
        });
      }
    };

    room.on(RoomEvent.TranscriptionReceived, handleReceive);

    return () => {
      room.off(RoomEvent.TranscriptionReceived, handleReceive);
    };
  }, [room, greeding]);
};

export const useAudioTrack = (room?: HookRoom) => {
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
              console.warn(
                "Playback failed (will retry after user gesture):",
                err
              );
            }
          };
        } catch (error) {
          console.warn("Failed to attach LiveKit audio track:", error);
        }
      }
    };

    room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);

    return () => {
      room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
    };
  }, [room]);
};
