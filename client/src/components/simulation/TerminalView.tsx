import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal } from "lucide-react";
import { useEffect, useRef } from "react";

interface TerminalProps {
  logs: string[];
}

export function TerminalView({ logs }: TerminalProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-black rounded-xl border border-slate-800 shadow-sm overflow-hidden text-green-400 font-mono">
      <div className="p-3 border-b border-slate-800 bg-slate-900 flex items-center gap-2">
        <Terminal className="w-4 h-4" />
        <span className="text-xs font-bold">./philo</span>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-1 text-xs">
          {logs.length === 0 && <span className="opacity-50">Waiting for simulation...</span>}
          {logs.map((log, i) => (
            <div key={i} className="whitespace-nowrap">
              {log}
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
