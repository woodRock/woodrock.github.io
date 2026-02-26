// islands/OceanicHUD.tsx
import { useEffect, useState, useRef } from "preact/hooks";

const ZONES = [
  { depth: 0, name: "Epipelagic Zone", range: "0 - 200m", fact: "The sunlight zone" },
  { depth: 200, name: "Mesopelagic Zone", range: "200 - 1000m", fact: "The twilight zone" },
  { depth: 1000, name: "Bathypelagic Zone", range: "1000 - 4000m", fact: "The midnight zone" },
  { depth: 4000, name: "Abyssopelagic Zone", range: "4000 - 6000m", fact: "The abyss" },
  { depth: 6000, name: "Hadalpelagic Zone", range: "6000m+", fact: "The trenches" },
];

export default function OceanicHUD() {
  const [activeZone, setActiveZone] = useState(ZONES[0]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollY / scrollHeight;
      const currentDepth = progress * 7000; // Simulated depth up to 7000m

      const zone = [...ZONES].reverse().find(z => currentDepth >= z.depth) || ZONES[0];
      
      if (zone.name !== activeZone.name) {
        setActiveZone(zone);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeZone]);

  return (
    <div class="fixed bottom-0 left-0 right-0 z-[60] pointer-events-none">
      <div class="bg-zinc-950/40 backdrop-blur-md border-t border-white/5 px-6 py-2 flex flex-col md:flex-row justify-between items-center gap-2">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <div class="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
            <span class="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-400">Telemetry Active</span>
          </div>
          <div class="h-4 w-px bg-white/10 hidden md:block"></div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-mono text-slate-500 uppercase">Zone:</span>
            <span class="text-[10px] font-black text-white uppercase tracking-wider">{activeZone.name}</span>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-mono text-slate-500 uppercase">Range:</span>
            <span class="text-[10px] font-bold text-slate-300">{activeZone.range}</span>
          </div>
          <div class="h-4 w-px bg-white/10 hidden md:block"></div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold italic text-indigo-400/60 transition-all duration-1000">
              {activeZone.fact}
            </span>
          </div>
        </div>
      </div>
      
      {/* Visual Depth Progress Line */}
      <div class="h-0.5 w-full bg-white/5 relative">
        <div 
          class="absolute top-0 left-0 h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-500"
          style={{ width: `${(ZONES.indexOf(activeZone) + 1) / ZONES.length * 100}%` }}
        />
      </div>
    </div>
  );
}
