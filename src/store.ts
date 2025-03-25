import { create } from 'zustand';
import { FocusMode, SessionData, UserData, SessionEvent } from './types';

interface AppState {
  sessionData: SessionData | null;
  initSession: (userData: UserData, mode: FocusMode) => void;
  addEvent: (event: Omit<SessionEvent, 'timestamp'>) => void;
  endSession: () => void;
}

export const useStore = create<AppState>((set) => ({
  sessionData: null,
  
  initSession: (userData: UserData, mode: FocusMode) => {
    set({
      sessionData: {
        user: userData,
        mode,
        events: [],
        startTime: Date.now(),
      },
    });
  },
  
  addEvent: (event) => {
    set((state) => ({
      sessionData: state.sessionData
        ? {
            ...state.sessionData,
            events: [
              ...state.sessionData.events,
              { ...event, timestamp: Date.now() },
            ],
          }
        : null,
    }));
  },
  
  endSession: () => {
    set((state) => ({
      sessionData: state.sessionData
        ? { ...state.sessionData, endTime: Date.now() }
        : null,
    }));
  },
}));