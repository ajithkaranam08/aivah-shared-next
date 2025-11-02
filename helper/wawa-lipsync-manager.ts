import { Lipsync } from 'wawa-lipsync';
import { useLipsyncStore } from '@/store/lipsync';

// Lazily create a single shared lipsync manager instance on the client only
let lipsyncManagerSingleton: Lipsync | null = null;
export const getLipsyncManager = (): Lipsync | null => {
  if (typeof window === 'undefined') return null;
  if (!lipsyncManagerSingleton) {
    lipsyncManagerSingleton = new Lipsync({
      fftSize: 2048,
      historySize: 10
    });
  }
  return lipsyncManagerSingleton;
};

// Store current audio and LiveKit stream
let currentAudio: HTMLAudioElement | null = null;
let currentLiveKitStream: MediaStream | null = null;
let isProcessing = false;
let animationFrameId: number | null = null;
let liveKitAudioContext: AudioContext | null = null;
let liveKitSourceNode: MediaStreamAudioSourceNode | null = null;

// OFFICIAL DEMO PATTERN: Simple direct connection
export const connectAudio = (audio: HTMLAudioElement): void => {
  if (currentAudio === audio) return;

  if (currentAudio) disconnectAudio();

  currentAudio = audio;
  const manager = getLipsyncManager();
  if (manager) {
    manager.connectAudio(audio);
  }
  console.log('🎵 Audio connected to wawa-lipsync:', audio.src);
};

export const disconnectAudio = (): void => {
  if (currentAudio) {
    currentAudio = null;
  }
};

export const connectLiveKitAudio = (mediaStream: MediaStream): void => {
  if (currentLiveKitStream === mediaStream) return;

  disconnectLiveKitAudio();
  resetCustomAnalysis();

  try {
    if (!liveKitAudioContext || liveKitAudioContext.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) throw new Error('AudioContext not supported');
      liveKitAudioContext = new AudioContextClass({
        latencyHint: 'interactive',
        sampleRate: 44100
      });
    }

    if (liveKitAudioContext.state === 'suspended') {
      liveKitAudioContext.resume().catch(console.warn);
    }

    const source = liveKitAudioContext.createMediaStreamSource(mediaStream);
    const analyser = liveKitAudioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.1;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    source.connect(analyser);

    liveKitSourceNode = source;
    liveKitAnalyser = analyser;
    currentLiveKitStream = mediaStream;

    const audioElement = new Audio();
    audioElement.srcObject = mediaStream;
    audioElement.volume = 1;
    audioElement.muted = true;
    audioElement.autoplay = true;
    currentAudio = audioElement;

    console.log('🎵 LiveKit Audio Connected:', {
      isProcessing,
      hasStream: !!mediaStream
    });

    if (!isProcessing) startProcessing();
  } catch (error) {
    console.error('WawaLipsyncManager: Failed to connect LiveKit audio:', error);
  }
};

export const disconnectLiveKitAudio = (): void => {
  if (currentLiveKitStream || liveKitSourceNode) {
    try {
      if (liveKitSourceNode) {
        liveKitSourceNode.disconnect();
        liveKitSourceNode = null;
      }
      liveKitAnalyser = null;
      resetCustomAnalysis();

      if (currentAudio && currentAudio.srcObject === currentLiveKitStream) {
        currentAudio.srcObject = null;
        currentAudio = null;
      }

      currentLiveKitStream = null;
    } catch (error) {
      console.warn('WawaLipsyncManager: Error disconnecting LiveKit audio:', error);
    }
  }
};

// Store analyser node
let liveKitAnalyser: AnalyserNode | null = null;

// Smoothing settings
const previousVisemes: string[] = [];
let previousVolume = 0;
let lastVisemeTime = 0;
const VISEME_SMOOTHING_FRAMES = 2;
const MIN_VISEME_DURATION = 30;
const VOLUME_THRESHOLD = 0.003;
const SILENCE_THRESHOLD = 0.001;

