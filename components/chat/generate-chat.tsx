import { Room } from "livekit-client";

import { useChatTranscription } from "@/services/conversation/query";
import useConversationStore from "@/store/conversation";

import MarkdownRenderer from "../ui/markdown-renderer";

const GenerateChat = ({ room }: { room: Room | null }) => {
  const { transcription } = useConversationStore();

  useChatTranscription(room);

  return transcription?.length ? (
    <div className={"group flex w-full justify-start"}>
      <div className={"flex max-w-[80%] flex-col items-start gap-1"}>
        <section
          className={
            "dark:bg-secondary self-start rounded-tl-3xl rounded-tr-3xl rounded-br-3xl bg-slate-100 p-4 text-black dark:text-white"
          }
        >
          <MarkdownRenderer content={transcription} />
        </section>
      </div>
    </div>
  ) : null;
};

export default GenerateChat;
