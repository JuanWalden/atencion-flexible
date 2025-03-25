import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useStore } from '../store';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function ResultsScreen() {
  const { sessionData } = useStore();

  const stats = useMemo(() => {
    if (!sessionData) return null;

    const selfCaught = sessionData.events.filter(e => e.type === 'self-caught').length;
    const probeCaught = sessionData.events.filter(e => e.type === 'probe-caught');
    const onTask = probeCaught.filter(e => e.response === 'task').length;
    const distracted = probeCaught.filter(e => e.response === 'distraction').length;

    return { selfCaught, onTask, distracted };
  }, [sessionData]);

  const eventDetails = useMemo(() => {
    if (!sessionData) return null;

    const selfCaughtEvents = sessionData.events
      .filter(e => e.type === 'self-caught')
      .map(e => ({
        time: Math.round((e.timestamp - sessionData.startTime) / 1000),
        type: 'Auto-detectada'
      }));

    const probeCaughtEvents = sessionData.events
      .filter(e => e.type === 'probe-caught')
      .map(e => ({
        time: Math.round((e.timestamp - sessionData.startTime) / 1000),
        type: e.response === 'task' ? 'Sonda - En Tarea' : 'Sonda - Distraído'
      }));

    return [...selfCaughtEvents, ...probeCaughtEvents]
      .sort((a, b) => a.time - b.time);
  }, [sessionData]);

  const chartData = useMemo(() => {
    if (!sessionData) return null;

    const duration = ((sessionData.endTime || Date.now()) - sessionData.startTime) / 1000;
    const labels = Array.from({ length: Math.ceil(duration) }, (_, i) => i);
    
    const selfCaughtData = new Array(Math.ceil(duration)).fill(null);
    const probeTaskData = new Array(Math.ceil(duration)).fill(null);
    const probeDistractionData = new Array(Math.ceil(duration)).fill(null);

    sessionData.events.forEach(event => {
      const timeIndex = Math.round((event.timestamp - sessionData.startTime) / 1000);
      if (event.type === 'self-caught') {
        selfCaughtData[timeIndex] = 1;
      } else if (event.type === 'probe-caught') {
        if (event.response === 'task') {
          probeTaskData[timeIndex] = 1;
        } else {
          probeDistractionData[timeIndex] = 1;
        }
      }
    });

    return {
      labels,
      datasets: [
        {
          label: 'Auto-detectadas',
          data: selfCaughtData,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Sonda - En Tarea',
          data: probeTaskData,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: 'Sonda - Distraído',
          data: probeDistractionData,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.5)',
          pointRadius: 6,
          pointHoverRadius: 8
        }
      ]
    };
  }, [sessionData]);

  if (!sessionData || !stats || !chartData || !eventDetails) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-center mb-6">Resultados de la Sesión</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-blue-600 mb-1">Distracciones Auto-detectadas</p>
              <p className="text-2xl font-bold text-blue-800">{stats.selfCaught}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-green-600 mb-1">Sondas - En Tarea</p>
              <p className="text-2xl font-bold text-green-800">{stats.onTask}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-sm text-red-600 mb-1">Sondas - Distraído</p>
              <p className="text-2xl font-bold text-red-800">{stats.distracted}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  title: {
                    display: true,
                    text: 'Eventos durante la sesión'
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        if (context.raw === null) return '';
                        return `${context.dataset.label} - Segundo ${context.label}`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 1.5,
                    ticks: {
                      display: false
                    }
                  },
                  x: {
                    title: {
                      display: true,
                      text: 'Tiempo (segundos)'
                    }
                  }
                }
              }}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Detalle de Eventos</h3>
            <div className="space-y-2">
              {eventDetails.map((event, index) => (
                <div 
                  key={index}
                  className={`p-2 rounded ${
                    event.type === 'Auto-detectada' ? 'bg-blue-50' :
                    event.type === 'Sonda - En Tarea' ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <span className="font-medium">{event.type}</span>
                  <span className="float-right">Segundo {event.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-gray-700">
              Has identificado {stats.selfCaught} distracciones por ti mismo.
              En las pruebas aleatorias, estabas enfocado {stats.onTask} veces y
              distraído {stats.distracted} veces.
            </p>
            <p className="mt-2 text-blue-700 font-medium">
              ¡Con la práctica, mejorarás tu capacidad de mantener el foco y detectar distracciones!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}