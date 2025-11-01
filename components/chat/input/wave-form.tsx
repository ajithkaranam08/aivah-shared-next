"use client";

import { useState } from "react";
import { VoiceVisualizer, useVoiceVisualizer } from "react-voice-visualizer";
import { Check, Mic, MicIcon, Square, X } from "lucide-react";
import { TooltipInput } from "./tooltip";

export default function VoiceInput({ onResult }: { onResult?: (text: string) => void }) {
	const [audioURL, setAudioURL] = useState<string | null>(null);
	const recorderControls = useVoiceVisualizer();

	const handleStart = async () => {
		await recorderControls.startRecording();
	};

	const handleStop = async () => {
		const blob = await recorderControls.stopRecording();
		if (!blob) return;

		setAudioURL(URL.createObjectURL(blob));

		// (Optional) send to backend for transcription
		const formData = new FormData();
		formData.append("file", blob, "voice.webm");

		const res = await fetch("/api/transcribe", {
			method: "POST",
			body: formData,
		});

		const data = await res.json();
		onResult?.(data.text);
	};

	return (
		<div className="flex items-center">
			{recorderControls.isRecordingInProgress && <VoiceVisualizer mainBarColor="#303030" secondaryBarColor="#303030" height={35} width={260} barWidth={4} gap={1} speed={1} fullscreen={true} isControlPanelShown={false} controls={recorderControls} />}
			{/* Mic Button */}
			{!recorderControls.isRecordingInProgress && (
				<TooltipInput tooltipText="Add more options" variant={"ghost"} onClick={handleStart}>
					<MicIcon size={18} />
				</TooltipInput>
			)}
			{recorderControls.isRecordingInProgress && (
				<TooltipInput tooltipText="Add more options" variant={"ghost"} onClick={handleStop}>
					<X size={18} />
				</TooltipInput>
			)}
			{recorderControls.isRecordingInProgress && (
				<TooltipInput tooltipText="Add more options" variant={"ghost"} onClick={handleStop}>
					<Check size={18} />
				</TooltipInput>
			)}

			{audioURL && <audio src={audioURL} controls className="hidden" />}
		</div>
	);
}
