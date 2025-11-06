"use client";

import { MicIcon, MicOffIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useVoiceModalStore } from "@/store/companion";

import { Button } from "../ui/button";
import GlowingLinear from "../ui/glowing-circle";

export default function VoiceModal() {
  const { theme } = useTheme();
  const { voiceModalOpen, setVoiceModalOpen, setIsRecording, isRecording } =
    useVoiceModalStore();

  const { liveText, finalText, isListening, start, stop } = useSpeechToText();

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
    await stop();
    setIsRecording(false);
    setVoiceModalOpen(false);
  };

  return (
    <AnimatePresence>
      {voiceModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-secondary absolute inset-0 flex flex-col items-center justify-center gap-5"
        >
          <section className="flex flex-1 items-center justify-center">
            <GlowingLinear isActive={isListening} />
          </section>

          <motion.div
            className="text-primary/80 min-h-[60px] px-6 text-center text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {liveText || finalText || "Start speaking..."}
          </motion.div>

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
              <XIcon size={18} />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
