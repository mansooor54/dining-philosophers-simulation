import { useDiningPhilosophers } from "@/lib/simulation-engine";
import { Table } from "@/components/simulation/Table";
import { LogViewer } from "@/components/simulation/LogViewer";
import { ProcessDiagram } from "@/components/simulation/ProcessDiagram";
import { CodeViewer } from "@/components/simulation/CodeViewer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, RotateCcw, Brain, StepForward, Settings2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Home() {
  const { 
    philosophers, 
    forks, 
    logs, 
    isRunning, 
    setIsRunning,
    resetSimulation,
    speed,
    setSpeed,
    philosopherCount,
    setPhilosopherCount,
    activeCode,
    isStepMode,
    setIsStepMode,
    step
  } = useDiningPhilosophers();

  const handleStep = () => {
    setIsRunning(true); // Ensure it's "running" but controlled by manual steps if logic requires
    step();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 md:p-8 gap-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Dining Philosophers</h1>
          <p className="text-muted-foreground mt-1">Concurrency Problem Visualization</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           {/* Controls Bar */}
           <div className="flex items-center gap-4 bg-card p-2 rounded-lg border shadow-sm flex-wrap">
             
             {/* Config Popover */}
             <Popover>
               <PopoverTrigger asChild>
                 <Button variant="outline" size="sm" className="gap-2">
                   <Settings2 className="w-4 h-4" />
                   Config
                 </Button>
               </PopoverTrigger>
               <PopoverContent className="w-80">
                 <div className="grid gap-4">
                   <div className="space-y-2">
                     <h4 className="font-medium leading-none">Simulation Settings</h4>
                     <p className="text-sm text-muted-foreground">Adjust the parameters of the table.</p>
                   </div>
                   <div className="grid gap-2">
                     <div className="grid grid-cols-3 items-center gap-4">
                       <Label htmlFor="count">Philosophers</Label>
                       <Input
                         id="count"
                         type="number"
                         min={2}
                         max={15}
                         value={philosopherCount}
                         onChange={(e) => {
                           const val = parseInt(e.target.value);
                           if (val >= 2 && val <= 15) setPhilosopherCount(val);
                         }}
                         className="col-span-2 h-8"
                       />
                     </div>
                   </div>
                 </div>
               </PopoverContent>
             </Popover>

             <div className="h-6 w-px bg-border mx-1"></div>

             {/* Step Mode Toggle */}
             <div className="flex items-center gap-2 px-2">
               <Label htmlFor="step-mode" className="text-xs font-bold uppercase text-muted-foreground cursor-pointer">Step Mode</Label>
               <Switch 
                 id="step-mode" 
                 checked={isStepMode} 
                 onCheckedChange={setIsStepMode} 
               />
             </div>

             <div className="h-6 w-px bg-border mx-1"></div>

             {/* Speed Slider (Only if NOT step mode) */}
             {!isStepMode && (
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
             )}

             <div className="h-6 w-px bg-border mx-1"></div>

             {/* Action Buttons */}
             {isStepMode ? (
               <Button 
                 variant="default" 
                 size="sm" 
                 onClick={handleStep}
                 className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
               >
                 <StepForward className="w-4 h-4" />
                 Next Step
               </Button>
             ) : (
               <Button 
                 variant={isRunning ? "destructive" : "default"} 
                 size="sm" 
                 onClick={() => setIsRunning(!isRunning)}
                 className="gap-2"
               >
                 {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                 {isRunning ? "Pause" : "Start"}
               </Button>
             )}
             
             <Button variant="outline" size="sm" onClick={resetSimulation}>
               <RotateCcw className="w-4 h-4" />
             </Button>
           </div>
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

        {/* Right Column: Info, Logs & Code */}
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
          
          <Tabs defaultValue="logs" className="flex-1 flex flex-col">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="logs">Process Log</TabsTrigger>
              <TabsTrigger value="code">Code Viewer</TabsTrigger>
            </TabsList>
            <TabsContent value="logs" className="flex-1 h-0 min-h-[300px]">
              <LogViewer logs={logs} />
            </TabsContent>
            <TabsContent value="code" className="flex-1 h-0 min-h-[300px]">
              <CodeViewer activeKey={isStepMode ? activeCode : null} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
