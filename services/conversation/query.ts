import { LivekitConnectionResult } from "@/@type/livekit";
import { useEffect, useEffectEvent } from "react";
import { RoomEvent } from "livekit-client";
import useConversationStore from "@/store/conversation";

export interface DataReceivedProps {
  topic: "message" | null;
  message: string;
  timestamp: number | null;
}

export const conversationKeys = {
  create: (id: string) => ["conversation", id] as const,
};

export const useLiveKitChatGreeting = (
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
    const handleDataReceived = (data: Uint16Array<ArrayBufferLike>) => {
      const textDecoder = new TextDecoder();
      const dataString = textDecoder.decode(data);
      const jsonData = JSON.parse(dataString) as DataReceivedProps;
      handleEvent().setGreeting(jsonData);
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);

    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room]);
};
