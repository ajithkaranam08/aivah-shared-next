import { LivekitConnectionResult } from "@/types/livekit";
import { useEffect, useEffectEvent } from "react";
import {
  RemoteTrack,
  RoomEvent,
  Track,
  TranscriptionSegment,
} from "livekit-client";
import useConversationStore from "@/store/conversation";
import { useSyncChatMutation } from "./mutation";
import { SESSION_CONVERSATION_ID } from "@/helper/storage";

export interface DataReceivedProps {
  topic: "message" | null;
  message: string;
  timestamp: number | null;
}

type HookRoom = LivekitConnectionResult["room"] | null;

export const conversationKeys = {
  create: (id: string) => ["conversation", id],
  getChats: (conversationId: number) => [
    "conversation",
    conversationId,
    "chats",
  ],
};

export const useChatInitListener = (room: HookRoom) => {
  const { setGreeding, setLoadingType } = useConversationStore();

  const handleEvent = useEffectEvent(() => {
    return {
      setGreeding,
      setLoadingType,
    };
  });

  useEffect(() => {
    if (!room) return;
    const handleReceive = (data: Uint8Array<ArrayBufferLike>) => {
      const textDecoder = new TextDecoder();
      const dataString = textDecoder.decode(data);
      const jsonData = JSON.parse(dataString) as DataReceivedProps;
      handleEvent().setGreeding(jsonData);
      handleEvent().setLoadingType("INIT");
    };

    room.on(RoomEvent.DataReceived, handleReceive);

    return () => {
      room.off(RoomEvent.DataReceived, handleReceive);
    };
  }, [room]);
};

export const useChatTranscription = (room: HookRoom) => {
  const {
    setTranscription,
    setGreeding,
    setMessages,
    greeding,
    setLoadingType,
  } = useConversationStore();

  const { mutate: syncChat } = useSyncChatMutation();
  const conversationId = SESSION_CONVERSATION_ID.get();

  const handleEvent = useEffectEvent(() => {
    return {
      setTranscription,
      setGreeding,
      setMessages,
      syncChat,
      setLoadingType,
    };
  });

  useEffect(() => {
    if (!room || !conversationId) return;
    const handleReceive = (transcription: TranscriptionSegment[]) => {
      console.log({ transcription });
      const isFinal = transcription.find((segment) => segment.final);

      if (isFinal) {
        handleEvent().setMessages({
          content: isFinal.text,
          sender: "bot",
          timestamp: new Date(isFinal.lastReceivedTime),
          id: isFinal.id,
        });
        handleEvent().syncChat({
          chat: isFinal.text,
          conversationId: Number(conversationId),
          chatType: "normal",
        });

        handleEvent().setTranscription("");
        handleEvent().setLoadingType("NONE");
      } else {
        handleEvent().setLoadingType("GREETING");
        const text = transcription.map((segment) => segment.text).join(" ");
        handleEvent().setTranscription(text);
      }
      if (greeding.topic) {
        handleEvent().setGreeding({
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
  }, [room, greeding, conversationId]);
};

export const useAudioTrack = (room?: HookRoom) => {
  const { setLoadingType } = useConversationStore();

  const handleEvent = useEffectEvent(() => {
    return {
      setLoadingType,
    };
  });
  useEffect(() => {
    if (!room) return;

    const startAudioSafely = async () => {
      try {
        await room.startAudio();
      } catch (err) {
        console.error("Failed to start audio:", err);
      }
    };

    startAudioSafely();

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
          handleEvent().setLoadingType("NONE");
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
