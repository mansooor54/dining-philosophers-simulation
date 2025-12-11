export const CODE_SNIPPETS = {
  MAIN: {
    title: "Main Loop",
    code: `function simulationLoop() {
  // Check every philosopher
  for (let p of philosophers) {
    if (p.state === 'THINKING') {
      checkThinking(p);
    } else if (p.state === 'HUNGRY') {
      tryPickupForks(p);
    } else if (p.state === 'EATING') {
      checkEating(p);
    } else if (p.state === 'SLEEPING') {
      checkSleeping(p);
    }
  }
  
  // Check for starvation
  checkStarvation();
}`
  },
  THINKING: {
    title: "Thinking Process",
    code: `function checkThinking(p) {
  // Philosopher is contemplating
  p.thinkingTimeRemaining -= deltaTime;

  if (p.thinkingTimeRemaining <= 0) {
    // Done thinking, now hungry
    p.state = 'HUNGRY';
    log(p.id, "is thinking");
  }
}`
  },
  HUNGRY: {
    title: "Acquire Resources (Atomic)",
    code: `function tryPickupForks(p) {
  const left = getLeftFork(p);
  const right = getRightFork(p);

  // CRITICAL: Check BOTH forks atomically
  // This prevents deadlock where everyone 
  // holds one fork and waits for the other.
  if (left.owner === null && right.owner === null) {
    // Acquire both forks
    left.owner = p.id;
    right.owner = p.id;
    
    log(p.id, "has taken a fork");
    log(p.id, "has taken a fork");
    
    p.state = 'EATING';
    p.lastMealTime = currentTime;
    p.eatCount++;
    
    log(p.id, "is eating");
  }
  // If not both available, keep waiting
}`
  },
  EATING: {
    title: "Eating Process",
    code: `function checkEating(p) {
  // Philosopher is eating with both forks
  p.eatingTimeRemaining -= deltaTime;

  if (p.eatingTimeRemaining <= 0) {
    // Finished eating, release forks
    const left = getLeftFork(p);
    const right = getRightFork(p);
    
    left.owner = null;
    right.owner = null;
    
    // Go to sleep after eating
    p.state = 'SLEEPING';
    p.sleepTimeRemaining = config.timeToSleep;
    
    log(p.id, "is sleeping");
  }
}`
  },
  SLEEPING: {
    title: "Sleeping Process",
    code: `function checkSleeping(p) {
  // Philosopher is resting after meal
  p.sleepTimeRemaining -= deltaTime;

  if (p.sleepTimeRemaining <= 0) {
    // Done sleeping, start thinking
    p.state = 'THINKING';
    p.thinkingTimeRemaining = config.timeToThink;
    
    log(p.id, "is thinking");
  }
}`
  },
  DEATH: {
    title: "Starvation Check",
    code: `function checkStarvation() {
  for (let p of philosophers) {
    if (p.state === 'EATING') continue;
    
    const timeSinceMeal = currentTime - p.lastMealTime;
    
    if (timeSinceMeal > config.timeToDie) {
      // Philosopher has starved!
      p.state = 'DEAD';
      log(p.id, "died");
      
      // End simulation
      stopSimulation();
      return;
    }
  }
}`
  }
};

export type CodeSnippetKey = keyof typeof CODE_SNIPPETS;
