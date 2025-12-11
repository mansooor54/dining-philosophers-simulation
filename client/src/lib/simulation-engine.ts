import { useState, useEffect, useRef, useCallback } from 'react';
import { Philosopher, Fork, SimulationLog, SimulationConfig } from './types';

const DEFAULT_CONFIG: SimulationConfig = {
  philosopherCount: 5,
  baseTimeUnit: 1000,
  eatDurationRange: [3000, 6000],
  thinkDurationRange: [2000, 5000],
};

export function useDiningPhilosophers(config: SimulationConfig = DEFAULT_CONFIG) {
  const [philosophers, setPhilosophers] = useState<Philosopher[]>([]);
  const [forks, setForks] = useState<Fork[]>([]);
  const [logs, setLogs] = useState<SimulationLog[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  
  // Refs for mutable state during simulation steps to avoid closure staleness
  const stateRef = useRef({
    philosophers: [] as Philosopher[],
    forks: [] as Fork[],
    timers: {} as Record<number, number>, // Time left for current action per philosopher
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
    
    for (let i = 0; i < config.philosopherCount; i++) {
      phils.push({
        id: i,
        state: 'thinking',
        stateDuration: 0,
        leftForkId: i,
        rightForkId: (i + 1) % config.philosopherCount,
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
      timers: Object.fromEntries(phils.map(p => [p.id, Math.random() * 2000])) // Random start stagger
    };
  }, [config.philosopherCount]);

  const tick = useCallback(() => {
    const { philosophers: currentPhilosophers, forks: currentForks, timers } = stateRef.current;
    
    const nextPhilosophers = [...currentPhilosophers];
    const nextForks = [...currentForks];
    let hasChanges = false;

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
        // Done thinking, become hungry
        p.state = 'hungry';
        addLog(p.id, 'BECAME HUNGRY', 'Finished thinking, waiting for forks');
        hasChanges = true;
      } else if (p.state === 'hungry') {
        // Try to pick up forks
        // Simple strategy: Check if both are available (Atomic check for simulation simplicity, 
        // though typically this is where deadlocks happen if not handled)
        
        // For visualization purposes, we let them pick up one if available, 
        // OR we enforce a "wait for both" strategy to prevent instant deadlock in this simple demo.
        // Let's implement a "check both" strategy to keep it flowing nicely.
        
        if (leftFork.ownerId === null && rightFork.ownerId === null) {
          // Pick up both
          leftFork.ownerId = p.id;
          rightFork.ownerId = p.id;
          p.state = 'eating';
          
          // Set timer for eating
          const duration = Math.random() * (config.eatDurationRange[1] - config.eatDurationRange[0]) + config.eatDurationRange[0];
          timers[p.id] = duration;
          
          addLog(p.id, 'STARTED EATING', `Acquired forks ${p.leftForkId} & ${p.rightForkId}`);
          hasChanges = true;
        } else {
          // Still waiting - maybe log occasionally or just visual indicator
        }
      } else if (p.state === 'eating') {
        // Done eating, put down forks
        leftFork.ownerId = null;
        rightFork.ownerId = null;
        p.state = 'thinking';
        
        // Set timer for thinking
        const duration = Math.random() * (config.thinkDurationRange[1] - config.thinkDurationRange[0]) + config.thinkDurationRange[0];
        timers[p.id] = duration;
        
        addLog(p.id, 'FINISHED EATING', `Released forks ${p.leftForkId} & ${p.rightForkId}`);
        hasChanges = true;
      }
      
      nextPhilosophers[i] = p;
    }

    if (hasChanges) {
      setPhilosophers(nextPhilosophers);
      setForks(nextForks);
      stateRef.current.philosophers = nextPhilosophers;
      stateRef.current.forks = nextForks;
    }
  }, [speed, config.eatDurationRange, config.thinkDurationRange, addLog]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const toggleSimulation = () => setIsRunning(!isRunning);
  const resetSimulation = () => {
    setIsRunning(false);
    setLogs([]);
    // Re-init logic will trigger via existing useEffect dependency if we force update, 
    // but easier to just reload page or reset state manually.
    // For now, simplified reset:
    window.location.reload(); 
  };

  return {
    philosophers,
    forks,
    logs,
    isRunning,
    toggleSimulation,
    resetSimulation,
    speed,
    setSpeed
  };
}
