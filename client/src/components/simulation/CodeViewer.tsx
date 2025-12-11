import { CODE_SNIPPETS, CodeSnippetKey } from "@/lib/code-snippets";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Code2 } from "lucide-react";

interface CodeViewerProps {
  activeKey: CodeSnippetKey | null;
}

export function CodeViewer({ activeKey }: CodeViewerProps) {
  const currentSnippet = activeKey ? CODE_SNIPPETS[activeKey] : CODE_SNIPPETS.MAIN;

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800 shadow-sm overflow-hidden text-slate-50">
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-400" />
          <h3 className="font-mono font-bold text-sm">simulation_engine.js</h3>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          {currentSnippet.title}
        </div>
      </div>
      <ScrollArea className="flex-1 p-0">
        <div className="p-4 font-mono text-xs leading-relaxed overflow-x-auto">
          <pre>
            <code className="block">
              {currentSnippet.code.split('\n').map((line: string, i: number) => (
                <div key={i} className={cn(
                  "flex",
                  // Simple syntax highlighting simulation
                  line.includes('function') && "text-purple-400",
                  line.includes('if') && "text-purple-400",
                  line.includes('const') && "text-blue-400",
                  line.includes('return') && "text-purple-400",
                  line.includes('//') && "text-slate-500 italic",
                  line.includes("log") && "text-yellow-300",
                  line.includes("'") && "text-green-300",
                )}>
                  <span className="w-6 text-slate-700 select-none mr-2 text-right shrink-0">{i + 1}</span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              ))}
            </code>
          </pre>
        </div>
      </ScrollArea>
    </div>
  );
}
