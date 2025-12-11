import { motion } from "framer-motion";
import { Philosopher } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Brain, Utensils, Clock, Skull } from "lucide-react";
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
    dead: "border-destructive shadow-[0_0_30px_hsl(0_84%_60%_/_0.5)] grayscale",
  };

  const stateIcon: Record<string, ReactNode> = {
    thinking: <Brain className="w-5 h-5 text-state-thinking" />,
    hungry: <Clock className="w-5 h-5 text-state-hungry" />,
    eating: <Utensils className="w-5 h-5 text-state-eating" />,
    dead: <Skull className="w-5 h-5 text-destructive" />,
  };

  return (
    <motion.div
      className="absolute flex flex-col items-center justify-center gap-2"
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
            "w-24 h-24 rounded-full border-4 bg-white overflow-hidden transition-all duration-500 z-10 relative",
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
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 bg-background border border-border px-3 py-1 rounded-full shadow-lg flex items-center gap-2 min-w-[100px] justify-center">
          {stateIcon[state] || stateIcon.thinking}
          <span className="text-xs font-bold uppercase tracking-wider">
            {state}
          </span>
        </div>
      </div>

      <div className="font-serif font-bold text-foreground/80 mt-2">
        P{id + 1}
      </div>
    </motion.div>
  );
}
