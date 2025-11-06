import { useEffect, useRef, useState, useCallback } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import envConfig from "@/config/env";

const SPEECH_KEY = envConfig.NEXT_PUBLIC_SPEECH_KEY;
const SPEECH_REGION = envConfig.NEXT_PUBLIC_SPEECH_REGION;

export const useSpeechToText = (languages = ["en-US", "ta-IN", "hi-IN"]) => {
  const recognizerRef = useRef<sdk.SpeechRecognizer | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [finalText, setFinalText] = useState("");

  /** ✅ Creates a fresh recognizer each time (prevents disposed object error) */
  const createRecognizer = useCallback(() => {
    try {
      const config = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
      const autoDetect = sdk.AutoDetectSourceLanguageConfig.fromLanguages(languages);
      const audio = sdk.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = sdk.SpeechRecognizer.FromConfig(config, autoDetect, audio);

      recognizer.recognizing = (_, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizingSpeech) {
          setLiveText(e.result.text);
        }
      };

      recognizer.recognized = (_, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          setFinalText((prev) => prev + " " + e.result.text);
        }
      };

      recognizer.canceled = (_, e) => {
        console.warn("Speech recognition canceled:", e.errorDetails);
      };

      recognizer.sessionStopped = () => {
        console.log("Speech session stopped");
      };

      recognizerRef.current = recognizer;
    } catch (err) {
      console.error("Error creating recognizer:", err);
    }
  }, [languages]);

  /** 🧹 Properly clean up on unmount */
  useEffect(() => {
    return () => {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stopContinuousRecognitionAsync(
            () => recognizerRef.current?.close(),
            (err) => console.warn("Stop error:", err)
          );
        } catch (err) {
          console.warn("Cleanup skipped:", err);
        } finally {
          recognizerRef.current = null;
        }
      }
    };
  }, []);

  /** 🎙️ Check mic permission before starting */
  const checkMicPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
    } catch (error) {
      switch ((error as Error).name) {
        case "NotFoundError":
          throw new Error("No microphone found");
        case "NotAllowedError":
          throw new Error("Microphone permission denied");
        case "NotReadableError":
          throw new Error("Microphone is already in use by another app");
        default:
          throw new Error("Unexpected microphone error");
      }
    }
  };

  /** ▶️ Start recognition safely */
  const start = async () => {
    if (isListening) return;

    try {
      await checkMicPermission();

      // Create a new recognizer instance every start
      createRecognizer();

      await new Promise<void>((resolve, reject) => {
        recognizerRef.current?.startContinuousRecognitionAsync(resolve, reject);
      });

      setIsListening(true);
    } catch (err) {
      console.error("Error starting recognition:", err);
      recognizerRef.current = null;
      throw err;
    }
  };

  /** ⏹️ Stop recognition safely */
  const stop = async () => {
    if (!isListening) return;
    try {
      await new Promise<void>((resolve, reject) => {
        recognizerRef.current?.stopContinuousRecognitionAsync(resolve, reject);
      });

      recognizerRef.current?.close();
      recognizerRef.current = null;
    } catch (err) {
      console.warn("Error stopping recognition:", err);
    } finally {
      setIsListening(false);
    }
  };

  return { isListening, liveText, finalText, start, stop };
};
