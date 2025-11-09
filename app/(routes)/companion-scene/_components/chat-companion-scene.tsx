"use client";
import { useEffect } from "react";

import ChatInput from "@/components/chat/input";
import { SESSION_CONVERSATION_ID } from "@/helper/storage";
import {
  useConversationMutation,
  useGetChatsMutation,
} from "@/services/conversation/mutation";
import { useAudioTrack } from "@/services/conversation/query";
import { useLivekitStore } from "@/store/livekit";
import { ChatbotDetails } from "@/types/validation";

import MessageCompanionScene from "./message-companion-scene";

interface ChatCompanionSceneProps {
  sessionData: ChatbotDetails;
}

const ChatCompanionScene = ({ sessionData }: ChatCompanionSceneProps) => {
  const { connect, room, disconnect } = useLivekitStore();

  const { mutate: initConversation, isSuccess } = useConversationMutation();
  const { mutate: getChats } = useGetChatsMutation();

  useAudioTrack(room);

  useEffect(() => {
    initConversation(undefined, {
      onSuccess: () => {
        if (sessionData) connect(sessionData);
      },
    });
    return () => disconnect();
  }, [sessionData, initConversation, connect, disconnect]);

  useEffect(() => {
    if (isSuccess) {
      const conversationId = Number(SESSION_CONVERSATION_ID.get());
      if (conversationId) getChats({ conversationId, page: "1", limit: "10" });
    }
  }, [isSuccess, getChats]);

  return (
    <div className="grid h-full grid-cols-3 gap-5 p-5">
      <div className="col-span-1" />
      <section className="col-span-1 flex items-end">
        <ChatInput handleScrollBottom={() => {}} />
      </section>
      <section className="flex-center col-span-1">
        <MessageCompanionScene room={room} />
      </section>
    </div>
  );
};

export default ChatCompanionScene;
