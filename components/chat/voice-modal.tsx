"use client";

import { useEffect } from "react";

import { MicIcon, MicOffIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { useSpeechToText } from "@/hooks/use-speech-to-text";
import {
  useChatStopMutation,
  useCreateChatMutation,
} from "@/services/conversation/mutation";
import { useVoiceModalStore } from "@/store/companion";
import useConversationStore from "@/store/conversation";
import { useLivekitStore } from "@/store/livekit";

import { Button } from "../ui/button";
import GlowingLinear from "../ui/glowing-circle";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

interface VoiceModalProps {
  glowingCircle?: boolean;
  translate?: boolean;
  className?: string;
}

export default function VoiceModal({ translate = true, glowingCircle = true, className }: VoiceModalProps) {
  const { theme } = useTheme();
  const { voiceModalOpen, setVoiceModalOpen, setIsRecording, isRecording } =
    useVoiceModalStore();

  const { liveText, finalText, isListening, start, stop, clearText } =
    useSpeechToText();
  const { room } = useLivekitStore();
  const { mutate, isPending } = useCreateChatMutation(room);
  const transcription = useConversationStore((s) => s.transcription);
  const loadingType = useConversationStore((s) => s.loadingType);
  const { mutate: stopChat } = useChatStopMutation(room);

  const handleRecordToggle = async () => {
    try {
      if (!isListening) {
        await start();
        setIsRecording(true);
      } else {
        await stop();
        setIsRecording(false);
      }
    } catch (err) {
      toast.error((err as Error).message || "Microphone access denied");
    }
  };

  const handleStop = async () => {
    if (loadingType === "GENERATING") {
      stopChat();
    } else {
      await stop();
      setIsRecording(false);
      setVoiceModalOpen(false);
    }
  };

  useEffect(() => {
    if (!room || !finalText || transcription || isPending || !isRecording)
      return;

    mutate(
      {
        content: finalText,
        chatId: new Date().getTime(),
        sender: "user",
        timestamp: new Date().toISOString(),
      },
      { onSuccess: () => clearText() }
    );
  }, [
    finalText,
    mutate,
    clearText,
    room,
    transcription,
    isPending,
    isRecording,
  ]);

  return (
    <AnimatePresence>
      {voiceModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn("bg-secondary absolute inset-0 flex flex-col items-center justify-center gap-5", className)}
        >
          {glowingCircle &&
            <section className="flex flex-1 items-center justify-center">
              <GlowingLinear isActive={loadingType === "GENERATING"} />
            </section>
          }

          {translate ? <motion.div
            className="text-primary/80 max-h-18 flex-1 overflow-auto px-6 text-center text-lg [scrollbar-width:thin]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {transcription || liveText || finalText || "Start speaking..."}
          </motion.div> : <Badge variant={"secondary"} className="bg-secondary/10 shadow-md backdrop-blur-md px-5 py-2">{transcription ? "Agent Speaking" : liveText ? "Listening" : "Start speaking"}</Badge>

          }
          <div className="flex gap-5 py-5">
            <Button
              size="icon-lg"
              variant={
                isRecording
                  ? theme === "dark"
                    ? "outline"
                    : "default"
                  : "destructive"
              }
              className="size-14 cursor-pointer rounded-full"
              onClick={handleRecordToggle}
            >
              {isRecording ? <MicIcon size={40} /> : <MicOffIcon size={40} />}
            </Button>

            <Button
              size="icon-lg"
              variant={theme === "dark" ? "outline" : "default"}
              className="size-14 cursor-pointer rounded-full"
              onClick={handleStop}
            >
              {loadingType === "GENERATING" ? (
                <div className="dark:bg-secondary-foreground bg-secondary size-4 " />
              ) : (
                <XIcon size={18} />
              )}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
