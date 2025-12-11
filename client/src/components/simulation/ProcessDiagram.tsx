import { ArrowRight, Clock, Utensils, Brain, AlertCircle, Skull } from "lucide-react";

export function ProcessDiagram() {
  return (
    <div className="bg-card rounded-xl border shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b pb-4">
        <h3 className="font-serif font-bold text-lg">State Machine Diagram</h3>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
        
        {/* Thinking State */}
        <div className="flex flex-col items-center gap-2 group relative">
          <div className="w-16 h-16 rounded-full border-4 border-state-thinking bg-background flex items-center justify-center shadow-lg z-10">
            <Brain className="w-8 h-8 text-state-thinking" />
          </div>
          <span className="font-bold text-sm text-muted-foreground">THINKING</span>
          <div className="text-[10px] text-muted-foreground text-center max-w-[120px]">
            Releases forks, waits for think_time
          </div>
        </div>

        <ArrowRight className="w-8 h-8 text-muted-foreground/30 rotate-90 md:rotate-0" />

        {/* Hungry State */}
        <div className="flex flex-col items-center gap-2 relative">
          <div className="w-16 h-16 rounded-full border-4 border-state-hungry bg-background flex items-center justify-center shadow-lg z-10 animate-pulse">
            <Clock className="w-8 h-8 text-state-hungry" />
          </div>
          <span className="font-bold text-sm text-muted-foreground">HUNGRY</span>
          <div className="text-[10px] text-muted-foreground text-center max-w-[120px]">
            Waits to acquire BOTH forks
          </div>
        </div>

        <ArrowRight className="w-8 h-8 text-muted-foreground/30 rotate-90 md:rotate-0" />

        {/* Eating State */}
        <div className="flex flex-col items-center gap-2 relative">
          <div className="w-16 h-16 rounded-full border-4 border-state-eating bg-background flex items-center justify-center shadow-lg z-10">
            <Utensils className="w-8 h-8 text-state-eating" />
          </div>
          <span className="font-bold text-sm text-muted-foreground">EATING</span>
          <div className="text-[10px] text-muted-foreground text-center max-w-[120px]">
            Holds forks, resets starvation timer
          </div>
        </div>
        
        {/* Loop Back */}
        <div className="hidden md:flex absolute top-1/2 left-0 w-full h-24 -z-0 pointer-events-none">
           <svg className="w-full h-full overflow-visible">
             <path 
               d="M 100,60 Q 50,120 500,120 T 900,60" 
               fill="none" 
               stroke="currentColor" 
               strokeOpacity="0.1" 
               strokeWidth="2" 
               strokeDasharray="4 4"
               className="text-foreground"
             />
           </svg>
        </div>

      </div>
      
      {/* Death State Visualization */}
      <div className="border-t pt-4 mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
            <Skull className="w-4 h-4 text-destructive" />
            <span><strong>Starvation:</strong> If time since last meal &gt; time_to_die → <span className="text-destructive font-bold">DEATH</span></span>
        </div>
      </div>

      <div className="mt-2 bg-muted/30 p-3 rounded-lg text-xs text-muted-foreground flex gap-3 items-start border">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
        <p>
          <strong>Deadlock Prevention:</strong> In this simulation, philosophers only pick up forks if 
          <strong> both</strong> are available simultaneously (Atomic Acquisition).
        </p>
      </div>
    </div>
  );
}
