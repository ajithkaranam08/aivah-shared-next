import { useEffect, useEffectEvent } from "react";

import {
  RemoteTrack,
  RoomEvent,
  Track,
  TranscriptionSegment,
} from "livekit-client";

import { SESSION_CONVERSATION_ID } from "@/helper/storage";
import useConversationStore from "@/store/conversation";
import { LivekitConnectionResult } from "@/types/livekit";

import { useSyncChatMutation } from "./mutation";

export interface DataReceivedProps {
  topic: "message" | null;
  message: string;
  timestamp: number | null;
  image_url?: string;
  video_urls?: [string];
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

export const useChatDateReceived = (room: HookRoom) => {
  const { setGreeting, setLoadingType, setMessages } = useConversationStore();
  const { mutate: syncChat } = useSyncChatMutation();
  const coonversationId = SESSION_CONVERSATION_ID.get();

  const handleEvent = useEffectEvent(() => {
    return {
      setGreeting,
      setLoadingType,
      setMessages,
      syncChat,
    };
  });

  useEffect(() => {
    if (!room) return;
    const handleReceive = (data: Uint8Array<ArrayBufferLike>) => {
      const textDecoder = new TextDecoder();
      const dataString = textDecoder.decode(data);
      const jsonData = JSON.parse(dataString) as DataReceivedProps;
      console.log("Data received in hook:", jsonData);
      handleEvent().setGreeting(jsonData);
      handleEvent().setLoadingType("INIT");
      const media = jsonData.image_url || jsonData.video_urls?.[0];
      const isImage = Boolean(jsonData.image_url);
      if (media && coonversationId) {
        handleEvent().setMessages({
          content: jsonData.message,
          sender: "bot",
          timestamp: new Date(jsonData.timestamp || Date.now()),
          chatId: new Date().getTime(),
          ...(isImage ? { image_url: jsonData.image_url } : {}),
          ...(!isImage ? { video_url: jsonData.video_urls?.[0] } : {}),
        });
        handleEvent().syncChat({
          chat: "",
          conversationId: Number(coonversationId),
          chatType: isImage ? "image" : "video",
          ...(isImage ? { imagePath: jsonData.image_url } : {}),
          ...(!isImage ? { videoPath: jsonData.video_urls?.[0] } : {}),
        });
      }
    };

    room.on(RoomEvent.DataReceived, handleReceive);

    return () => {
      room.off(RoomEvent.DataReceived, handleReceive);
    };
  }, [coonversationId, room]);
};

export const useChatTranscription = (room: HookRoom) => {
  const {
    setTranscription,
    setGreeting,
    setMessages,
    greeting,
    setLoadingType,
  } = useConversationStore();

  const { mutate: syncChat } = useSyncChatMutation();
  const conversationId = SESSION_CONVERSATION_ID.get();

  const handleEvent = useEffectEvent(() => {
    return {
      setTranscription,
      setGreeting,
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
          chatId: new Date().getTime(),
        });
        handleEvent().syncChat({
          chat: isFinal.text,
          conversationId: Number(conversationId),
          chatType: "normal",
        });

        handleEvent().setTranscription("");
        handleEvent().setLoadingType("NONE");
      } else {
        handleEvent().setLoadingType("GENERATING");
        const text = transcription.map((segment) => segment.text).join(" ");
        handleEvent().setTranscription(text);
      }
      if (greeting.topic) {
        handleEvent().setGreeting({
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
  }, [room, greeting, conversationId]);
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
