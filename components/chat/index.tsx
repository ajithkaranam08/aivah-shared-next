import { useEffect, useRef } from "react";

import { useParams } from "next/navigation";

import { SESSION_CONVERSATION_ID } from "@/helper/storage";
import { useAutoScroll, useChatScroll } from "@/hooks/use-chat-scroll";
import {
  useConversationMutation,
  useGetChatsMutation,
} from "@/services/conversation/mutation";
import { useAudioTrack } from "@/services/conversation/query";
import { useValidateUUID } from "@/services/validate/query";
import useConversationStore from "@/store/conversation";
import { useLivekitStore } from "@/store/livekit";

import ChatBubble from "./chat-bubble";
import ChatInitWithCredit from "./chatInit-with-credit";
import GenerateChat from "./generate-chat";
import ChatInput from "./input";

const Chat = () => {
  const { embedId } = useParams();
  const { connect, room, disconnect } = useLivekitStore();
  const { messages, transcription, greeting } = useConversationStore();

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

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
      if (conversationId) getChats({ conversationId, page: "1", limit: "100" });
    }
  }, [isSuccess, getChats]);

  useChatScroll({
    chatRef: scrollRef,
    bottomRef,
    shouldLoadMore: false,
    loadMore: () => () => {
      console.log("load more");
    },
    count: greeting.message.length || transcription?.length || messages.length || 0,
  });

  // ---------- 4️⃣ Render ----------

  return (
    <div className="flex h-full flex-col p-5">
      <div ref={scrollRef} className="scrollbar-hide flex-1 overflow-y-auto">
        {messages.map((msg, index) => (
          <ChatBubble key={`${String(msg.id)}-${index}`} {...msg} />
        ))}
        <ChatInitWithCredit room={room} />
        <GenerateChat room={room} />

        <div ref={bottomRef} />
      </div>

      <ChatInput />
    </div>
  );
};

export default Chat;
