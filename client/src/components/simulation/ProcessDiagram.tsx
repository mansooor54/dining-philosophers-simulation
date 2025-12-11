import { Philosopher } from "@/lib/types";
import { Skull, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessDiagramProps {
  philosophers: Philosopher[];
  currentTime: number;
  timeToDie: number;
}

export function ProcessDiagram({ philosophers, currentTime, timeToDie }: ProcessDiagramProps) {
  return (
    <div className="bg-card rounded-xl border shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="font-serif font-bold text-lg">Time Since Last Meal</h3>
        <div className="text-sm font-mono text-muted-foreground">
          Time: <span className="font-bold text-foreground">{currentTime}ms</span>
        </div>
      </div>

      {/* Individual Philosopher Stats */}
      <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2">
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

      {/* Legend */}
      <div className="border-t pt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
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
