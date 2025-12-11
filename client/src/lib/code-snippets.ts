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
    }
  }
}`
  },
  THINKING: {
    title: "Thinking Process",
    code: `function checkThinking(p) {
  // Decrease timer
  p.thinkingTimeRemaining -= deltaTime;

  if (p.thinkingTimeRemaining <= 0) {
    p.state = 'HUNGRY';
    log(p.id, "Became Hungry");
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
    left.owner = p.id;
    right.owner = p.id;
    
    p.state = 'EATING';
    p.eatingTimeRemaining = randomDuration();
    log(p.id, "Picked up forks");
  }
  // If not both available, wait.
}`
  },
  EATING: {
    title: "Eating Process",
    code: `function checkEating(p) {
  // Decrease timer
  p.eatingTimeRemaining -= deltaTime;

  if (p.eatingTimeRemaining <= 0) {
    // Finished eating, release resources
    const left = getLeftFork(p);
    const right = getRightFork(p);
    
    left.owner = null;
    right.owner = null;
    
    p.state = 'THINKING';
    p.thinkingTimeRemaining = randomDuration();
    log(p.id, "Put down forks");
  }
}`
  }
};

export type CodeSnippetKey = keyof typeof CODE_SNIPPETS;
