import { Philosopher } from "@/lib/types";
import { Utensils, Moon, Brain, Clock } from "lucide-react";

interface StatsSummaryProps {
  philosophers: Philosopher[];
}

export function StatsSummary({ philosophers }: StatsSummaryProps) {
  const eatingCount = philosophers.filter(p => p.state === 'eating').length;
  const sleepingCount = philosophers.filter(p => p.state === 'sleeping').length;
  const thinkingCount = philosophers.filter(p => p.state === 'thinking').length;
  const hungryCount = philosophers.filter(p => p.state === 'hungry').length;

  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <Utensils className="w-6 h-6 mx-auto text-green-500 mb-2" />
        <div className="text-3xl font-bold text-green-600">{eatingCount}</div>
        <div className="text-[10px] uppercase text-green-600/70 font-semibold tracking-wider">Eating</div>
      </div>
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
        <Moon className="w-6 h-6 mx-auto text-purple-500 mb-2" />
        <div className="text-3xl font-bold text-purple-600">{sleepingCount}</div>
        <div className="text-[10px] uppercase text-purple-600/70 font-semibold tracking-wider">Sleeping</div>
      </div>
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 text-center">
        <Brain className="w-6 h-6 mx-auto text-sky-500 mb-2" />
        <div className="text-3xl font-bold text-sky-600">{thinkingCount}</div>
        <div className="text-[10px] uppercase text-sky-600/70 font-semibold tracking-wider">Thinking</div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
        <Clock className="w-6 h-6 mx-auto text-amber-500 mb-2" />
        <div className="text-3xl font-bold text-amber-600">{hungryCount}</div>
        <div className="text-[10px] uppercase text-amber-600/70 font-semibold tracking-wider">Hungry</div>
      </div>
    </div>
  );
}
