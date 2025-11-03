import useConversationStore from "@/store/conversation";
import { useChatTranscription } from "@/services/conversation/query";
import { Room } from "livekit-client";
import { FlipWords } from "../ui/flip-words";

const GenerateGreedingText = ({ room }: { room: Room | null }) => {
  const { transcription } = useConversationStore();

  useChatTranscription(room);

  return transcription?.length ? (
    <div className={"flex w-full group justify-start"}>
      <div className={"max-w-[80%] flex flex-col gap-1 items-start"}>
        <section
          className={
            "p-4 rounded-tl-3xl  rounded-tr-3xl bg-slate-100 text-black dark:bg-secondary dark:text-white self-start rounded-br-3xl"
          }
        >
          <FlipWords words={transcription} duration={1000} />
        </section>
      </div>
    </div>
  ) : null;
};

export default GenerateGreedingText;
