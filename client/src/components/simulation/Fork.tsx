import { motion } from "framer-motion";
import { Fork } from "@/lib/types";
import { UtensilsCrossed } from "lucide-react";

interface ForkProps {
  fork: Fork;
  position: { x: number; y: number };
  ownerPosition?: { x: number; y: number }; // Where it goes if owned
  rotation: number;
}

export function ForkIcon({ fork, position, ownerPosition, rotation }: ForkProps) {
  const isOwned = fork.ownerId !== null;
  
  // If owned, we want to move it towards the owner slightly
  const finalX = isOwned && ownerPosition ? ownerPosition.x + (Math.random() * 20 - 10) : position.x;
  const finalY = isOwned && ownerPosition ? ownerPosition.y + (Math.random() * 20 - 10) : position.y;

  return (
    <motion.div
      className={`absolute ${isOwned ? 'z-50' : 'z-10'}`} 
      initial={false}
      animate={{
        left: finalX,
        top: finalY,
        rotate: rotation,
        scale: isOwned ? 1.2 : 1,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className={`p-2 rounded-full transition-colors duration-300 ${isOwned ? 'bg-state-eating/20 text-state-eating shadow-lg ring-2 ring-state-eating' : 'bg-secondary text-muted-foreground'}`}>
        <UtensilsCrossed className="w-6 h-6" />
      </div>
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-mono">
        F{fork.id}
      </div>
    </motion.div>
  );
}
