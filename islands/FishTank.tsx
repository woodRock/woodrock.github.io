// islands/FishTank.tsx
import { useEffect, useState } from "preact/hooks";

interface FishInstance {
  id: number;
  src: string;
  top: number; // percentage
  speed: number; // duration in seconds
  delay: number; // start delay
  size: number; // scale
  direction: "left" | "right";
  naturalFacing: "left" | "right";
}

const FISH_DATA = [
  { src: "/bluecod.png", naturalFacing: "right" as const },
  { src: "/gurnard.avif", naturalFacing: "left" as const },
  { src: "/mackerel.avif", naturalFacing: "left" as const },
  { src: "/snapper.png", naturalFacing: "right" as const },
  { src: "/tarakihi.png", naturalFacing: "right" as const }
];

export default function FishTank() {
  const [fish, setFish] = useState<FishInstance[]>([]);

  useEffect(() => {
    const newFish: FishInstance[] = [];
    // Create about 60 fish to cover the long scroll depth
    for (let i = 0; i < 60; i++) {
      const type = FISH_DATA[Math.floor(Math.random() * FISH_DATA.length)];
      newFish.push({
        id: i,
        src: type.src,
        naturalFacing: type.naturalFacing,
        top: Math.random() * 98 + 1, // Full depth coverage
        speed: 25 + Math.random() * 50,
        delay: Math.random() * -100,
        size: 0.25 + Math.random() * 0.5,
        direction: Math.random() > 0.5 ? "left" : "right"
      });
    }
    setFish(newFish);
  }, []);

  return (
    <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden min-h-full h-full">
      {fish.map((f) => {
        // Calculate flip based on natural facing vs swim direction
        // If they match, multiplier is 1. If they differ, multiplier is -1.
        const flipMultiplier = f.direction === f.naturalFacing ? 1 : -1;
        
        return (
          <div
            key={f.id}
            class="absolute"
            style={{
              top: `${f.top}%`,
              "--fish-scale": f.size,
              "--fish-flip": flipMultiplier,
              animation: `swim-${f.direction} ${f.speed}s linear infinite`,
              animationDelay: `${f.delay}s`,
              opacity: 0.35
            }}
          >
            <img 
              src={f.src} 
              alt="swimming fish" 
              class="w-24 md:w-48 h-auto object-contain"
              loading="lazy"
            />
          </div>
        );
      })}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes swim-right {
          from { transform: translateX(-300px) scale(var(--fish-scale)) scaleX(var(--fish-flip)); left: 0; }
          to { transform: translateX(calc(100vw + 300px)) scale(var(--fish-scale)) scaleX(var(--fish-flip)); left: 0; }
        }
        @keyframes swim-left {
          from { transform: translateX(300px) scale(var(--fish-scale)) scaleX(var(--fish-flip)); right: 0; }
          to { transform: translateX(calc(-100vw - 300px)) scale(var(--fish-scale)) scaleX(var(--fish-flip)); right: 0; }
        }
      `}} />
    </div>
  );
}
