import { useEffect } from "react";

import { useParams } from "next/navigation";

import VoiceModal from "@/components/chat/voice-modal";
import { SESSION_CONVERSATION_ID } from "@/helper/storage";
import {
  useConversationMutation,
  useGetChatsMutation,
} from "@/services/conversation/mutation";
import { useAudioTrack } from "@/services/conversation/query";
import { useValidateUUID } from "@/services/validate/query";
import { useLivekitStore } from "@/store/livekit";

import MessageCompanion from "./message-companion";

const ChatCompanion = () => {
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
    <div className="relative flex h-full flex-col p-5">
      <MessageCompanion room={room} />
      <VoiceModal />
    </div>
  );
};

export default ChatCompanion;
