export type FocusMode = 'audio' | 'task' | 'thoughts';

export interface UserData {
  nickname: string;
  age: number;
  mood: number;
  anxiety: number;
  stress: number;
}

export interface SessionEvent {
  type: 'self-caught' | 'probe-caught';
  response?: 'task' | 'distraction';
  timestamp: number;
}

export interface SessionData {
  user: UserData;
  mode: FocusMode;
  events: SessionEvent[];
  startTime: number;
  endTime?: number;
}