import { useCallback, useRef } from 'react';

export function useAudioSystem() {
  const audioContextRef = useRef<AudioContext>();
  const countingIntervalRef = useRef<NodeJS.Timeout>();
  const currentCountRef = useRef<number>(1);
  
  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    return audioContextRef.current;
  };

  const playTone = useCallback((frequency: number, duration: number) => {
    const context = initAudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0.1;

    oscillator.start();
    setTimeout(() => oscillator.stop(), duration);
  }, []);

  const playProbeSound = useCallback(() => {
    playTone(880, 200); // A5 note, 200ms duration
  }, [playTone]);

  const startCounting = useCallback(() => {
    currentCountRef.current = 1;
    
    const speakNumber = () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(currentCountRef.current.toString());
      utterance.rate = 0.8;
      utterance.lang = 'es-ES';
      speechSynthesis.speak(utterance);
      currentCountRef.current++;
    };

    speakNumber();
    countingIntervalRef.current = setInterval(speakNumber, 2000);
  }, []);

  const stopCounting = useCallback(() => {
    if (countingIntervalRef.current) {
      clearInterval(countingIntervalRef.current);
      speechSynthesis.cancel();
    }
  }, []);

  return {
    playProbeSound,
    startCounting,
    stopCounting
  };
}