import React from "react";

import { Room } from "livekit-client";

import { LoaderFive } from "@/components/ui/loader";
import { useChatInitListener } from "@/services/conversation/query";
import useConversationStore from "@/store/conversation";

const ChatInitWithCredit = ({ room }: { room: Room | null }) => {
  const { greeting } = useConversationStore();
  useChatInitListener(room);
  return greeting.message ? (
    <div className=" flex">
      <LoaderFive text={greeting.message} />
    </div>
  ) : null;
};

export default ChatInitWithCredit;
