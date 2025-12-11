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
    simulationStartTime: 0,
    lastTick: 0,
  });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Standard output format: timestamp_in_ms X action
  const addLog = useCallback((philosopherId: number, action: string, details: string) => {
    const timestamp = Date.now();
    const simTime = stateRef.current.simulationStartTime > 0 ? timestamp - stateRef.current.simulationStartTime : 0;
    
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
      'BECAME HUNGRY': 'is thinking', // They think until they are hungry? No, wait. 
      // Standard 42 outputs:
      // timestamp X has taken a fork
      // timestamp X is eating
      // timestamp X is sleeping
      // timestamp X is thinking
      // timestamp X died
      
      'TOOK FORK': 'has taken a fork',
      'STARTED EATING': 'is eating',
      'STARTED SLEEPING': 'is sleeping',
      'STARTED THINKING': 'is thinking',
      'DIED': 'died'
    };

    const termAction = actionMap[action] || action;
    setTerminalLogs(prev => [`${simTime} ${philosopherId + 1} ${termAction}`, ...prev].slice(0, 50));
  }, []);

  // Initialize
  const initSimulation = useCallback(() => {
    const phils: Philosopher[] = [];
    const fks: Fork[] = [];
    const now = Date.now();
    
    for (let i = 0; i < config.philosopherCount; i++) {
      phils.push({
        id: i,
        state: 'thinking',
        stateDuration: 0,
        leftForkId: i,
        rightForkId: (i + 1) % config.philosopherCount,
        eatingTime: 0,
        thinkingTime: 0,
        lastMealTime: now, // Initialize last meal to now
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
      simulationStartTime: now,
      lastTick: now
    };
  }, [config.philosopherCount]); // Re-init when count changes

  // Update logic to handle config changes without full re-init if running? No, simple re-init.
  useEffect(() => {
    initSimulation();
  }, [initSimulation]);


  const tick = useCallback(() => {
    if (isDead) return false;

    const now = Date.now();
    const { philosophers: currentPhilosophers, forks: currentForks, timers, simulationStartTime } = stateRef.current;
    
    // Calculate delta time for speed adjustment
    // In real-time simulation we just use wall clock, but if we have speed factor:
    // We simulate logical time advancement.
    // For simplicity with speed slider, we'll just run the tick loop faster/slower or use larger steps.
    // Here we use fixed steps of ~50ms * speed factor logic? 
    // Actually, simpler: The loop runs every X ms. 
    // Let's stick to wall-clock time for the "logic" checks to match the standard problem constraints (time_to_die is in ms).
    
    const nextPhilosophers = [...currentPhilosophers];
    const nextForks = [...currentForks];
    let hasChanges = false;
    let relevantActionCode: CodeSnippetKey = 'MAIN';

    // 1. Check for DEATH first
    for (let i = 0; i < nextPhilosophers.length; i++) {
      const p = nextPhilosophers[i];
      // Time since last meal start
      const timeSinceMeal = now - p.lastMealTime;
      
      // If eating, they are safe (in this simplified logic, or strict check?)
      // Strict: if timeSinceMeal > time_to_die, they die.
      // Even if eating? Usually the check is: if (now - last_meal_start) > time_to_die => die.
      // But if they just started eating, last_meal_start is updated.
      
      if (p.state !== 'eating' && timeSinceMeal > config.timeToDie) {
        p.state = 'dead';
        addLog(p.id, 'DIED', `Starved after ${timeSinceMeal}ms`);
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
        // Still busy doing something
        // Reduce timer by elapsed real time (approx 100ms per tick)
        // Or if we use exact time:
        // We just check end times?
        // Let's decrement.
        timers[p.id] = Math.max(0, actionTimer - 100 * speed); 
        // Note: speed speeds up the "processing", so they finish eating faster.
        // But time_to_die is wall clock? 
        // If we speed up simulation, everything should speed up including death clock.
        // For simplicity: We assume speed = 1 is real time. speed = 2 means 100ms tick counts as 200ms.
        
        // Update visual timers
        if (p.state === 'eating') p.eatingTime += 100 * speed;
        if (p.state === 'thinking') p.thinkingTime += 100 * speed; // "sleeping" maps to thinking state in our previous model, let's align.
      } else {
        // Action finished, decide next state
        
        if (p.state === 'thinking') {
          // Finished thinking (sleeping), became hungry
          // In standard: Eat -> Sleep -> Think -> Eat
          // Our visual model: Thinking (Sleep/Think) -> Hungry -> Eating
          
          p.state = 'hungry';
          // addLog(p.id, 'BECAME HUNGRY', 'Waiting for forks');
          // Standard output doesn't log "hungry", it logs "thinking" when they start sleeping/thinking.
          // We'll log internal event for UI.
          hasChanges = true;
          relevantActionCode = 'THINKING';
          
        } else if (p.state === 'hungry') {
          // Try to eat
          if (leftFork.ownerId === null && rightFork.ownerId === null) {
            leftFork.ownerId = p.id;
            rightFork.ownerId = p.id;
            
            p.state = 'eating';
            p.lastMealTime = Date.now(); // Reset death timer!
            
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
          
          p.state = 'thinking'; // This represents "Sleeping" in standard problem
          
          timers[p.id] = config.timeToSleep;
          
          addLog(p.id, 'STARTED SLEEPING', `Will sleep for ${config.timeToSleep}ms`);
          
          // In 42 task: Eat -> Sleep -> Think
          // We can add a distinct Sleep state if we want, but visually 3 states is cleaner.
          // Let's say "Thinking" state = Sleeping + Thinking.
          // When sleep finishes, they "think" (usually instant or short) then get hungry.
          // For this visualization, let's keep it simple: Thinking = Sleeping.
          
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
    const interval = setInterval(tick, 100); // 100ms resolution
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
