import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ProbeModalProps {
  onResponse: (response: 'task' | 'distraction') => void;
}

export function ProbeModal({ onResponse }: ProbeModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full animate-fade-in">
        <h3 className="text-xl font-semibold text-center mb-6">
          ¿En qué estabas enfocado?
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => onResponse('task')}
            className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
            <span className="font-medium text-green-700">TAREA</span>
          </button>
          <button
            onClick={() => onResponse('distraction')}
            className="flex flex-col items-center p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <XCircle className="w-8 h-8 text-red-600 mb-2" />
            <span className="font-medium text-red-700">DISTRACCIÓN</span>
          </button>
        </div>
      </div>
    </div>
  );
}