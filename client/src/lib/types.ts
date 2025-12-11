export type PhilosopherState = 'thinking' | 'hungry' | 'eating' | 'sleeping' | 'dead';

export interface Philosopher {
  id: number;
  state: PhilosopherState;
  stateDuration: number; 
  leftForkId: number;
  rightForkId: number;
  eatingTime: number; 
  thinkingTime: number; 
  lastMealTime: number; // Timestamp of last meal start
  eatCount: number; // Number of times eaten
}

export interface Fork {
  id: number;
  ownerId: number | null; 
  isDirty: boolean; 
}

export interface SimulationLog {
  id: string;
  timestamp: number;
  philosopherId: number;
  action: string;
  details: string;
}

export interface SimulationConfig {
  philosopherCount: number;
  timeToDie: number;
  timeToEat: number;
  timeToSleep: number;
}
