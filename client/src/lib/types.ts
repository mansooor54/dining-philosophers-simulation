export type PhilosopherState = 'thinking' | 'hungry' | 'eating';

export interface Philosopher {
  id: number;
  state: PhilosopherState;
  stateDuration: number; // How long they've been in this state (for visuals)
  leftForkId: number;
  rightForkId: number;
  eatingTime: number; // Total time spent eating
  thinkingTime: number; // Total time spent thinking
}

export interface Fork {
  id: number;
  ownerId: number | null; // null means on the table
  isDirty: boolean; // Optional: for Chandy-Misra optimization visualization if we want
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
  baseTimeUnit: number; // ms per tick
  eatDurationRange: [number, number];
  thinkDurationRange: [number, number];
}
