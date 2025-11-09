import { useEffect } from "react";

import { useFormContext } from "react-hook-form";
import { VoiceVisualizer, useVoiceVisualizer } from "react-voice-visualizer";

import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useVoiceModalStore } from "@/store/companion";

const VoiceInput = ({ height = 35, width = "100%" }) => {
  const recorderControls = useVoiceVisualizer();
  const form = useFormContext();

  // ✅ single shallow zustand subscription
  const { isRecording, recordedType, setRecordedType, setIsRecording } =
    useVoiceModalStore();

  // ✅ stable speech hook destructuring
  const { finalText, start, stop, clearText } = useSpeechToText();

  // ✅ memoized handlers to avoid effect retrigger
  const handleStart = async () => {
    await start();
    recorderControls.startRecording();
  };

  const handleStop = async () => {
    await stop();
    recorderControls.stopRecording();
  };

  // ✅ depend only on stable values
  useEffect(() => {
    const call = isRecording ? handleStart : handleStop;
    call();
    return () => recorderControls.stopRecording();
  }, [isRecording]);

  // ✅ removed finalText from dependency (not needed for trigger)
  useEffect(() => {
    if (recordedType === "SAVE" && finalText) {
      form.setValue("text", finalText);
    }

    if (recordedType === "CANCEL" || recordedType === "SAVE") {
      handleStop();
      clearText();
      setRecordedType("INIT");
      setIsRecording(false);
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
        />
      </div>
    )
  );
};

export default VoiceInput;
