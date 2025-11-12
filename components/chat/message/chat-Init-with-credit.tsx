import React from "react";

import { useShallow } from "zustand/shallow";

import { LoaderFive, LoaderOne } from "@/components/ui/loader";

import useConversationStore, {
  ConversationStoreProps,
} from "@/store/conversation";

const ChatInitWithCredit = () => {
  const shallow = useShallow<
    ConversationStoreProps,
    Pick<ConversationStoreProps, "greeting">
  >((state) => ({
    greeting: state.greeting,
  }));
  const { greeting } = useConversationStore(shallow);

  if (greeting.message === "INIT") {
    return (
      <div className="bubble-last-before-child">
        <LoaderOne />
      </div>
    );
  }

  if (greeting.message) {
    return (
      <div className="bubble-last-before-child flex">
        <LoaderFive text={greeting.message} />
      </div>
    );
  }
  return null;
};

export default ChatInitWithCredit;