// Custom audio analysis
const analyzeLiveKitAudio = (): {
  viseme: string;
  volume: number;
  features: { volume: number; bands: number[]; deltaBands: number[]; centroid: number };
} => {
  if (!liveKitAnalyser || !liveKitAudioContext) {
    return { viseme: 'viseme_sil', volume: 0, features: { volume: 0, bands: [0, 0, 0], deltaBands: [0, 0, 0], centroid: 0 } };
  }

  const bufferLength = liveKitAnalyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  liveKitAnalyser.getByteFrequencyData(dataArray);

  let sum = 0;
  for (let i = 0; i < bufferLength; i++) {
    const value = dataArray[i] / 255;
    sum += value * value;
  }
  const volume = Math.sqrt(sum / bufferLength);
  const smoothedVolume = previousVolume * 0.5 + volume * 0.5;
  previousVolume = smoothedVolume;

  const sampleRate = liveKitAudioContext.sampleRate;
  const frequencyResolution = sampleRate / (2 * bufferLength);
  const lowEnd = Math.floor(400 / frequencyResolution);
  const lowMidEnd = Math.floor(800 / frequencyResolution);
  const midEnd = Math.floor(2000 / frequencyResolution);
  const highMidEnd = Math.floor(4000 / frequencyResolution);
  const highEnd = Math.floor(8000 / frequencyResolution);

  const bands = [
    dataArray.slice(0, lowEnd).reduce((a, b) => a + b, 0) / lowEnd,
    dataArray.slice(lowEnd, lowMidEnd).reduce((a, b) => a + b, 0) / (lowMidEnd - lowEnd),
    dataArray.slice(lowMidEnd, midEnd).reduce((a, b) => a + b, 0) / (midEnd - lowMidEnd),
    dataArray.slice(midEnd, highMidEnd).reduce((a, b) => a + b, 0) / (highMidEnd - midEnd),
    dataArray.slice(highMidEnd, Math.min(highEnd, bufferLength)).reduce((a, b) => a + b, 0) / (Math.min(highEnd, bufferLength) - highMidEnd),
  ];

  const totalEnergy = bands.reduce((a, b) => a + b, 0);
  const normalized = totalEnergy > 0 ? bands.map(b => b / totalEnergy) : [0, 0, 0, 0, 0];

  let viseme = 'viseme_sil';
  if (smoothedVolume < SILENCE_THRESHOLD) viseme = 'viseme_sil';
  else if (smoothedVolume > VOLUME_THRESHOLD) {
    if (normalized[4] > 0.3 && normalized[3] > 0.25) viseme = normalized[4] > normalized[3] ? 'viseme_SS' : 'viseme_CH';
    else if (normalized[0] > 0.4 && normalized[2] < 0.2) viseme = 'viseme_U';
    else if (normalized[2] > 0.4 && normalized[0] < 0.3) viseme = normalized[3] > normalized[1] ? 'viseme_I' : 'viseme_E';
    else if (normalized[1] > 0.3 && normalized[2] > 0.3) viseme = 'viseme_aa';
    else viseme = 'viseme_aa';
  }

  const currentTime = Date.now();
  if (previousVisemes.length > 0) {
    const lastViseme = previousVisemes[previousVisemes.length - 1];
    const minDuration = lastViseme === 'viseme_sil' ? MIN_VISEME_DURATION * 0.5 : MIN_VISEME_DURATION;
    if (currentTime - lastVisemeTime < minDuration && lastViseme !== 'viseme_sil') viseme = lastViseme;
  }

  if (viseme !== previousVisemes[previousVisemes.length - 1]) lastVisemeTime = currentTime;
  previousVisemes.push(viseme);
  if (previousVisemes.length > VISEME_SMOOTHING_FRAMES * 2) previousVisemes.shift();

  return {
    viseme,
    volume: smoothedVolume,
    features: {
      volume: smoothedVolume,
      bands: normalized,
      deltaBands: [0, 0, 0, 0, 0],
      centroid: normalized.reduce((a, b) => a + b, 0) / 5
    }
  };
};

const resetCustomAnalysis = (): void => {
  previousVisemes.length = 0;
  previousVolume = 0;
  lastVisemeTime = 0;
  customAnalysisResult = null;
};

let customAnalysisResult: {
  viseme: string;
  volume: number;
  features: { volume: number; bands: number[]; deltaBands: number[]; centroid: number };
} | null = null;

// OFFICIAL DEMO PATTERN: Simple processing loop
export const startProcessing = (): void => {
  if (isProcessing) return;

  isProcessing = true;
  console.log('🎵 Starting wawa-lipsync processing');

  const processAudio = (): void => {
    if (!isProcessing) return;

    const { setLipsyncData } = useLipsyncStore.getState();

    if (currentLiveKitStream && liveKitAnalyser) {
      customAnalysisResult = analyzeLiveKitAudio();

      if (customAnalysisResult) {
        setLipsyncData({
          viseme: customAnalysisResult.viseme,
          volume: customAnalysisResult.volume,
          isActive: customAnalysisResult.volume > 0.001,
          lastActiveTime: customAnalysisResult.volume > 0.001 ? Date.now() : undefined,
          intensity: customAnalysisResult.volume
        });
      }
    } else if (currentAudio) {
      const manager = getLipsyncManager();
      if (manager) {
        manager.processAudio();
      }
      const features = (getLipsyncManager()?.features) as any;
      const volume = features?.volume || 0;

      setLipsyncData({
        viseme: (getLipsyncManager()?.viseme) || 'viseme_sil',
        volume,
        isActive: (getLipsyncManager()?.viseme) !== 'viseme_sil',
        lastActiveTime: (getLipsyncManager()?.viseme) !== 'viseme_sil' ? Date.now() : undefined,
        intensity: volume
      });
    }

    animationFrameId = requestAnimationFrame(processAudio);
  };

  processAudio();
};

export const stopProcessing = (): void => {
  isProcessing = false;
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
};

// Accessor helpers
export const getCurrentViseme = (): string => {
  const manager = getLipsyncManager();
  return customAnalysisResult?.viseme || manager?.viseme || 'viseme_sil';
};
export const getCurrentState = (): string => {
  const viseme = getCurrentViseme().replace('viseme_', '');
  if (['aa', 'I', 'E', 'O', 'U'].includes(viseme)) return 'vowel';
  if (viseme === 'sil') return 'silent';
  return 'consonant';
};
export const getCurrentFeatures = (): unknown => getLipsyncManager()?.features;
export const getCustomAnalysisResult = () => customAnalysisResult;
export const isAudioActive = (): boolean => !!(currentAudio && !currentAudio.paused && !currentAudio.ended);
export const isLiveKitAudioActive = (): boolean => !!(currentLiveKitStream && currentAudio?.srcObject === currentLiveKitStream);
export const getCurrentAudio = (): HTMLAudioElement | null => currentAudio;
export const getCurrentLiveKitStream = (): MediaStream | null => currentLiveKitStream;
