import { SimulationLog } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LogViewerProps {
  logs: SimulationLog[];
}

export function LogViewer({ logs }: LogViewerProps) {
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom only if user hasn't scrolled up (optional complexity, for now just auto scroll)
  useEffect(() => {
    // endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-card rounded-xl border shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-muted/30">
        <h3 className="font-serif font-bold text-lg">Process Log</h3>
        <p className="text-xs text-muted-foreground">Real-time sequence of events</p>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-3 text-sm animate-in slide-in-from-left-2 duration-300">
              <div className="font-mono text-xs text-muted-foreground min-w-[60px] pt-1">
                {Math.floor(log.timestamp)}ms
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-bold px-1.5 py-0.5 rounded text-[10px] uppercase",
                    log.action.includes("EATING") ? "bg-state-eating/10 text-state-eating" :
                    log.action.includes("HUNGRY") ? "bg-state-hungry/10 text-state-hungry" :
                    "bg-secondary text-secondary-foreground"
                  )}>
                    {log.action}
                  </span>
                  <span className="font-bold text-xs">Philosopher {log.philosopherId + 1}</span>
                </div>
                <div className="text-muted-foreground text-xs pl-0.5">
                  {log.details}
                </div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
