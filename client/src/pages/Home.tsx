import { useDiningPhilosophers } from "@/lib/simulation-engine";
import { Table } from "@/components/simulation/Table";
import { LogViewer } from "@/components/simulation/LogViewer";
import { ProcessDiagram } from "@/components/simulation/ProcessDiagram";
import { StatsSummary } from "@/components/simulation/StatsSummary";
import { CodeViewer } from "@/components/simulation/CodeViewer";
import { TerminalView } from "@/components/simulation/TerminalView";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, RotateCcw, Brain, StepForward, Settings2, Skull, User } from "lucide-react";
import authorPhoto from "@assets/author_photo.png";
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
    terminalLogs,
    isRunning, 
    setIsRunning,
    resetSimulation,
    speed,
    setSpeed,
    config,
    updateConfig,
    activeCode,
    isStepMode,
    setIsStepMode,
    step,
    isDead,
    currentTime
  } = useDiningPhilosophers();

  const handleStep = () => {
    setIsRunning(true); 
    step();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 md:p-8 gap-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex items-center gap-4">
          <img 
            src={authorPhoto} 
            alt="Mansoor Abdullah Almarzooqi" 
            className="w-14 h-14 rounded-full object-cover border-2 border-primary shadow-lg"
          />
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">Dining Philosophers Simulation</h1>
            <p className="text-muted-foreground mt-1">Concurrency Problem Visualization</p>
          </div>
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
               <PopoverContent className="w-96">
                 <div className="grid gap-4">
                   <div className="space-y-2">
                     <h4 className="font-medium leading-none">Simulation Parameters</h4>
                     <p className="text-sm text-muted-foreground">Configure the rules of the table.</p>
                   </div>
                   <div className="grid gap-4 py-2">
                     <div className="grid grid-cols-3 items-center gap-4">
                       <Label htmlFor="count">Philosophers</Label>
                       <Input
                         id="count"
                         type="number"
                         min={2}
                         max={15}
                         value={config.philosopherCount}
                         onChange={(e) => updateConfig({ philosopherCount: parseInt(e.target.value) })}
                         className="col-span-2 h-8"
                       />
                     </div>
                     <div className="grid grid-cols-3 items-center gap-4">
                       <Label htmlFor="die" className="text-destructive font-bold">Time to Die</Label>
                       <div className="col-span-2 flex items-center gap-2">
                         <Input
                           id="die"
                           type="number"
                           value={config.timeToDie}
                           onChange={(e) => updateConfig({ timeToDie: parseInt(e.target.value) })}
                           className="h-8"
                         />
                         <span className="text-xs text-muted-foreground">ms</span>
                       </div>
                     </div>
                     <div className="grid grid-cols-3 items-center gap-4">
                       <Label htmlFor="eat">Time to Eat</Label>
                       <div className="col-span-2 flex items-center gap-2">
                         <Input
                           id="eat"
                           type="number"
                           value={config.timeToEat}
                           onChange={(e) => updateConfig({ timeToEat: parseInt(e.target.value) })}
                           className="h-8"
                         />
                         <span className="text-xs text-muted-foreground">ms</span>
                       </div>
                     </div>
                     <div className="grid grid-cols-3 items-center gap-4">
                       <Label htmlFor="sleep">Time to Sleep</Label>
                       <div className="col-span-2 flex items-center gap-2">
                         <Input
                           id="sleep"
                           type="number"
                           value={config.timeToSleep}
                           onChange={(e) => updateConfig({ timeToSleep: parseInt(e.target.value) })}
                           className="h-8"
                         />
                         <span className="text-xs text-muted-foreground">ms</span>
                       </div>
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
                 disabled={isDead}
               />
             </div>

             <div className="h-6 w-px bg-border mx-1"></div>

             {/* Speed Slider */}
             {!isStepMode && (
               <div className="flex items-center gap-2 px-2">
                 <span className="text-xs font-bold uppercase text-muted-foreground">Speed</span>
                 <Slider 
                   value={[speed]} 
                   onValueChange={(vals) => setSpeed(vals[0])} 
                   min={0.1} 
                   max={2} 
                   step={0.1} 
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
                 disabled={isDead}
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
                 disabled={isDead}
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
          
          {/* Simulation Stage with Stats */}
          <div className="flex gap-4">
            {/* Stats Summary - Left Side */}
            <div className="shrink-0">
              <StatsSummary philosophers={philosophers} />
            </div>
            
            {/* Table */}
            <div className={`flex-1 bg-card rounded-2xl border shadow-sm p-8 relative overflow-hidden min-h-[500px] transition-colors duration-500 ${isDead ? 'border-destructive/50 bg-destructive/5' : ''}`}>
            
            {isDead && (
              <div className="absolute inset-0 flex items-center justify-center z-50 bg-background/50 backdrop-blur-sm animate-in fade-in duration-1000">
                <div className="bg-destructive text-destructive-foreground p-6 rounded-xl shadow-2xl text-center border-4 border-destructive-foreground/20">
                  <Skull className="w-16 h-16 mx-auto mb-4 animate-bounce" />
                  <h2 className="text-3xl font-bold font-serif mb-2">SIMULATION ENDED</h2>
                  <p className="opacity-90">A philosopher has died of starvation.</p>
                  <Button variant="secondary" className="mt-6 w-full font-bold" onClick={resetSimulation}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restart
                  </Button>
                </div>
              </div>
            )}

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
               <div className="flex items-center gap-2 text-xs font-mono bg-background/80 backdrop-blur p-2 rounded border shadow-sm">
                 <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                 <span>Sleeping</span>
               </div>
            </div>
            
            <Table philosophers={philosophers} forks={forks} />
            </div>
          </div>

          {/* Process Diagram */}
          <ProcessDiagram 
            philosophers={philosophers} 
            currentTime={currentTime} 
            timeToDie={config.timeToDie} 
          />
        </div>

        {/* Right Column: Info, Logs & Code */}
        <div className="flex flex-col gap-6 h-full min-h-[600px]">
          <div className="bg-primary text-primary-foreground p-6 rounded-xl shadow-lg relative overflow-hidden shrink-0">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <Brain className="w-32 h-32" />
             </div>
             <h3 className="font-serif font-bold text-xl mb-2">Configuration</h3>
             <div className="grid grid-cols-2 gap-4 text-sm opacity-90 font-mono">
                <div>
                   <div className="text-xs opacity-50 uppercase">Time to Die</div>
                   <div className="text-lg font-bold text-red-300">{config.timeToDie}ms</div>
                </div>
                <div>
                   <div className="text-xs opacity-50 uppercase">Philosophers</div>
                   <div className="text-lg font-bold">{config.philosopherCount}</div>
                </div>
                <div>
                   <div className="text-xs opacity-50 uppercase">Time to Eat</div>
                   <div className="text-lg font-bold">{config.timeToEat}ms</div>
                </div>
                <div>
                   <div className="text-xs opacity-50 uppercase">Time to Sleep</div>
                   <div className="text-lg font-bold">{config.timeToSleep}ms</div>
                </div>
             </div>
          </div>
          
          <Tabs defaultValue="terminal" className="flex flex-col h-[500px]">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="terminal">Terminal</TabsTrigger>
              <TabsTrigger value="logs">UI Log</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
            <TabsContent value="terminal" className="flex-1 h-0">
              <TerminalView logs={terminalLogs} />
            </TabsContent>
            <TabsContent value="logs" className="flex-1 h-0">
              <LogViewer logs={logs} />
            </TabsContent>
            <TabsContent value="code" className="flex-1 h-0">
              <CodeViewer activeKey={isStepMode ? activeCode : null} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Author Footer */}
      <footer className="mt-8 border-t pt-6 pb-4">
        <div className="flex items-center justify-center gap-4">
          <img 
            src={authorPhoto} 
            alt="Mansoor Abdullah Almarzooqi" 
            className="w-14 h-14 rounded-full object-cover border-2 border-primary shadow-lg"
          />
          <div className="text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Created by</div>
            <div className="font-serif font-bold text-lg text-foreground">Mansoor Abdullah Almarzooqi</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
