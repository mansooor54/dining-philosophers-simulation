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
  const [tableRadius, setTableRadius] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setCenter({ x: width / 2, y: height / 2 });
      // Table radius - philosophers will sit ON this circle
      setTableRadius(Math.min(width, height) / 2.5);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Philosophers sit exactly on the table edge (circle line)
  const getPhilosopherPosition = (index: number, count: number) => {
    const angle = (index / count) * 2 * Math.PI - Math.PI / 2; // Start from top
    return {
      x: center.x + tableRadius * Math.cos(angle),
      y: center.y + tableRadius * Math.sin(angle),
    };
  };

  // Forks are placed between philosophers, closer to center
  const getForkPosition = (index: number, count: number) => {
    const angle = ((index + 0.5) / count) * 2 * Math.PI - Math.PI / 2;
    return {
      x: center.x + (tableRadius * 0.55) * Math.cos(angle),
      y: center.y + (tableRadius * 0.55) * Math.sin(angle),
      rotation: (angle * 180) / Math.PI + 90,
    };
  };

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-visible">
      {/* Table Surface - The circular table */}
      <div 
        className="absolute rounded-full bg-gradient-to-br from-amber-50 to-amber-100 border-8 border-amber-200/80 shadow-xl flex items-center justify-center z-0"
        style={{
          width: tableRadius * 1.6,
          height: tableRadius * 1.6,
          left: center.x,
          top: center.y,
          transform: "translate(-50%, -50%)"
        }}
      >
        <div className="text-center opacity-30 pointer-events-none">
          <div className="font-serif text-3xl font-bold text-amber-800">DINING</div>
          <div className="font-mono text-xs text-amber-700">PHILOSOPHERS</div>
        </div>
      </div>

      {/* Circle line where philosophers sit */}
      <div 
        className="absolute rounded-full border-2 border-dashed border-muted-foreground/20 z-0"
        style={{
          width: tableRadius * 2,
          height: tableRadius * 2,
          left: center.x,
          top: center.y,
          transform: "translate(-50%, -50%)"
        }}
      />

      {/* Forks */}
      {forks.map((fork, i) => {
         const tablePos = getForkPosition(i, forks.length);
         let ownerPos = undefined;
         if (fork.ownerId !== null) {
            ownerPos = getPhilosopherPosition(fork.ownerId, philosophers.length);
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

      {/* Philosophers - positioned exactly on the circle line */}
      {philosophers.map((p, i) => (
        <PhilosopherAvatar
          key={p.id}
          philosopher={p}
          position={getPhilosopherPosition(i, philosophers.length)}
        />
      ))}
    </div>
  );
}
