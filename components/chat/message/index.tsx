import React, { useRef } from "react";

import { Room } from "livekit-client";
import { ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import useConversationStore from "@/store/conversation";

import ChatInput from "../input";
import ChatInitWithCredit from "./chat-Init-with-credit";
import ChatBubble from "./chat-bubble";
import GenerateChat from "./generate-chat";

type ChatMessageProps = {
  room: Room | null;
};

const ChatMessage = ({ room }: ChatMessageProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = useConversationStore((s) => s.messages);

  const { isBottom } = useChatScroll({
    chatRef: scrollRef,
    bottomRef,
    shouldLoadMore: false,
    loadMore: () => () => {
      console.log("load more");
    },
    count: 0,
  });

  const handleScrollBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current?.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div ref={scrollRef} className="scrollbar-hide flex-1 overflow-y-auto">
        {messages.map((msg, index) => (
          <ChatBubble key={`${String(msg.chatId)}-${index}`} {...msg} />
        ))}
        <GenerateChat room={room} />
        <ChatInitWithCredit room={room} />

        <div ref={bottomRef} />
      </div>
      {!isBottom && (
        <Button
          onClick={handleScrollBottom}
          size={"icon"}
          variant={"secondary"}
          className="border-accent absolute bottom-24 left-2/4 -translate-x-2/4 cursor-pointer rounded-full border not-hover:animate-bounce"
        >
          <ArrowDown size={18} />
        </Button>
      )}
      <ChatInput handleScrollBottom={handleScrollBottom} />
    </>
  );
};

export default ChatMessage;
