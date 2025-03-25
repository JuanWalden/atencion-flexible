import React from 'react';
import { StartForm } from './components/StartForm';
import { SessionScreen } from './components/SessionScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { useStore } from './store';
import type { FocusMode, UserData } from './types';

function App() {
  const { initSession, sessionData } = useStore();
  
  const handleStart = (userData: UserData, mode: FocusMode) => {
    initSession(userData, mode);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!sessionData ? (
        <StartForm onStart={handleStart} />
      ) : !sessionData.endTime ? (
        <SessionScreen />
      ) : (
        <ResultsScreen />
      )}
    </div>
  );
}

export default App;