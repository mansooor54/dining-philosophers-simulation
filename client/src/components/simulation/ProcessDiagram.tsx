import { Philosopher } from "@/lib/types";
import { Utensils, Clock, Brain, Moon, Skull, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessDiagramProps {
  philosophers: Philosopher[];
  currentTime: number;
  timeToDie: number;
}

export function ProcessDiagram({ philosophers, currentTime, timeToDie }: ProcessDiagramProps) {
  const eatingCount = philosophers.filter(p => p.state === 'eating').length;
  const sleepingCount = philosophers.filter(p => p.state === 'sleeping').length;
  const hungryCount = philosophers.filter(p => p.state === 'hungry').length;
  const thinkingCount = philosophers.filter(p => p.state === 'thinking').length;

  return (
    <div className="bg-card rounded-xl border shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="font-serif font-bold text-lg">Philosopher Status</h3>
        <div className="text-sm font-mono text-muted-foreground">
          Time: <span className="font-bold text-foreground">{currentTime}ms</span>
        </div>
      </div>
      
      {/* State Summary */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-state-eating/10 border border-state-eating/30 rounded-lg p-3 text-center">
          <Utensils className="w-5 h-5 mx-auto text-state-eating mb-1" />
          <div className="text-2xl font-bold text-state-eating">{eatingCount}</div>
          <div className="text-[10px] uppercase text-muted-foreground">Eating</div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center">
          <Moon className="w-5 h-5 mx-auto text-purple-500 mb-1" />
          <div className="text-2xl font-bold text-purple-500">{sleepingCount}</div>
          <div className="text-[10px] uppercase text-muted-foreground">Sleeping</div>
        </div>
        <div className="bg-state-thinking/10 border border-state-thinking/30 rounded-lg p-3 text-center">
          <Brain className="w-5 h-5 mx-auto text-state-thinking mb-1" />
          <div className="text-2xl font-bold text-state-thinking">{thinkingCount}</div>
          <div className="text-[10px] uppercase text-muted-foreground">Thinking</div>
        </div>
        <div className="bg-state-hungry/10 border border-state-hungry/30 rounded-lg p-3 text-center">
          <Clock className="w-5 h-5 mx-auto text-state-hungry mb-1" />
          <div className="text-2xl font-bold text-state-hungry">{hungryCount}</div>
          <div className="text-[10px] uppercase text-muted-foreground">Hungry</div>
        </div>
      </div>

      {/* Individual Philosopher Stats */}
      <div className="mt-2">
        <div className="text-xs font-bold text-muted-foreground uppercase mb-2">Time Since Last Meal</div>
        <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-2">
          {philosophers.map(p => {
            const timeSinceLastMeal = currentTime - p.lastMealTime;
            const starvationPercent = Math.min(100, (timeSinceLastMeal / timeToDie) * 100);
            const isDanger = starvationPercent > 70;
            const isCritical = starvationPercent > 90;
            
            return (
              <div 
                key={p.id} 
                className={cn(
                  "flex items-center gap-3 p-2 rounded-lg border bg-muted/30",
                  isCritical && "border-destructive/50 bg-destructive/10",
                  isDanger && !isCritical && "border-orange-500/50 bg-orange-500/10"
                )}
              >
                <div className="font-mono font-bold text-sm w-8">P{p.id + 1}</div>
                
                <div className="flex-1">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-300",
                        isCritical ? "bg-destructive" : isDanger ? "bg-orange-500" : "bg-state-eating"
                      )}
                      style={{ width: `${starvationPercent}%` }}
                    />
                  </div>
                </div>
                
                <div className={cn(
                  "font-mono text-xs w-20 text-right",
                  isCritical && "text-destructive font-bold",
                  isDanger && !isCritical && "text-orange-500"
                )}>
                  {p.state === 'eating' ? (
                    <span className="text-state-eating">Eating</span>
                  ) : (
                    `${timeSinceLastMeal}ms`
                  )}
                </div>
                
                {isCritical && p.state !== 'eating' && (
                  <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
                )}
                {p.state === 'dead' && (
                  <Skull className="w-4 h-4 text-destructive" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="border-t pt-3 mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-1 bg-state-eating rounded" />
          <span>Safe</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-1 bg-orange-500 rounded" />
          <span>&gt;70% to death</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-1 bg-destructive rounded" />
          <span>&gt;90% critical</span>
        </div>
      </div>
    </div>
  );
}
