import React, { useRef } from "react";

import { Room } from "livekit-client";

import ChatInitWithCredit from "@/components/chat/message/chat-Init-with-credit";
import ChatBubble from "@/components/chat/message/chat-bubble";
import GenerateChat from "@/components/chat/message/generate-chat";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import useConversationStore from "@/store/conversation";

type MessageCompanionSceneProps = {
  room: Room | null;
  scrollRef: React.RefObject<HTMLDivElement | null>;
};

const MessageCompanionScene = ({ room, scrollRef }: MessageCompanionSceneProps) => {
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
    <div className="flex-center relative h-[calc(100dvh-10rem)] flex-1">
      <div ref={scrollRef} className="scrollbar-hide h-full overflow-y-auto z-10 force-child-white">
        {messages.map((msg, index) => (
          <ChatBubble key={`${String(msg.chatId)}-${index}`} {...msg} />
        ))}
        <GenerateChat room={room} />
        <ChatInitWithCredit room={room} />

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default MessageCompanionScene;
