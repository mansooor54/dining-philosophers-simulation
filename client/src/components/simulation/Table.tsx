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
      setRadius(Math.min(width, height) / 2.6); // Slightly larger radius for the circle
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
    const angle = ((index - 0.5) / count) * 2 * Math.PI - Math.PI / 2;
    return {
      x: center.x + (radius * 0.6) * Math.cos(angle), // Forks closer to center
      y: center.y + (radius * 0.6) * Math.sin(angle),
      rotation: (angle * 180) / Math.PI + 90,
    };
  };

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-visible">
      {/* Table Surface - Perfectly Circular */}
      <div 
        className="absolute rounded-full bg-secondary/30 border-4 border-dashed border-border/50 flex items-center justify-center z-0"
        style={{
          width: radius * 2.5,
          height: radius * 2.5,
          left: center.x,
          top: center.y,
          transform: "translate(-50%, -50%)"
        }}
      >
        <div className="text-center opacity-20 pointer-events-none">
          <div className="font-serif text-4xl font-bold">REPLIT</div>
          <div className="font-mono text-sm">DINING HALL</div>
        </div>
      </div>

      {/* Forks */}
      {forks.map((fork, i) => {
         const tablePos = getForkPosition(i, forks.length);
         let ownerPos = undefined;
         if (fork.ownerId !== null) {
            ownerPos = getPosition(fork.ownerId, philosophers.length, -40);
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
