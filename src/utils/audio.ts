// Web Audio API based ambient sound generator (no external audio assets required)
let audioCtx: AudioContext | null = null;
let currentAmbientNodes: { stop: () => void } | null = null;

export type AmbientSoundType = 'none' | 'rain' | 'campfire' | 'night';

export function playAmbientSound(type: AmbientSoundType): void {
  stopAmbientSound();

  if (type === 'none') return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    if (type === 'rain') {
      // Pink/Brown noise filtered for soft raindrops
      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;

      const gain = audioCtx.createGain();
      gain.gain.value = 0.12;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start();
      currentAmbientNodes = {
        stop: () => {
          try {
            noise.stop();
            noise.disconnect();
          } catch (e) {
            // ignore
          }
        },
      };
    } else if (type === 'campfire') {
      // Crackle & warm low rumble
      const bufferSize = audioCtx.sampleRate * 2;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Random clicks & pops
        const isCrackle = Math.random() < 0.003;
        data[i] = isCrackle ? (Math.random() * 2 - 1) * 0.8 : (Math.random() * 0.04 - 0.02);
      }

      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 600;
      filter.Q.value = 1.2;

      const gain = audioCtx.createGain();
      gain.gain.value = 0.18;

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      noise.start();
      currentAmbientNodes = {
        stop: () => {
          try {
            noise.stop();
            noise.disconnect();
          } catch (e) {
            // ignore
          }
        },
      };
    } else if (type === 'night') {
      // Gentle calm breeze
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 150;

      const gain = audioCtx.createGain();
      gain.gain.value = 0.04;

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();

      currentAmbientNodes = {
        stop: () => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (e) {}
        },
      };
    }
  } catch (err) {
    console.warn('Web Audio playback error:', err);
  }
}

export function stopAmbientSound(): void {
  if (currentAmbientNodes) {
    currentAmbientNodes.stop();
    currentAmbientNodes = null;
  }
}

/**
 * Text-to-speech for Korean AI letter
 */
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(text: string, onEnd?: () => void): boolean {
  if (!('speechSynthesis' in window)) return false;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ko-KR';
  utterance.rate = 0.92; // Slightly slower, calm and reassuring
  utterance.pitch = 1.05;

  const voices = window.speechSynthesis.getVoices();
  const koVoice = voices.find((v) => v.lang.startsWith('ko') || v.lang.includes('KR'));
  if (koVoice) {
    utterance.voice = koVoice;
  }

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}
