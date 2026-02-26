// islands/DepthGauge.tsx
import { useEffect } from "preact/hooks";
import { depth } from "../utils/signals.ts";

export default function DepthGauge() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        document.documentElement.offsetHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight
      );
      const clientHeight = window.innerHeight;
      const windowHeight = scrollHeight - clientHeight;
      
      if (windowHeight > 0) {
        const p = scrollY / windowHeight;
        const newDepth = Math.round(p * 4000);
        depth.value = newDepth;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Only run once on mount

  return (
    <div class="depth-gauge-container pointer-events-none">
      {/* 1. The Fixed Indicator (Stays on screen) - HIDDEN ON MOBILE */}
      <div 
        class="hidden md:flex fixed right-4 top-48 z-[70] flex-col items-center gap-2"
      >
        <div 
          class="bg-zinc-950 border border-white/20 p-3 rounded-2xl shadow-2xl scale-90 md:scale-100"
        >
          <div class="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-0.5 text-center">Current Depth</div>
          <div class="text-xl font-black text-white tabular-nums tracking-tighter text-center">
            {depth.value}m
          </div>
        </div>
        {/* Horizontal indicator line pointing to the ruler */}
        <div class="w-12 h-px bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,1)]"></div>
      </div>

      {/* 2. The Absolute Ruler (Scrolls with the sea) - HIDDEN ON MOBILE */}
      <div class="hidden md:flex absolute right-0 top-0 h-full w-12 z-[60] flex-col items-center">
        <div class="h-full w-px bg-slate-900/20 dark:bg-white/10 relative">
          {/* Depth Ticks - Placed every 200m equivalent distance */}
          {[...Array(21)].map((_, i) => {
            const tickPercent = i * 5; // 0, 5, 10... 100%
            return (
              <div 
                key={i}
                class="absolute right-0 w-4 h-px bg-slate-900/40 dark:bg-white/30"
                style={{ top: `${tickPercent}%` }}
              >
                <span class="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {i * 200}m
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}