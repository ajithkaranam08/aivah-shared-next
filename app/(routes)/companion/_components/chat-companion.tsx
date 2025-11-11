import { useEffect } from "react";

import VoiceModal from "@/components/chat/voice-modal";
import { LoaderOne } from "@/components/ui/loader";
import { SESSION_CONVERSATION_ID } from "@/helper/storage";
import {
  useConversationMutation,
  useGetChatsMutation,
} from "@/services/conversation/mutation";
import { useAudioTrack } from "@/services/conversation/query";
import { useLivekitStore } from "@/store/livekit";
import { ChatbotDetails } from "@/types/validation";

import MessageCompanion from "./message-companion";

interface ChatCompanionProps {
  sessionData: ChatbotDetails;
}

const ChatCompanion = ({ sessionData }: ChatCompanionProps) => {
  const { connect, room, disconnect } = useLivekitStore();

  const {
    mutate: initConversation,
    isSuccess,
    isPending,
    isIdle,
  } = useConversationMutation();
  const {
    mutate: getChats,
    isPending: isGetChatPending,
    isSuccess: isGetChatSuccess,
  } = useGetChatsMutation();

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

  if (isPending || isGetChatPending || isIdle || !isGetChatSuccess) {
    return (
      <div className="h-full p-5">
        <LoaderOne />
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col p-5">
      <MessageCompanion room={room} />
      <VoiceModal />
    </div>
  );
};

export default ChatCompanion;
