import React, { useState } from 'react';
import { Brain, Activity, ThermometerSun } from 'lucide-react';
import type { FocusMode, UserData } from '../types';

interface StartFormProps {
  onStart: (userData: UserData, mode: FocusMode) => void;
}

export function StartForm({ onStart }: StartFormProps) {
  const [userData, setUserData] = useState<UserData>({
    nickname: '',
    age: 18,
    mood: 5,
    anxiety: 5,
    stress: 5,
  });
  const [mode, setMode] = useState<FocusMode>('audio');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(userData, mode);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Atención Flexible</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nickname o Iniciales
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={userData.nickname}
            onChange={(e) => setUserData({ ...userData, nickname: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Edad
          </label>
          <input
            type="number"
            required
            min="1"
            max="120"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={userData.age}
            onChange={(e) => setUserData({ ...userData, age: parseInt(e.target.value) })}
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Estado de Ánimo (0-10)
          </label>
          <input
            type="range"
            min="0"
            max="10"
            className="w-full"
            value={userData.mood}
            onChange={(e) => setUserData({ ...userData, mood: parseInt(e.target.value) })}
          />
          
          <label className="block text-sm font-medium text-gray-700">
            Nivel de Ansiedad (0-10)
          </label>
          <input
            type="range"
            min="0"
            max="10"
            className="w-full"
            value={userData.anxiety}
            onChange={(e) => setUserData({ ...userData, anxiety: parseInt(e.target.value) })}
          />
          
          <label className="block text-sm font-medium text-gray-700">
            Nivel de Estrés (0-10)
          </label>
          <input
            type="range"
            min="0"
            max="10"
            className="w-full"
            value={userData.stress}
            onChange={(e) => setUserData({ ...userData, stress: parseInt(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Modo de Enfoque
          </label>
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              className={`p-4 rounded-lg flex flex-col items-center ${
                mode === 'audio' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50'
              }`}
              onClick={() => setMode('audio')}
            >
              <Activity className="h-6 w-6 mb-2" />
              <span className="text-sm">Conteo Auditivo</span>
            </button>
            <button
              type="button"
              className={`p-4 rounded-lg flex flex-col items-center ${
                mode === 'task' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50'
              }`}
              onClick={() => setMode('task')}
            >
              <ThermometerSun className="h-6 w-6 mb-2" />
              <span className="text-sm">Tarea Específica</span>
            </button>
            <button
              type="button"
              className={`p-4 rounded-lg flex flex-col items-center ${
                mode === 'thoughts' ? 'bg-blue-100 border-2 border-blue-500' : 'bg-gray-50'
              }`}
              onClick={() => setMode('thoughts')}
            >
              <Brain className="h-6 w-6 mb-2" />
              <span className="text-sm">Pensamientos</span>
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded">
          <p>
            <strong>Consentimiento Informado:</strong> La información recopilada es confidencial
            y será utilizada únicamente con fines de entrenamiento e investigación.
            No se compartirán datos personales identificables.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}