"use client";
import { useEffect, useRef, useState } from "react";

import ChatInput from "@/components/chat/input";
import { SESSION_CONVERSATION_ID } from "@/helper/storage";
import {
  useConversationMutation,
  useGetChatsMutation,
} from "@/services/conversation/mutation";
import { useAudioTrack, useChatDateReceived, useChatTranscription } from "@/services/conversation/query";
import { useLivekitStore } from "@/store/livekit";
import { ChatbotDetails } from "@/types/validation";

import { Activity } from "react"

import MessageCompanionScene from "./message-companion-scene";
import useConversationStore from "@/store/conversation";
import { MessageCircleIcon, MessageCircleOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggleBtn } from "@/components/ui/theme-toggle";
import { useVoiceModalStore } from "@/store/companion";
import VoiceModal from "@/components/chat/voice-modal";

interface ChatCompanionSceneProps {
  sessionData: ChatbotDetails;
}

const ChatCompanionScene = ({ sessionData }: ChatCompanionSceneProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { connect, room, disconnect } = useLivekitStore();

  const [showChat, setShowChat] = useState(false);

  const { mutate: initConversation, isSuccess } = useConversationMutation();
  const { mutate: getChats } = useGetChatsMutation();
  const setGreeting = useConversationStore(state => state.setGreeting)
  const voiceModalOpen = useVoiceModalStore(state => state.voiceModalOpen);
  const showChatComp = !voiceModalOpen && showChat;

  useAudioTrack(room);
  useChatTranscription(room);
  useChatDateReceived(room);


  useEffect(() => {
    initConversation(sessionData, {
      onSuccess: () => {
        if (sessionData) connect(sessionData);
        setGreeting({
          message: "",
          timestamp: null,
          topic: null
        })
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
    scrollRef.current?.scrollTo({
      top: scrollRef.current?.scrollHeight,
      behavior: "smooth",
    });
  }

  return (
    <div className="grid h-full grid-cols-4 gap-5 p-5">
      <div className="col-span-1" >
        <div className="z-10 relative flex flex-col gap-2">
          <Button size={"icon-lg"} onClick={() => setShowChat(!showChat)} className=" cursor-pointer" variant={"secondary"}>
            {showChat ? <MessageCircleOffIcon /> : <MessageCircleIcon />}
          </Button>
          <ModeToggleBtn variant={"secondary"} size={"icon-lg"} />
        </div>

      </div>
      <section className="col-span-2 flex items-end px-10">
        {!voiceModalOpen &&

          <ChatInput
            className="z-10"
            handleScrollBottom={handleBottom}
          />
        }
        <VoiceModal glowingCircle={false} translate={false} className="z-10 bg-transparent justify-end" />
      </section>
      <section className="flex-center col-span-1 relative">
        <Activity mode={showChatComp ? "visible" : "hidden"} >
          <MessageCompanionScene scrollRef={scrollRef} />
        </Activity>
      </section>
    </div>
  );
};

export default ChatCompanionScene;
