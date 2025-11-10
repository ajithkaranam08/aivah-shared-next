"use client";
import { useEffect, useRef, useState } from "react";

import ChatInput from "@/components/chat/input";
import { SESSION_CONVERSATION_ID } from "@/helper/storage";
import {
  useConversationMutation,
  useGetChatsMutation,
} from "@/services/conversation/mutation";
import { useAudioTrack } from "@/services/conversation/query";
import { useLivekitStore } from "@/store/livekit";
import { ChatbotDetails } from "@/types/validation";

import { Activity } from "react"

import MessageCompanionScene from "./message-companion-scene";

interface ChatCompanionSceneProps {
  sessionData: ChatbotDetails;
}

const ChatCompanionScene = ({ sessionData }: ChatCompanionSceneProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { connect, room, disconnect } = useLivekitStore();

  const [showChat, setShowChat] = useState(false);

  const { mutate: initConversation, isSuccess } = useConversationMutation();
  const { mutate: getChats } = useGetChatsMutation();

  useAudioTrack(room);

  useEffect(() => {
    initConversation(sessionData, {
      onSuccess: () => {
        if (sessionData) connect(sessionData);
      },
    });
    return () => disconnect();
  }, [sessionData]);

  useEffect(() => {
    if (isSuccess) {
      const conversationId = Number(SESSION_CONVERSATION_ID.get());
      if (conversationId) getChats({ conversationId, page: "1", limit: "10" });
    }
  }, [isSuccess, getChats]);

  const handleBottom = () => {
    scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="grid h-full grid-cols-3 gap-5 p-5">
      <div className="col-span-1" />
      <section className="col-span-1 flex items-end">
        <ChatInput
          handleScrollBottom={handleBottom}
          setShowChat={() => setShowChat(!showChat)}
          showChat
        />
      </section>
      <section className="flex-center col-span-1">
        <Activity mode={showChat ? "visible" : "hidden"}>
          <MessageCompanionScene room={room} scrollRef={scrollRef} />
        </Activity>

      </section>
    </div>
  );
};

export default ChatCompanionScene;
