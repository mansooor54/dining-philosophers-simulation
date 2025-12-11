import { motion } from "framer-motion";
import { Philosopher } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Brain, Utensils, Clock, Skull, Moon } from "lucide-react";
import philosopherImage from "@assets/generated_images/minimalist_greek_philosopher_marble_bust_icon.png";
import { ReactNode } from "react";

interface PhilosopherProps {
  philosopher: Philosopher;
  position: { x: number; y: number };
}

export function PhilosopherAvatar({ philosopher, position }: PhilosopherProps) {
  const { state, id } = philosopher;

  const stateColors: Record<string, string> = {
    thinking: "border-state-thinking shadow-[0_0_20px_hsl(200_80%_60%_/_0.3)]",
    hungry: "border-state-hungry shadow-[0_0_20px_hsl(35_90%_60%_/_0.4)] animate-pulse",
    eating: "border-state-eating shadow-[0_0_30px_hsl(150_70%_45%_/_0.5)]",
    sleeping: "border-purple-500 shadow-[0_0_20px_hsl(270_80%_60%_/_0.4)]",
    dead: "border-destructive shadow-[0_0_30px_hsl(0_84%_60%_/_0.5)] grayscale",
  };

  const stateIcon: Record<string, ReactNode> = {
    thinking: <Brain className="w-3 h-3 text-state-thinking" />,
    hungry: <Clock className="w-3 h-3 text-state-hungry" />,
    eating: <Utensils className="w-3 h-3 text-state-eating" />,
    sleeping: <Moon className="w-3 h-3 text-purple-500" />,
    dead: <Skull className="w-3 h-3 text-destructive" />,
  };

  return (
    <motion.div
      className="absolute flex flex-col items-center justify-center gap-2 z-20"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <div className="relative">
        <div
          className={cn(
            "w-10 h-10 rounded-full border-2 bg-white overflow-hidden transition-all duration-500 relative",
            stateColors[state] || stateColors.thinking
          )}
        >
          <img 
            src={philosopherImage} 
            alt={`Philosopher ${id}`} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Status Badge */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-30 bg-background border border-border px-1.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 min-w-[60px] justify-center">
          {stateIcon[state] || stateIcon.thinking}
          <span className="text-[8px] font-bold uppercase tracking-wider">
            {state}
          </span>
        </div>
      </div>

      <div className="font-serif font-bold text-foreground/80 text-xs mt-1">
        P{id + 1}
      </div>
    </motion.div>
  );
}
