import React, { useEffect, useState, useCallback, useRef } from 'react';
import { AlertCircle, Timer } from 'lucide-react';
import { useStore } from '../store';
import { ProbeModal } from './ProbeModal';
import { useAudioSystem } from '../hooks/useAudioSystem';

const SESSION_DURATION = 180; // 3 minutes in seconds
const MIN_PROBE_INTERVAL = 30000; // 30 seconds
const MAX_PROBE_INTERVAL = 90000; // 90 seconds

export function SessionScreen() {
  const { sessionData, addEvent, endSession } = useStore();
  const [timeLeft, setTimeLeft] = useState(SESSION_DURATION);
  const [showProbe, setShowProbe] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const probeTimeoutRef = useRef<NodeJS.Timeout>();
  const { startCounting, stopCounting, playProbeSound } = useAudioSystem();

  const scheduleNextProbe = useCallback(() => {
    const nextProbeTime = Math.random() * (MAX_PROBE_INTERVAL - MIN_PROBE_INTERVAL) + MIN_PROBE_INTERVAL;
    probeTimeoutRef.current = setTimeout(() => {
      playProbeSound();
      setShowProbe(true);
      setIsActive(false);
    }, nextProbeTime);
  }, [playProbeSound]);

  useEffect(() => {
    if (sessionData?.mode === 'audio') {
      startCounting();
    }
    scheduleNextProbe();

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      if (probeTimeoutRef.current) {
        clearTimeout(probeTimeoutRef.current);
      }
      stopCounting();
    };
  }, [sessionData?.mode, scheduleNextProbe, startCounting, stopCounting, endSession]);

  const handleDistraction = () => {
    addEvent({ type: 'self-caught' });
  };

  const handleProbeResponse = (response: 'task' | 'distraction') => {
    addEvent({ type: 'probe-caught', response });
    setShowProbe(false);
    setIsActive(true);
    scheduleNextProbe();
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-8">
            <div className="text-sm font-medium text-gray-600">
              Modo: {sessionData?.mode === 'audio' ? 'Conteo Auditivo' : 
                     sessionData?.mode === 'task' ? 'Tarea Específica' : 'Pensamientos'}
            </div>
            <div className="flex items-center text-lg font-semibold text-gray-800">
              <Timer className="w-5 h-5 mr-2" />
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>

          {isActive && (
            <button
              onClick={handleDistraction}
              className="w-full py-16 px-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-xl transition-colors duration-200 flex flex-col items-center justify-center space-y-4"
            >
              <AlertCircle className="w-12 h-12 text-red-500" />
              <span className="text-xl font-medium text-red-700">DISTRACCIÓN</span>
            </button>
          )}

          {sessionData?.mode === 'task' && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-center text-gray-700">
                Mantén tu atención en la tarea que has elegido realizar.
              </p>
            </div>
          )}

          {sessionData?.mode === 'thoughts' && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-center text-gray-700">
                Observa tus pensamientos sin juzgarlos.
              </p>
            </div>
          )}
        </div>
      </div>

      {showProbe && (
        <ProbeModal onResponse={handleProbeResponse} />
      )}
    </div>
  );
}