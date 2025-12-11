import { Philosopher, Fork } from "@/lib/types";
import { PhilosopherAvatar } from "./Philosopher";
import { ForkIcon } from "./Fork";
import { useRef, useEffect, useState } from "react";

interface TableProps {
  philosophers: Philosopher[];
  forks: Fork[];
}

export function Table({ philosophers, forks }: TableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [radius, setRadius] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setCenter({ x: width / 2, y: height / 2 });
      setRadius(Math.min(width, height) / 2.8); // Adjust size relative to container
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const getPosition = (index: number, count: number, offsetRadius: number = 0) => {
    const angle = (index / count) * 2 * Math.PI - Math.PI / 2; // Start from top
    return {
      x: center.x + (radius + offsetRadius) * Math.cos(angle),
      y: center.y + (radius + offsetRadius) * Math.sin(angle),
    };
  };

  const getForkPosition = (index: number, count: number) => {
    // We want F(i) to be to the LEFT of P(i).
    // P0 is at index 0 (Top).
    // F0 should be between P4 and P0.
    // Angle for P0 is 0 (relative to start).
    // Angle for P4 is 4/5 * 2PI.
    // We want angle -0.5 units.
    
    const angle = ((index - 0.5) / count) * 2 * Math.PI - Math.PI / 2;
    return {
      x: center.x + (radius * 0.6) * Math.cos(angle), // Forks closer to center
      y: center.y + (radius * 0.6) * Math.sin(angle),
      rotation: (angle * 180) / Math.PI + 90,
    };
  };

  return (
    <div ref={containerRef} className="w-full h-full relative bg-secondary/30 rounded-full border-4 border-dashed border-border/50">
      {/* Table Surface */}
      <div className="absolute inset-[15%] rounded-full bg-white shadow-xl border border-border/50 flex items-center justify-center">
        <div className="text-center opacity-20 pointer-events-none">
          <div className="font-serif text-4xl font-bold">REPLIT</div>
          <div className="font-mono text-sm">DINING HALL</div>
        </div>
      </div>

      {/* Forks */}
      {forks.map((fork, i) => {
         const tablePos = getForkPosition(i, forks.length);
         // Calculate owner position if owned
         let ownerPos = undefined;
         if (fork.ownerId !== null) {
            // If owned by P(id), move towards P(id)
            ownerPos = getPosition(fork.ownerId, philosophers.length, -40); // Slightly inside
         }
         
         return (
           <ForkIcon 
             key={fork.id} 
             fork={fork} 
             position={tablePos}
             ownerPosition={ownerPos}
             rotation={tablePos.rotation}
           />
         );
      })}

      {/* Philosophers */}
      {philosophers.map((p, i) => (
        <PhilosopherAvatar
          key={p.id}
          philosopher={p}
          position={getPosition(i, philosophers.length)}
        />
      ))}
    </div>
  );
}
