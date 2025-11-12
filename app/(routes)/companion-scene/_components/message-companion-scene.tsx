import React, { useRef } from "react";


import ChatInitWithCredit from "@/components/chat/message/chat-Init-with-credit";
import ChatBubble from "@/components/chat/message/chat-bubble";
import GenerateChat from "@/components/chat/message/generate-chat";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import useConversationStore from "@/store/conversation";

type MessageCompanionSceneProps = {
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

const MessageCompanionScene = ({ scrollRef }: MessageCompanionSceneProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = useConversationStore((s) => s.messages);

  useChatScroll({
    chatRef: scrollRef,
    bottomRef,
    shouldLoadMore: false,
    loadMore: () => () => {
      console.log("load more");
    },
    count: 0,
  });

  return (
    <div className="flex-center relative h-[calc(100dvh-5rem)] flex-1 height-offet-companion-scene">
      <div ref={scrollRef} className="scrollbar-hide h-full overflow-y-auto z-10 force-child-white">
        {messages.map((msg, index) => (
          <ChatBubble key={`${String(msg.chatId)}-${index}`} {...msg} />
        ))}
        <GenerateChat />
        <ChatInitWithCredit />

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default MessageCompanionScene;
