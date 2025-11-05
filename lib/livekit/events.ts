import {
  DisconnectReason,
  RemoteParticipant,
  RemoteTrack,
  Room,
  RoomEvent,
  Track,
  TranscriptionSegment,
} from "livekit-client";

import { connectLiveKitAudio } from "@/helper/wawa-lipsync-manager";

export type RoomEventOptions = {
  audioContainer?: HTMLElement | null;
  onConnected?: () => void;
  onDisconnected?: (reason?: DisconnectReason) => void;
  onAudioPlayingChange?: (isPlaying: boolean) => void;
  onTranscription?: (
    segments: TranscriptionSegment[] | TranscriptionSegment
  ) => void;
};

export function attachRoomEventHandlers(
  room: Room,
  opts: RoomEventOptions = {}
) {
  const { audioContainer, onConnected, onDisconnected, onAudioPlayingChange } =
    opts;
  // Connected
  room.on(RoomEvent.Connected, () => {
    onConnected?.();

    console.log("✅ LiveKit Room connected:", room.name);
  });

  room.on(RoomEvent.DataReceived, async (payload, participant, kind, topic) => {
    try {
      const textDecoder = new TextDecoder();
      const dataString = textDecoder.decode(payload);
      const jsonData = JSON.parse(dataString);

      console.log("Data received:", jsonData, topic);
    } catch (error) {
      console.error("Error decoding data packet:", error);
      // Invalid data packet received - ignore
    }
  });

  // Track subscribed - handle audio playback
  room.on(
    RoomEvent.TrackSubscribed,
    (track: RemoteTrack, _publication, participant: RemoteParticipant) => {
      console.log(
        "Track subscribed:",
        track.kind,
        "from participant:",
        participant.identity
      );
      if (track.kind === Track.Kind.Audio && audioContainer) {
        try {
          const audioTrack = track;
          if (audioTrack.mediaStream) {
            connectLiveKitAudio(audioTrack.mediaStream);

            console.log(
              "✅ LiveKit audio connected to both orb visualization and lipsync"
            );
          }
        } catch (error) {
          console.warn(
            "Failed to connect LiveKit audio to visualization:",
            error
          );
        }
      }
    }
  );

  // Track unsubscribed
  room.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
    if (track.kind === Track.Kind.Audio) {
      onAudioPlayingChange?.(false);
    }
  });

  room.on(RoomEvent.TranscriptionReceived, (transcription) => {
    console.log("Transcription received:", transcription);
    opts.onTranscription?.(
      transcription as unknown as TranscriptionSegment[] | TranscriptionSegment
    );
  });

  // Disconnected
  room.on(RoomEvent.Disconnected, (reason?: DisconnectReason) => {
    onAudioPlayingChange?.(false);
    onDisconnected?.(reason);
  });
}
