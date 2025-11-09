"use client";
import { useEffect } from "react";

import { useParams } from "next/navigation";

import ChatInput from "@/components/chat/input";
import { SESSION_CONVERSATION_ID } from "@/helper/storage";
import {
  useConversationMutation,
  useGetChatsMutation,
} from "@/services/conversation/mutation";
import { useAudioTrack } from "@/services/conversation/query";
import { useValidateUUID } from "@/services/validate/query";
import { useLivekitStore } from "@/store/livekit";

import MessageCompanionScene from "./message-companion-scene";

const ChatCompanionScene = () => {
  const { embedId } = useParams();
  const { connect, room, disconnect } = useLivekitStore();

  const { data: sessionData } = useValidateUUID(String(embedId));
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
      if (conversationId) getChats({ conversationId, page: "1", limit: "50" });
    }
  }, [isSuccess, getChats]);

  return (
    <div className="grid h-full grid-cols-3 gap-5 p-5 pt-10">
      <div className="col-span-1" />
      <section className="col-span-1 flex items-end">
        <ChatInput handleScrollBottom={() => {}} />
      </section>
      <section className="col-span-1 flex h-full">
        <MessageCompanionScene room={room} />
      </section>
    </div>
  );
};

export default ChatCompanionScene;
