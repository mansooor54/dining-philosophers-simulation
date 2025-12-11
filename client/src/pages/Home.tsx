import { useDiningPhilosophers } from "@/lib/simulation-engine";
import { Table } from "@/components/simulation/Table";
import { LogViewer } from "@/components/simulation/LogViewer";
import { ProcessDiagram } from "@/components/simulation/ProcessDiagram";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Brain } from "lucide-react";

export default function Home() {
  const { 
    philosophers, 
    forks, 
    logs, 
    isRunning, 
    toggleSimulation, 
    resetSimulation,
    speed,
    setSpeed
  } = useDiningPhilosophers();

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 md:p-8 gap-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Dining Philosophers</h1>
          <p className="text-muted-foreground mt-1">Concurrency Problem Visualization</p>
        </div>
        
        <div className="flex items-center gap-4 bg-card p-2 rounded-lg border shadow-sm">
           <div className="flex items-center gap-2 px-2">
             <span className="text-xs font-bold uppercase text-muted-foreground">Speed</span>
             <Slider 
               value={[speed]} 
               onValueChange={(vals) => setSpeed(vals[0])} 
               min={0.5} 
               max={5} 
               step={0.5} 
               className="w-[100px]"
             />
           </div>
           <div className="h-6 w-px bg-border mx-1"></div>
           <Button 
             variant={isRunning ? "destructive" : "default"} 
             size="sm" 
             onClick={toggleSimulation}
             className="gap-2"
           >
             {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
             {isRunning ? "Pause" : "Start"}
           </Button>
           <Button variant="outline" size="sm" onClick={resetSimulation}>
             <RotateCcw className="w-4 h-4" />
           </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Simulation & Diagram */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Simulation Stage */}
          <div className="bg-card rounded-2xl border shadow-sm p-8 relative overflow-hidden min-h-[500px]">
            <div className="absolute top-4 left-4 z-10 space-y-2 pointer-events-none">
               <div className="flex items-center gap-2 text-xs font-mono bg-background/80 backdrop-blur p-2 rounded border shadow-sm">
                 <div className="w-3 h-3 rounded-full bg-state-thinking"></div>
                 <span>Thinking</span>
               </div>
               <div className="flex items-center gap-2 text-xs font-mono bg-background/80 backdrop-blur p-2 rounded border shadow-sm">
                 <div className="w-3 h-3 rounded-full bg-state-hungry animate-pulse"></div>
                 <span>Hungry</span>
               </div>
               <div className="flex items-center gap-2 text-xs font-mono bg-background/80 backdrop-blur p-2 rounded border shadow-sm">
                 <div className="w-3 h-3 rounded-full bg-state-eating"></div>
                 <span>Eating</span>
               </div>
            </div>
            
            <Table philosophers={philosophers} forks={forks} />
          </div>

          {/* Process Diagram */}
          <ProcessDiagram />
        </div>

        {/* Right Column: Info & Logs */}
        <div className="flex flex-col gap-6 h-full min-h-[600px]">
          <div className="bg-primary text-primary-foreground p-6 rounded-xl shadow-lg relative overflow-hidden shrink-0">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <Brain className="w-32 h-32" />
             </div>
             <h3 className="font-serif font-bold text-xl mb-2">The Problem</h3>
             <p className="text-sm opacity-90 leading-relaxed">
               Five philosophers sit at a table. They spend their lives thinking and eating. 
               To eat, a philosopher needs <strong>two forks</strong> (left and right). 
               They cannot eat if a neighbor is eating. This simulation visualizes resource sharing 
               and potential for deadlock/starvation.
             </p>
          </div>
          
          <LogViewer logs={logs} />
        </div>
      </main>
    </div>
  );
}
