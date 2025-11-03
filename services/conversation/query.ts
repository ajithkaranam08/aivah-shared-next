import { LivekitConnectionResult } from "@/@type/livekit";
import { useEffect } from "react";
import { RoomEvent } from "livekit-client";

export const conversationKeys = {
  create: (id: string) => ["conversation", id] as const,
};

export const useLiveKitChatGreeting = (
  room: LivekitConnectionResult["room"] | null
) => {
  useEffect(() => {
    if (!room) return;
    const handleDataReceived = (data: Uint8Array<ArrayBufferLike>) => {
      console.log(data, "aaaa");
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);

    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room]);
};
