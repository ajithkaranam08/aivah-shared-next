import { LivekitConnectionResult } from "@/@type/livekit";
import { useEffect, useEffectEvent } from "react";
import { RoomEvent, TranscriptionSegment } from "livekit-client";
import useConversationStore from "@/store/conversation";

export interface DataReceivedProps {
  topic: "message" | null;
  message: string;
  timestamp: number | null;
}

export const conversationKeys = {
  create: (id: string) => ["conversation", id] as const,
};

export const useChatInitListener = (
  room: LivekitConnectionResult["room"] | null
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
  room: LivekitConnectionResult["room"] | null
) => {
  const { setTranscription } = useConversationStore();
  const handleEvent = useEffectEvent(() => {
    return {
      setTranscription,
    };
  });

  useEffect(() => {
    if (!room) return;
    const handleReceive = (transcription: TranscriptionSegment[]) => {
      const text = transcription.map((segment) => segment.text).join(" ");
      handleEvent().setTranscription(text);
    };

    room.on(RoomEvent.TranscriptionReceived, handleReceive);

    return () => {
      room.off(RoomEvent.TranscriptionReceived, handleReceive);
    };
  }, [room]);
};
