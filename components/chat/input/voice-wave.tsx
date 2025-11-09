import { useEffect } from "react";

import { useFormContext } from "react-hook-form";
import { VoiceVisualizer, useVoiceVisualizer } from "react-voice-visualizer";
import { useShallow } from "zustand/shallow";

import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { VoiceModalStateProps, useVoiceModalStore } from "@/store/companion";
import { ChatInputExpandTypes } from "@/types/chat";

const VoiceInput = ({
  onExpand,
  height = 35,
  width = "100%",
}: {
  onExpand?: (val: ChatInputExpandTypes) => void;
  height?: number;
  width?: number | string;
}) => {
  const recorderControls = useVoiceVisualizer();
  const form = useFormContext();

  const shallow = useShallow<
    VoiceModalStateProps,
    Pick<
      VoiceModalStateProps,
      "isRecording" | "recordedType" | "setRecordedType" | "setIsRecording"
    >
  >((state) => ({
    isRecording: state.isRecording,
    recordedType: state.recordedType,
    setRecordedType: state.setRecordedType,
    setIsRecording: state.setIsRecording,
  }));

  const { isRecording, recordedType, setRecordedType, setIsRecording } =
    useVoiceModalStore(shallow);

  const { finalText, start, stop, clearText } = useSpeechToText();

  const handleStart = async () => {
    await start();
    recorderControls.startRecording();
  };

  const handleStop = async () => {
    await stop();
    recorderControls.stopRecording();
    clearText();
    recorderControls.clearCanvas();
    setRecordedType("INIT");
    setIsRecording(false);
  };

  // ✅ depend only on stable values
  useEffect(() => {
    const call = isRecording ? handleStart : handleStop;
    call();
    return () => recorderControls.stopRecording();
  }, [isRecording]);

  useEffect(() => {
    if (recordedType === "SAVE" && finalText) {
      const editor = document.getElementById("prompt-textarea");
      if (editor) {
        editor.innerHTML = `<p>${finalText}</p>`;
      }
      form.setValue("text", finalText);
      form.trigger("text");
      setTimeout(() => onExpand?.(ChatInputExpandTypes.SINGLE_LINE), 0);
    }

    if (recordedType === "CANCEL" || recordedType === "SAVE") {
      handleStop();
    }
  }, [recordedType, finalText]);

  return (
    isRecording && (
      <div className="max-w-full min-w-0 flex-1">
        <VoiceVisualizer
          height={height}
          width={width}
          barWidth={2}
          speed={1}
          fullscreen={true}
          isControlPanelShown={false}
          controls={recorderControls}
          isDefaultUIShown={false}
          isAudioProcessingTextShown={false}
        />
      </div>
    )
  );
};

export default VoiceInput;
