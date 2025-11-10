import { Activity, useRef } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowUpIcon,
  AudioLinesIcon,
  CheckIcon,
  MessageCircleIcon,
  MicIcon,
  XIcon,
} from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import {
  useChatStopMutation,
  useCreateChatMutation,
} from "@/services/conversation/mutation";
import { useVoiceModalStore } from "@/store/companion";
import useConversationStore from "@/store/conversation";
import { useLivekitStore } from "@/store/livekit";
import { ChatInputExpandTypes } from "@/types/chat";
import { ChatFormType, chatFormSchema } from "@/zod-schema/chat";

import EditorInput from "./editor";
import FileInput from "./file";
import ImagePreviewInput from "./image-preview";
import { TooltipInput } from "./tooltip";
import VoiceInput from "./voice-wave";

const ChatInput = ({
  handleScrollBottom,
  showChat,
  setShowChat,
  className
}: {
  handleScrollBottom: () => void;
  showChat?: boolean;
  setShowChat?: () => void;
  className?: string;
}) => {
  const {
    setVoiceModalOpen,
    voiceModalOpen,
    setIsRecording,
    isRecording,
    setRecordedType,
  } = useVoiceModalStore();
  const containerRef = useRef<HTMLFormElement>(null);
  const loadingType = useConversationStore((s) => s.loadingType);

  const { room } = useLivekitStore();

  const { mutateAsync } = useCreateChatMutation(room);
  const { mutateAsync: stopChat } = useChatStopMutation(room);

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
    if (data.fileUrl) {
      await mutateAsync({
        content: data.text,
        chatId: new Date().getTime(),
        sender: "user",
        timestamp: new Date().toISOString(),
        file: data.file,
        image_url: data.fileUrl,
      });
    }

    await mutateAsync({
      content: data.text,
      chatId: new Date().getTime(),
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
    handleScrollBottom();
  };

  return (
    <FormProvider {...form}>
      <form ref={containerRef} className={cn("group/composer w-full", className)}>
        <div
          id="chat-expanded"
          className={cn(
            `grid cursor-text grid-cols-[auto_1fr_auto] rounded-3xl bg-slate-100 p-2.5 shadow-lg [grid-template-areas:'header_header_header'_'leading_primary_trailing'_'._footer_.'] group-data-expanded/composer:[grid-template-areas:'header_header_header'_'primary_primary_primary'_'leading_footer_trailing'] dark:bg-[#303030]`
          )}
        >
          <div className="-my-2.5 flex min-h-14 items-center overflow-x-hidden px-1.5 [grid-area:primary] group-data-expanded/composer:mb-0 group-data-expanded/composer:px-2.5">
            <VoiceInput onExpand={handleExpand} />
            <Activity mode={isRecording ? "hidden" : "visible"}>
              <EditorInput onExpand={handleExpand} onSubmit={onSubmit} />
            </Activity>
          </div>

          <div className="origin-[50%_50%] transform-none [grid-area:leading]">
            <FileInput />
          </div>

          <div className="flex items-center gap-2 [grid-area:trailing]">
            {isRecording ? (
              <>
                <TooltipInput
                  tooltipText="Voice input"
                  variant="ghost"
                  onClick={() => setRecordedType("CANCEL")}
                >
                  <XIcon size={18} />
                </TooltipInput>

                <TooltipInput
                  tooltipText="Voice input"
                  variant="ghost"
                  onClick={() => setRecordedType("SAVE")}
                >
                  <CheckIcon size={18} />
                </TooltipInput>
              </>
            ) : (
              <>
                <TooltipInput
                  tooltipText="Voice input"
                  variant="ghost"
                  onClick={() => setIsRecording(!isRecording)}
                >
                  <MicIcon size={18} />
                </TooltipInput>

                {form.formState.isValid ? (
                  <TooltipInput
                    tooltipText="Send message"
                    onClick={() => form.handleSubmit(onSubmit)()}
                  >
                    <ArrowUpIcon size={18} />
                  </TooltipInput>
                ) : loadingType === "GENERATING" ? (
                  <TooltipInput tooltipText="Stop" onClick={() => stopChat()}>
                    <div className="bg-accent size-3" />
                  </TooltipInput>
                ) : showChat ?
                  <TooltipInput
                    tooltipText="Audio options"
                    onClick={() => setShowChat?.()}
                  >
                    <MessageCircleIcon size={18} />
                  </TooltipInput> :
                  (

                    <TooltipInput
                      tooltipText="Audio options"
                      onClick={() => setVoiceModalOpen(!voiceModalOpen)}
                    >
                      <AudioLinesIcon size={18} />
                    </TooltipInput>
                  )}
              </>
            )}
          </div>

          <div className="-mx-2.5 -mt-2.5 mb-2.5 flex origin-[50%_50%] transform-none flex-col [grid-area:header]">
            <ImagePreviewInput />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ChatInput;
