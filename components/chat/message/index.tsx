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

  const { messages, transcription, greeting } = useConversationStore();

  const { isBottom } = useChatScroll({
      chatRef: scrollRef,
      bottomRef,
      shouldLoadMore: false,
      loadMore: () => () => {
          console.log("load more");
      },
      count: messages.length,
  });

  const handleScrollBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current?.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div
        ref={scrollRef}
        className="scrollbar-hide flex-1 overflow-y-auto "
      >
        {messages.map((msg, index) => (
          <ChatBubble key={`${String(msg.id)}-${index}`} {...msg} />
        ))}
        <GenerateChat room={room} />
        <ChatInitWithCredit room={room} />

        <div ref={bottomRef} />
      </div>
      {!isBottom &&
                <Button onClick={handleScrollBottom} size={'icon'} variant={"secondary"} className="border border-accent absolute left-2/4 -translate-x-2/4 bottom-24 rounded-full not-hover:animate-bounce cursor-pointer"> <ArrowDown size={18} /></Button>
            }
      <ChatInput />
    </>
  );
};

export default ChatMessage;
