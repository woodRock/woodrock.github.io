// islands/SpectraTrace.tsx
import { useEffect, useState, useRef } from "preact/hooks";
import { isClassifying, classificationResult, isSoundEnabled, highlightedMz } from "../utils/signals.ts";

interface Peak {
  mz: number;
  intensity: number;
  label: string;
  contribution: number;
}

export default function SpectraTrace() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<{ raw: string; filtered: string }>({ raw: "", filtered: "" });
  const [highlightedPeak, setHighlightedPeak] = useState<Peak | null>(null);
  const [scanX, setScanX] = useState(0);
  
  // Extract signal values for reactivity
  const classifying = isClassifying.value;
  const result = classificationResult.value;
  const sonarAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    sonarAudio.current = new Audio("/sonar.mp3");
  }, []);

  const majorPeaks: Peak[] = [
    { mz: 143.1526, intensity: 7477.7, label: "Peak", contribution: 0.35 },
    { mz: 128.0835, intensity: 6599.6, label: "Peak", contribution: 0.28 },
    { mz: 737.1575, intensity: 5512.0, label: "Peak", contribution: 0.22 },
    { mz: 137.0859, intensity: 4406.5, label: "Peak", contribution: 0.15 },
    { mz: 790.2923, intensity: 3906.4, label: "Peak", contribution: 0.18 },
    { mz: 281.2485, intensity: 3880.4, label: "Peak", contribution: 0.12 },
    { mz: 255.2427, intensity: 2932.4, label: "Peak", contribution: 0.10 },
    { mz: 327.2144, intensity: 2929.9, label: "Peak", contribution: 0.14 },
    { mz: 135.0773, intensity: 2715.4, label: "Peak", contribution: 0.08 },
    { mz: 701.1984, intensity: 2583.0, label: "Peak", contribution: 0.05 },
  ];

  // Dynamic axis scaling
  const mzValues = majorPeaks.map(p => p.mz);
  const MZ_MIN = Math.max(0, Math.floor(Math.min(...mzValues) / 50) * 50 - 50);
  const MZ_MAX = Math.ceil(Math.max(...mzValues) / 50) * 50 + 50;
  
  // Account for noise and baseline in max intensity
  const maxPeakIntensity = Math.max(...majorPeaks.map(p => p.intensity));
  const INT_MAX = Math.ceil((maxPeakIntensity + (maxPeakIntensity * 0.1)) / 100) * 100;

  const SVG_WIDTH = 1000;
  const SVG_HEIGHT = 250;
  const MARGIN_LEFT = 70;
  const MARGIN_RIGHT = 30;
  const MARGIN_TOP = 20;
  const MARGIN_BOTTOM = 50;
  const PLOT_WIDTH = SVG_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
  const PLOT_HEIGHT = SVG_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;

  const mzToX = (mz: number) => MARGIN_LEFT + ((mz - MZ_MIN) / (MZ_MAX - MZ_MIN)) * PLOT_WIDTH;
  const xToMz = (x: number) => MZ_MIN + ((x - MARGIN_LEFT) / PLOT_WIDTH) * (MZ_MAX - MZ_MIN);
  const intensityToY = (intensity: number) => (MARGIN_TOP + PLOT_HEIGHT) - (intensity / INT_MAX) * PLOT_HEIGHT;

  const runInference = (e: MouseEvent) => {
    e.stopPropagation();
    if (isClassifying.value) return;
    
    if (isSoundEnabled.value && sonarAudio.current) {
      sonarAudio.current.currentTime = 0;
      sonarAudio.current.play().catch(err => console.warn("Audio play failed:", err));
    }

    isClassifying.value = true;
    classificationResult.value = null;

    setTimeout(() => {
      // Specifically modeling the Hoki (H) sample from the dataset
      classificationResult.value = {
        species: "Hoki (Macruronus novaezelandiae)",
        confidence: 99.8
      };
      isClassifying.value = false;
    }, 3000);
  };

  useEffect(() => {
    const baselineY = MARGIN_TOP + PLOT_HEIGHT;
    let rawPath = `M ${MARGIN_LEFT} ${baselineY}`;
    let filteredPath = `M ${MARGIN_LEFT} ${baselineY}`;
    
    // Generate spectral points
    const step = 1;
    for (let x = MARGIN_LEFT; x <= MARGIN_LEFT + PLOT_WIDTH; x += step) {
      const mz = xToMz(x);
      // Realistic baseline drift (exponential decay + low freq sine)
      const drift = (INT_MAX * 0.02) + (INT_MAX * 0.05 * Math.exp(-(mz - MZ_MIN) / 300)) + (Math.sin(mz * 0.005) * (INT_MAX * 0.01));
      
      let yIntensityRaw = drift + (Math.random() * (INT_MAX * 0.01)); // Continuous background noise
      let yIntensityFiltered = drift;

      majorPeaks.forEach(peak => {
        const dist = Math.abs(mz - peak.mz);
        const width = 4; // FWHM-like parameter
        
        if (dist < width * 5) {
          const gaussian = peak.intensity * Math.exp(-(dist * dist) / (2 * width * width));
          yIntensityRaw += gaussian;
          yIntensityFiltered += gaussian;

          // Realistic isotopic clusters (M+1, M+2)
          [1.003, 2.006].forEach((offset, i) => {
            const isoMz = peak.mz + offset;
            const isoDist = Math.abs(mz - isoMz);
            const isoIntensity = peak.intensity * (0.2 / (i + 1));
            const isoGaussian = isoIntensity * Math.exp(-(isoDist * isoDist) / (2 * width * width));
            yIntensityRaw += isoGaussian;
            yIntensityFiltered += isoGaussian;
          });
        }
      });

      // Chemical "Grass" (Random sharp spikes)
      if (Math.random() > 0.98) {
        yIntensityRaw += Math.random() * (INT_MAX * 0.05);
      }

      const yRaw = intensityToY(yIntensityRaw);
      const yFiltered = intensityToY(yIntensityFiltered);

      rawPath += ` L ${x} ${yRaw}`;
      filteredPath += ` L ${x} ${yFiltered}`;
    }
    setPaths({ raw: rawPath, filtered: filteredPath });

    let frame: number;
    const animate = () => {
      setScanX(prev => {
        const next = prev + 2;
        return next > MARGIN_LEFT + PLOT_WIDTH ? MARGIN_LEFT : next;
      });
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [MZ_MIN, MZ_MAX, INT_MAX]);

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * SVG_WIDTH;
    const mz = xToMz(x);
    const closest = majorPeaks.find(p => Math.abs(p.mz - mz) < 10);
    setHighlightedPeak(closest || null);
    highlightedMz.value = closest ? closest.mz : null;
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setHighlightedPeak(null);
        highlightedMz.value = null;
      }}
      class="relative w-full h-64 group cursor-crosshair select-none overflow-hidden rounded-xl bg-slate-900/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 p-4"
    >
      <svg class="w-full h-full" preserveAspectRatio="xMidYMid meet" viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(p => {
          const intensity = p * INT_MAX;
          const y = intensityToY(intensity);
          return (
            <g key={p}>
              <line 
                x1={MARGIN_LEFT} y1={y} x2={MARGIN_LEFT + PLOT_WIDTH} y2={y} 
                stroke="currentColor" stroke-width="0.5" 
                class="text-black/5 dark:text-white/5" 
                stroke-dasharray="4 4" 
              />
              <text 
                x={MARGIN_LEFT - 10} y={y + 4} 
                text-anchor="end" 
                class="text-[10px] fill-slate-400 font-mono"
              >
                {Math.round(intensity)}
              </text>
            </g>
          );
        })}

        {/* m/z Ticks */}
        {(() => {
          const ticks = [];
          const step = (MZ_MAX - MZ_MIN) / 5;
          for (let i = 0; i <= 5; i++) {
            const mz = Math.round(MZ_MIN + i * step);
            const x = mzToX(mz);
            ticks.push(
              <g key={mz}>
                <line 
                  x1={x} y1={MARGIN_TOP + PLOT_HEIGHT} x2={x} y2={MARGIN_TOP + PLOT_HEIGHT + 5} 
                  stroke="currentColor" stroke-width="1" 
                  class="text-slate-400" 
                />
                <text 
                  x={x} y={MARGIN_TOP + PLOT_HEIGHT + 20} 
                  text-anchor="middle" 
                  class="text-[10px] fill-slate-400 font-mono"
                >
                  {mz}
                </text>
              </g>
            );
          }
          return ticks;
        })()}

        {/* Axes */}
        <line 
          x1={MARGIN_LEFT} y1={MARGIN_TOP + PLOT_HEIGHT} 
          x2={MARGIN_LEFT + PLOT_WIDTH} y2={MARGIN_TOP + PLOT_HEIGHT} 
          stroke="currentColor" stroke-width="1" class="text-slate-400" 
        />
        <line 
          x1={MARGIN_LEFT} y1={MARGIN_TOP} 
          x2={MARGIN_LEFT} y2={MARGIN_TOP + PLOT_HEIGHT} 
          stroke="currentColor" stroke-width="1" class="text-slate-400" 
        />

        {/* Axis Titles */}
        <text 
          x={MARGIN_LEFT + PLOT_WIDTH / 2} y={SVG_HEIGHT - 10} 
          text-anchor="middle" 
          class="text-xs font-black uppercase tracking-[0.2em] fill-slate-500"
        >
          m/z (Mass-to-Charge Ratio)
        </text>
        <text 
          x={20} y={MARGIN_TOP + PLOT_HEIGHT / 2} 
          text-anchor="middle" 
          transform={`rotate(-90, 20, ${MARGIN_TOP + PLOT_HEIGHT / 2})`}
          class="text-xs font-black uppercase tracking-[0.2em] fill-slate-500"
        >
          Intensity (Counts)
        </text>

        {/* Raw Noisy Signal */}
        <path d={paths.raw} fill="none" stroke="currentColor" stroke-width="0.5" class="text-slate-400 dark:text-slate-600 opacity-20" />
        
        {/* AI Filtered Signal */}
        <path d={paths.filtered} fill="none" stroke="#6366f1" stroke-width="1.5" class="drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" />

        {/* Scanning Beam */}
        <line x1={scanX} y1={MARGIN_TOP} x2={scanX} y2={MARGIN_TOP + PLOT_HEIGHT} stroke="rgba(99,102,241,0.2)" stroke-width="20" />
        <line x1={scanX} y1={MARGIN_TOP} x2={scanX} y2={MARGIN_TOP + PLOT_HEIGHT} stroke="#6366f1" stroke-width="1" class="opacity-50" />
      </svg>

      {/* Dynamic Data Panel */}
      {highlightedPeak && (
        <div 
          class="absolute pointer-events-none z-30 transition-all duration-150"
          style={{ left: `${(mzToX(highlightedPeak.mz) / SVG_WIDTH) * 100}%`, top: '15%' }}
        >
          <div class="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-indigo-500/30 p-4 rounded-2xl shadow-2xl min-w-[180px] transform -translate-x-1/2">
            <div class="flex justify-between items-start mb-2">
              <span class="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Spectral Peak</span>
              <span class="text-[9px] font-bold text-green-500">Active</span>
            </div>
            <div class="text-sm font-bold text-slate-900 dark:text-white mb-1">Fingerprint Data</div>
            <div class="flex gap-4 border-t border-black/5 dark:border-white/5 pt-2 mt-2">
              <div>
                <div class="text-[8px] font-black text-slate-400 uppercase">m/z</div>
                <div class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{highlightedPeak.mz.toFixed(4)}</div>
              </div>
              <div>
                <div class="text-[8px] font-black text-slate-400 uppercase">Intensity</div>
                <div class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{Math.round(highlightedPeak.intensity)}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div class="absolute top-4 right-6 flex items-center gap-4">
        <button
          onClick={runInference}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const deltaX = (e.clientX - (rect.left + rect.width / 2)) * 0.2;
            const deltaY = (e.clientY - (rect.top + rect.height / 2)) * 0.2;
            e.currentTarget.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = `translate(0, 0)`;
          }}
          disabled={classifying}
          class={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all duration-200 ${
            classifying 
              ? "bg-indigo-500/20 text-indigo-400 animate-pulse" 
              : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg active:scale-95 sonar-ping"
          }`}
        >
          {classifying ? "Processing Stream..." : "Run Neural Inference"}
        </button>
      </div>

      {result && (
        <div class="absolute bottom-10 right-10 animate-fade-in pointer-events-none">
          <div class="bg-indigo-600 p-4 rounded-[2rem] shadow-2xl border border-white/20 flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-white/10 p-2 backdrop-blur-md">
              <img src="/hoki.avif" alt="Hoki" class="w-full h-full object-contain drop-shadow-lg" />
            </div>
            <div>
              <div class="text-[8px] font-black text-indigo-200 uppercase tracking-widest mb-1">Inference Engine 1.0</div>
              <div class="text-white font-bold text-sm leading-tight">
                {result.species}
              </div>
              <div class="text-indigo-200 text-[10px] font-mono mt-1">
                Confidence: {result.confidence.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}