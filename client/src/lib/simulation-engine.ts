import { useState, useEffect, useRef, useCallback } from 'react';
import { Philosopher, Fork, SimulationLog, SimulationConfig } from './types';
import { CodeSnippetKey } from './code-snippets';

const DEFAULT_CONFIG: SimulationConfig = {
  philosopherCount: 5,
  timeToDie: 410, // ms
  timeToEat: 200, // ms
  timeToSleep: 200, // ms
};

export function useDiningPhilosophers(initialCount = 5) {
  const [config, setConfig] = useState<SimulationConfig>({ ...DEFAULT_CONFIG, philosopherCount: initialCount });
  const [philosophers, setPhilosophers] = useState<Philosopher[]>([]);
  const [forks, setForks] = useState<Fork[]>([]);
  const [logs, setLogs] = useState<SimulationLog[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDead, setIsDead] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [activeCode, setActiveCode] = useState<CodeSnippetKey>('MAIN');
  const [isStepMode, setIsStepMode] = useState(false);
  
  // Refs for mutable state
  const stateRef = useRef({
    philosophers: [] as Philosopher[],
    forks: [] as Fork[],
    timers: {} as Record<number, number>, // Time left for current action (eat/sleep)
    currentTime: 0,
  });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Standard output format: timestamp_in_ms X action
  const addLog = useCallback((philosopherId: number, action: string, details: string) => {
    const timestamp = stateRef.current.currentTime;
    
    // UI Log
    setLogs(prev => [{
      id: generateId(),
      timestamp,
      philosopherId,
      action,
      details
    }, ...prev].slice(0, 50));

    // Terminal Log (resembling standard C output)
    const actionMap: Record<string, string> = {
      'BECAME HUNGRY': 'is thinking', 
      'TOOK FORK': 'has taken a fork',
      'STARTED EATING': 'is eating',
      'STARTED SLEEPING': 'is sleeping',
      'STARTED THINKING': 'is thinking',
      'DIED': 'died'
    };

    const termAction = actionMap[action] || action;
    setTerminalLogs(prev => [`${timestamp} ${philosopherId + 1} ${termAction}`, ...prev].slice(0, 50));
  }, []);

  // Initialize
  const initSimulation = useCallback(() => {
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
        thinkingTime: 0,
        lastMealTime: 0, // Initialize last meal to 0
      });
      fks.push({
        id: i,
        ownerId: null,
        isDirty: true
      });
    }

    setPhilosophers(phils);
    setForks(fks);
    setLogs([]);
    setTerminalLogs([]);
    setIsDead(false);
    
    stateRef.current = {
      philosophers: phils,
      forks: fks,
      timers: Object.fromEntries(phils.map(p => [p.id, 0])),
      currentTime: 0
    };
  }, [config.philosopherCount]); // Re-init when count changes

  // Update logic to handle config changes without full re-init if running? No, simple re-init.
  useEffect(() => {
    initSimulation();
  }, [initSimulation]);


  const tick = useCallback(() => {
    if (isDead) return false;

    // Advance time
    // We use a base step of 50ms per tick for better resolution
    const timeStep = 50 * speed;
    stateRef.current.currentTime += timeStep;
    const now = stateRef.current.currentTime;
    
    const { philosophers: currentPhilosophers, forks: currentForks, timers } = stateRef.current;
    
    const nextPhilosophers = [...currentPhilosophers];
    const nextForks = [...currentForks];
    let hasChanges = false;
    let relevantActionCode: CodeSnippetKey = 'MAIN';

    // 1. Check for DEATH first
    for (let i = 0; i < nextPhilosophers.length; i++) {
      const p = nextPhilosophers[i];
      // Time since last meal start
      const timeSinceMeal = now - p.lastMealTime;
      
      if (p.state !== 'eating' && timeSinceMeal > config.timeToDie) {
        p.state = 'dead';
        addLog(p.id, 'DIED', `Starved after ${timeSinceMeal.toFixed(0)}ms`);
        setIsDead(true);
        setIsRunning(false);
        setPhilosophers(nextPhilosophers); // Show death
        return true;
      }
    }

    // Process actions
    for (let i = 0; i < nextPhilosophers.length; i++) {
      const p = { ...nextPhilosophers[i] };
      const leftFork = nextForks[p.leftForkId];
      const rightFork = nextForks[p.rightForkId];
      
      // Check timer for current action (eating or sleeping)
      const actionTimer = timers[p.id] || 0;
      
      if (actionTimer > 0) {
        timers[p.id] = Math.max(0, actionTimer - timeStep); 
        
        // Update visual timers
        if (p.state === 'eating') p.eatingTime += timeStep;
        if (p.state === 'thinking') p.thinkingTime += timeStep; 
      } else {
        // Action finished, decide next state
        
        if (p.state === 'thinking') {
          p.state = 'hungry';
          hasChanges = true;
          relevantActionCode = 'THINKING';
          
        } else if (p.state === 'hungry') {
          // Try to eat
          if (leftFork.ownerId === null && rightFork.ownerId === null) {
            leftFork.ownerId = p.id;
            rightFork.ownerId = p.id;
            
            p.state = 'eating';
            p.lastMealTime = now; // Reset death timer to current internal time
            
            // Set timer
            timers[p.id] = config.timeToEat;
            
            addLog(p.id, 'TOOK FORK', `Fork ${p.leftForkId}`);
            addLog(p.id, 'TOOK FORK', `Fork ${p.rightForkId}`);
            addLog(p.id, 'STARTED EATING', `Will eat for ${config.timeToEat}ms`);
            hasChanges = true;
            relevantActionCode = 'HUNGRY';
          }
        } else if (p.state === 'eating') {
          // Finished eating
          leftFork.ownerId = null;
          rightFork.ownerId = null;
          
          p.state = 'thinking'; // This represents "Sleeping"
          
          timers[p.id] = config.timeToSleep;
          
          addLog(p.id, 'STARTED SLEEPING', `Will sleep for ${config.timeToSleep}ms`);
          
          hasChanges = true;
          relevantActionCode = 'EATING';
        }
      }
      nextPhilosophers[i] = p;
    }

    if (hasChanges) {
      setPhilosophers(nextPhilosophers);
      setForks(nextForks);
      stateRef.current.philosophers = nextPhilosophers;
      stateRef.current.forks = nextForks;
      setActiveCode(relevantActionCode);
      return true;
    }
    return false;
  }, [config, isDead, speed, addLog]);

  // Auto-run effect
  useEffect(() => {
    if (!isRunning || isStepMode || isDead) return;
    const interval = setInterval(tick, 50); // Run loop every 50ms real time
    return () => clearInterval(interval);
  }, [isRunning, isStepMode, isDead, tick]);

  const step = () => {
    if (isDead) return;
    let safety = 0;
    let changed = false;
    while (!changed && safety < 100) {
       changed = tick();
       safety++;
    }
  };

  const updateConfig = (newConfig: Partial<SimulationConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    // If count changed, we need re-init, which is handled by useEffect dependency on philosopherCount
    // But other params can change live?
    // Changing time_to_die live is fun.
  };

  return {
    philosophers,
    forks,
    logs,
    terminalLogs,
    isRunning,
    setIsRunning,
    toggleSimulation: () => setIsRunning(!isRunning),
    resetSimulation: initSimulation,
    speed,
    setSpeed,
    config,
    updateConfig,
    activeCode,
    isStepMode,
    setIsStepMode,
    step,
    isDead
  };
}
