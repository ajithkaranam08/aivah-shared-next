import { useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpIcon, AudioLinesIcon, MicIcon, PlusIcon } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { useCreateChatMutation } from "@/services/conversation/mutation";
import { useVoiceModalStore } from "@/store/companion";
import { useLivekitStore } from "@/store/livekit";
import { ChatInputExpandTypes } from "@/types/chat";
import { ChatFormType, chatFormSchema } from "@/zod-schema/chat";

import EditorInput from "./editor";
import FileInput from "./file";
import { TooltipInput } from "./tooltip";

const ChatInput = () => {
  const { setVoiceModalOpen, voiceModalOpen } = useVoiceModalStore();
  const containerRef = useRef<HTMLFormElement>(null);

  const { room } = useLivekitStore();

  const { mutateAsync } = useCreateChatMutation(room);

  const form = useForm<ChatFormType>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: { text: "" },
  });

  const handleExpand = (expanded: ChatInputExpandTypes) => {
    const container = containerRef.current;
    if (!container) return;
    switch (expanded) {
      case ChatInputExpandTypes.MULTI_LINE:
        container.dataset.expanded = "true";
        break;
      case ChatInputExpandTypes.SINGLE_LINE:
        const expandedDiv = container.querySelector(
          "#chat-expanded"
        ) as HTMLElement;
        if (expandedDiv && expandedDiv.clientHeight > 56) {
          container.dataset.expanded = "true";
        } else {
          container.removeAttribute("data-expanded");
        }
        break;
      case ChatInputExpandTypes.TEXT_EMPTY:
        container.removeAttribute("data-expanded");
        break;
    }
  };

  const onSubmit = async (data: ChatFormType) => {
    await mutateAsync({
      content: data.text,
      id: String(new Date().getTime()),
      sender: "user",
      timestamp: new Date().toISOString(),
    });
    form.reset();
    handleExpand(ChatInputExpandTypes.TEXT_EMPTY);
    const promptTextarea = document.getElementById("prompt-textarea");
    if (promptTextarea) {
      promptTextarea.innerHTML =
        '<p data-placeholder="Ask anything" class="place-holder"></p>';
    }
  };

  return (
    <FormProvider {...form}>
      <form ref={containerRef} className="group/composer w-full">
        <FileInput />

        <div
          id="chat-expanded"
          className={cn(
            `grid cursor-text grid-cols-[auto_1fr_auto] rounded-3xl bg-slate-100 p-2.5 shadow-lg [grid-template-areas:'header_header_header'_'leading_primary_trailing'_'._footer_.'] group-data-expanded/composer:[grid-template-areas:'header_header_header'_'primary_primary_primary'_'leading_footer_trailing'] dark:bg-[#303030]`
          )}
        >
          <EditorInput onExpand={handleExpand} onSubmit={onSubmit} />

          <div className="origin-[50%_50%] transform-none [grid-area:leading]">
            <TooltipInput tooltipText="Add more options" variant={"ghost"}>
              <PlusIcon size={18} />
            </TooltipInput>
          </div>

          <div className="flex items-center gap-2 [grid-area:trailing]">
            <TooltipInput tooltipText="Voice input" variant="ghost">
              <MicIcon size={18} />
            </TooltipInput>

            {form.formState.isValid ? (
              <TooltipInput
                tooltipText="Send message"
                onClick={() => form.handleSubmit(onSubmit)()}
              >
                <ArrowUpIcon size={18} />
              </TooltipInput>
            ) : (
              <TooltipInput
                tooltipText="Audio options"
                onClick={() => setVoiceModalOpen(!voiceModalOpen)}
              >
                <AudioLinesIcon size={18} />
              </TooltipInput>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ChatInput;
