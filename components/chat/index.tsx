import { useRef, useEffect } from "react";
import ChatInput from "./input";
import { useConversationMutation } from "@/services/conversation/mutation";
import { useLivekitStore } from "@/store/livekit";
import { useValidateUUID } from "@/services/validate/query";
import { useParams } from "next/navigation";
import ChatInitWithCredit from "./chatInit-with-credit";
import GenerateChat from "./generate-chat";
import { useAudioTrack } from "@/services/conversation/query";

const Chat = () => {
  const { connect, room, disconnect } = useLivekitStore();
  const { embedId } = useParams();
  const { data } = useValidateUUID(String(embedId));
  const { mutate } = useConversationMutation();
  const audioPlaybackRef = useRef<HTMLDivElement>(null);

  useAudioTrack(room);

  useEffect(() => {
    mutate();
    if (data) connect(data);
    return () => disconnect();
  }, [data]);

  return (
    <div className="flex p-5 flex-col h-full justify-end gap-2">
      <ChatInitWithCredit room={room} />
      <GenerateChat room={room} />
      <ChatInput />

      {/* Hidden mount point for LiveKit audio */}
      <div ref={audioPlaybackRef} className="hidden" />
    </div>
  );
};

export default Chat;
