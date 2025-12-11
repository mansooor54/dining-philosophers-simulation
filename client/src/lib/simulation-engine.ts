import { useState, useEffect, useRef, useCallback } from 'react';
import { Philosopher, Fork, SimulationLog, SimulationConfig } from './types';
import { CodeSnippetKey } from './code-snippets';

const DEFAULT_CONFIG: SimulationConfig = {
  philosopherCount: 5,
  baseTimeUnit: 1000,
  eatDurationRange: [3000, 6000],
  thinkDurationRange: [2000, 5000],
};

export function useDiningPhilosophers(initialCount = 5) {
  const [philosopherCount, setPhilosopherCount] = useState(initialCount);
  const [philosophers, setPhilosophers] = useState<Philosopher[]>([]);
  const [forks, setForks] = useState<Fork[]>([]);
  const [logs, setLogs] = useState<SimulationLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activeCode, setActiveCode] = useState<CodeSnippetKey>('MAIN');
  const [isStepMode, setIsStepMode] = useState(false);
  
  // Refs for mutable state
  const stateRef = useRef({
    philosophers: [] as Philosopher[],
    forks: [] as Fork[],
    timers: {} as Record<number, number>, 
  });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addLog = useCallback((philosopherId: number, action: string, details: string) => {
    setLogs(prev => [{
      id: generateId(),
      timestamp: Date.now(),
      philosopherId,
      action,
      details
    }, ...prev].slice(0, 50));
  }, []);

  // Initialize
  useEffect(() => {
    const phils: Philosopher[] = [];
    const fks: Fork[] = [];
    
    for (let i = 0; i < philosopherCount; i++) {
      phils.push({
        id: i,
        state: 'thinking',
        stateDuration: 0,
        leftForkId: i,
        rightForkId: (i + 1) % philosopherCount,
        eatingTime: 0,
        thinkingTime: 0
      });
      fks.push({
        id: i,
        ownerId: null,
        isDirty: true
      });
    }

    setPhilosophers(phils);
    setForks(fks);
    stateRef.current = {
      philosophers: phils,
      forks: fks,
      timers: Object.fromEntries(phils.map(p => [p.id, Math.random() * 2000]))
    };
    setLogs([]);
  }, [philosopherCount]);

  const tick = useCallback(() => {
    const { philosophers: currentPhilosophers, forks: currentForks, timers } = stateRef.current;
    
    const nextPhilosophers = [...currentPhilosophers];
    const nextForks = [...currentForks];
    let hasChanges = false;
    let relevantActionCode: CodeSnippetKey = 'MAIN';

    // Process each philosopher
    for (let i = 0; i < nextPhilosophers.length; i++) {
      const p = { ...nextPhilosophers[i] };
      const timer = timers[p.id] || 0;
      const leftFork = nextForks[p.leftForkId];
      const rightFork = nextForks[p.rightForkId];

      // Decrease timer
      if (timer > 0) {
        timers[p.id] = Math.max(0, timer - (100 * speed));
        if (p.state === 'eating') p.eatingTime += (100 * speed);
        if (p.state === 'thinking') p.thinkingTime += (100 * speed);
        continue;
      }

      // State Transitions
      if (p.state === 'thinking') {
        p.state = 'hungry';
        addLog(p.id, 'BECAME HUNGRY', 'Finished thinking, waiting for forks');
        hasChanges = true;
        relevantActionCode = 'THINKING';
      } else if (p.state === 'hungry') {
        if (leftFork.ownerId === null && rightFork.ownerId === null) {
          leftFork.ownerId = p.id;
          rightFork.ownerId = p.id;
          p.state = 'eating';
          
          const duration = Math.random() * (DEFAULT_CONFIG.eatDurationRange[1] - DEFAULT_CONFIG.eatDurationRange[0]) + DEFAULT_CONFIG.eatDurationRange[0];
          timers[p.id] = duration;
          
          addLog(p.id, 'STARTED EATING', `Acquired forks ${p.leftForkId} & ${p.rightForkId}`);
          hasChanges = true;
          relevantActionCode = 'HUNGRY';
        } else {
           // Waiting logic
        }
      } else if (p.state === 'eating') {
        leftFork.ownerId = null;
        rightFork.ownerId = null;
        p.state = 'thinking';
        
        const duration = Math.random() * (DEFAULT_CONFIG.thinkDurationRange[1] - DEFAULT_CONFIG.thinkDurationRange[0]) + DEFAULT_CONFIG.thinkDurationRange[0];
        timers[p.id] = duration;
        
        addLog(p.id, 'FINISHED EATING', `Released forks ${p.leftForkId} & ${p.rightForkId}`);
        hasChanges = true;
        relevantActionCode = 'EATING';
      }
      
      nextPhilosophers[i] = p;
    }

    if (hasChanges) {
      setPhilosophers(nextPhilosophers);
      setForks(nextForks);
      stateRef.current.philosophers = nextPhilosophers;
      stateRef.current.forks = nextForks;
      setActiveCode(relevantActionCode);
      return true; // Return true if meaningful change happened
    }
    return false;
  }, [speed, addLog]);

  // Auto-run effect
  useEffect(() => {
    if (!isRunning || isStepMode) return;
    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
  }, [isRunning, isStepMode, tick]);

  const step = () => {
    // Run tick repeatedly until a change happens or safety limit reached
    // This ensures "Step" moves to the next interesting event, not just 100ms
    let safety = 0;
    let changed = false;
    while (!changed && safety < 100) {
       changed = tick();
       safety++;
    }
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setLogs([]);
    setActiveCode('MAIN');
    // Re-trigger init
    const phils: Philosopher[] = [];
    const fks: Fork[] = [];
    for (let i = 0; i < philosopherCount; i++) {
      phils.push({
        id: i,
        state: 'thinking',
        stateDuration: 0,
        leftForkId: i,
        rightForkId: (i + 1) % philosopherCount,
        eatingTime: 0,
        thinkingTime: 0
      });
      fks.push({
        id: i,
        ownerId: null,
        isDirty: true
      });
    }
    setPhilosophers(phils);
    setForks(fks);
    stateRef.current = {
      philosophers: phils,
      forks: fks,
      timers: Object.fromEntries(phils.map(p => [p.id, Math.random() * 2000]))
    };
  };

  return {
    philosophers,
    forks,
    logs,
    isRunning,
    setIsRunning,
    toggleSimulation: () => setIsRunning(!isRunning),
    resetSimulation,
    speed,
    setSpeed,
    philosopherCount,
    setPhilosopherCount,
    activeCode,
    isStepMode,
    setIsStepMode,
    step
  };
}
