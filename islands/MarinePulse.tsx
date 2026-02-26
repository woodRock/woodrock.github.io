// islands/MarinePulse.tsx
import { useEffect, useState } from "preact/hooks";

interface MarineData {
  waveHeight: number;
  wavePeriod: number;
  temp: number;
  direction: number;
}

export default function MarinePulse() {
  const [data, setData] = useState<MarineData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMarineData() {
      try {
        // Wellington Coordinates
        const lat = -41.2866;
        const lon = 174.7756;
        const res = await fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&current=wave_height,wave_period,wave_direction&hourly=wave_height&daily=sea_surface_temperature_max`);
        const json = await res.json();
        
        setData({
          waveHeight: json.current.wave_height,
          wavePeriod: json.current.wave_period,
          temp: 16.2, // Fallback or mock if not in current
          direction: json.current.wave_direction
        });
      } catch (err) {
        console.error("Failed to fetch marine data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMarineData();
    const interval = setInterval(fetchMarineData, 300000); // Update every 5 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div class="group relative bg-white/50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 rounded-[2.5rem] p-8 backdrop-blur-md overflow-hidden shadow-xl dark:shadow-2xl transition-all hover:border-indigo-500/30">
      <div class="relative z-10 flex flex-col h-full">
        <div class="flex justify-between items-start mb-10">
          <div>
            <h3 class="text-white font-bold text-lg tracking-tight mb-1">Wellington Marine Pulse</h3>
            <div class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <p class="text-slate-500 text-[10px] uppercase tracking-widest font-black">Live Environmental Feed</p>
            </div>
          </div>
          <div class="px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
            41.28° S, 174.77° E
          </div>
        </div>

        {loading ? (
          <div class="flex-grow flex items-center justify-center py-12">
            <div class="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : data ? (
          <div class="flex-grow grid grid-cols-2 gap-8">
            <div class="space-y-1">
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-500">Wave Height</span>
              <div class="flex items-baseline gap-2">
                <span class="text-4xl font-black text-white tracking-tighter">{data.waveHeight.toFixed(1)}</span>
                <span class="text-sm font-bold text-slate-200 uppercase">meters</span>
              </div>
            </div>
            <div class="space-y-1 text-right">
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-300 dark:text-slate-500">Peak Period</span>
              <div class="flex items-baseline justify-end gap-2">
                <span class="text-4xl font-black text-white tracking-tighter">{data.wavePeriod.toFixed(1)}</span>
                <span class="text-sm font-bold text-slate-200 uppercase">sec</span>
              </div>
            </div>
            
            {/* Animated Wave Signal */}
            <div class="col-span-2 relative h-24 mt-4 bg-slate-100 dark:bg-white/5 rounded-3xl overflow-hidden border border-black/5 dark:border-white/5">
               <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                 <path 
                   d="M0 50 Q 25 10, 50 50 T 100 50 T 150 50 T 200 50 T 250 50 T 300 50 T 350 50 T 400 50 T 450 50 T 500 50" 
                   fill="none" 
                   stroke="rgba(99, 102, 241, 0.4)" 
                   stroke-width="2"
                   class="animate-wave"
                 />
                 <path 
                   d="M0 50 Q 25 30, 50 50 T 100 50 T 150 50 T 200 50 T 250 50 T 300 50 T 350 50 T 400 50 T 450 50 T 500 50" 
                   fill="none" 
                   stroke="rgba(99, 102, 241, 0.2)" 
                   stroke-width="1"
                   class="animate-wave-slow"
                 />
               </svg>
               <div class="absolute inset-0 flex items-center justify-center">
                  <div class="px-4 py-1 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-black/5 dark:border-white/5 backdrop-blur-sm shadow-lg dark:shadow-xl">
                    <span class="text-[10px] font-black text-slate-900 dark:text-white tracking-[0.2em] uppercase">Telemetry Active</span>
                  </div>
               </div>
            </div>
          </div>
        ) : (
          <div class="flex-grow flex items-center justify-center py-12 text-slate-400 dark:text-slate-600 text-xs font-bold uppercase tracking-widest">
            Signal Interrupted
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes wave {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100px); }
          }
          .animate-wave {
            animation: wave 3s linear infinite;
            width: 200%;
          }
          .animate-wave-slow {
            animation: wave 5s linear infinite;
            width: 200%;
          }
        `}
      </style>
    </div>
  );
}