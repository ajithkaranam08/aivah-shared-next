import React from "react";

import { Room } from "livekit-client";

import { LoaderFive } from "@/components/ui/loader";
import { useChatDateReceived } from "@/services/conversation/query";
import useConversationStore from "@/store/conversation";

const ChatInitWithCredit = ({ room }: { room: Room | null }) => {
  const { greeting } = useConversationStore();
  useChatDateReceived(room);
  return greeting.message ? (
    <div className="bubble-last-before-child flex">
      <LoaderFive text={greeting.message} />
    </div>
  ) : null;
};

export default ChatInitWithCredit;
