import { useEffect, useRef, useState } from "react";

import * as sdk from "microsoft-cognitiveservices-speech-sdk";

import envConfig from "@/config/env";

const SPEECH_KEY = envConfig.NEXT_PUBLIC_SPEECH_KEY;
const SPEECH_REGION = envConfig.NEXT_PUBLIC_SPEECH_REGION;

export const useSpeechToText = (languages = ["en-US", "ta-IN", "hi-IN"]) => {
  const recognizerRef = useRef<sdk.SpeechRecognizer | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [finalText, setFinalText] = useState("");

  useEffect(() => {
    const config = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
    const autoDetect =
      sdk.AutoDetectSourceLanguageConfig.fromLanguages(languages);
    const audio = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new sdk.SpeechRecognizer(config, audio);

    recognizer.recognizing = (_, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizingSpeech)
        setLiveText(e.result.text);
    };

    recognizer.recognized = (_, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech)
        setFinalText((prev) => prev + " " + e.result.text);
    };

    recognizerRef.current = recognizer;

    return () => {
      recognizer.stopContinuousRecognitionAsync();
      recognizer.close();
    };
  }, [languages]);

  const checkMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      return true;
    } catch {
      return false;
    }
  };

  const start = async () => {
    try {
      if (isListening) return;
      const ok = await checkMicPermission();
      if (!ok) throw new Error("Mic permission denied");
      recognizerRef.current?.startContinuousRecognitionAsync();
      setIsListening(true);
    } catch (error) {
      console.log("Error starting speech recognition:", error);
      throw new Error("Error starting speech recognition");
    }
  };

  const stop = async () => {
    try {
      if (!isListening) return;
      recognizerRef.current?.stopContinuousRecognitionAsync();
      setIsListening(false);
    } catch (error) {
      console.log("Error stopping speech recognition:", error);
      throw new Error("Error stopping speech recognition");
    }
  };

  return {
    isListening,
    liveText,
    finalText,
    start,
    stop,
  };
};
