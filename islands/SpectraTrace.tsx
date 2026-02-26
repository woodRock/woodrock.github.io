// islands/SpectraTrace.tsx
import { useEffect, useState, useRef } from "preact/hooks";
import { isClassifying, classificationResult } from "../utils/signals.ts";

interface Peak {
  x: number;
  intensity: number;
  label: string;
  mzRange: string;
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

  const majorPeaks: Peak[] = [
    { x: 150, intensity: 85, label: "Lipid Profile A", mzRange: "700-800", contribution: 0.24 },
    { x: 280, intensity: 98, label: "Fatty Acid Matrix", mzRange: "250-350", contribution: 0.31 },
    { x: 420, intensity: 65, label: "Protein Signature", mzRange: "500-600", contribution: 0.18 },
    { x: 580, intensity: 90, label: "Biochemical Marker C", mzRange: "850-950", contribution: 0.22 },
    { x: 750, intensity: 45, label: "Minor Metabolite", mzRange: "400-450", contribution: 0.05 },
    { x: 880, intensity: 75, label: "Species Indicator", mzRange: "300-400", contribution: 0.15 },
  ];

  const runInference = (e: MouseEvent) => {
    e.stopPropagation();
    if (isClassifying.value) return;
    
    console.log("Starting neural inference...");
    isClassifying.value = true;
    classificationResult.value = null;

    setTimeout(() => {
      const species = ["Blue Cod", "Snapper", "Tarakihi", "Mackerel", "Gurnard"];
      const randomSpecies = species[Math.floor(Math.random() * species.length)];
      classificationResult.value = {
        species: randomSpecies,
        confidence: 94.2 + Math.random() * 5
      };
      isClassifying.value = false;
      console.log("Inference complete:", randomSpecies);
    }, 3000);
  };

  useEffect(() => {
    const width = 1000;
    const baselineY = 185;
    let rawPath = `M 0 ${baselineY}`;
    let filteredPath = `M 0 ${baselineY}`;
    
    for (let x = 0; x <= width; x += 1) {
      const drift = (x * 0.005) + (Math.sin(x * 0.02) * 0.8);
      let yRaw = baselineY - drift - (Math.random() * 4); // High noise
      let yFiltered = baselineY - drift; // Clean baseline

      majorPeaks.forEach(peak => {
        const dist = Math.abs(x - peak.x);
        const w = peak.label.includes("Matrix") ? 14 : 8;
        
        if (dist < w * 4) {
          const gaussian = peak.intensity * Math.exp(-(dist * dist) / (2 * w * w));
          yRaw -= gaussian + (Math.random() * 5);
          yFiltered -= gaussian;
        }

        // Isotopic Cluster (M+1, M+2)
        [12, 24].forEach((offset, i) => {
          const distIso = Math.abs(x - (peak.x + offset));
          if (distIso < w * 2) {
            const isoGaussian = (peak.intensity * (0.4 / (i + 1))) * Math.exp(-(distIso * distIso) / (2 * w * w));
            yRaw -= isoGaussian + (Math.random() * 2);
            yFiltered -= isoGaussian;
          }
        });
      });

      // Background "Grass" (Chemical Noise)
      if (Math.random() > 0.99) yRaw -= Math.random() * 15;

      rawPath += ` L ${x} ${yRaw}`;
      filteredPath += ` L ${x} ${yFiltered}`;
    }
    setPaths({ raw: rawPath, filtered: filteredPath });

    // Telemetry scan animation
    let frame: number;
    const animate = () => {
      setScanX(prev => (prev + 1.5) % 1000);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const closest = majorPeaks.find(p => Math.abs(p.x - x) < 20);
    setHighlightedPeak(closest || null);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHighlightedPeak(null)}
      class="relative w-full h-48 group cursor-crosshair select-none overflow-hidden rounded-xl bg-slate-900/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5"
    >
      <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
        {/* Raw Noisy Signal */}
        <path d={paths.raw} fill="none" stroke="currentColor" stroke-width="0.5" class="text-slate-400 dark:text-slate-600 opacity-30" />
        
        {/* AI Filtered Signal */}
        <path d={paths.filtered} fill="none" stroke="#6366f1" stroke-width="1.5" class="drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" />

        {/* Scanning Beam */}
        <line x1={scanX} y1="0" x2={scanX} y2="200" stroke="rgba(99,102,241,0.2)" stroke-width="20" />
        <line x1={scanX} y1="0" x2={scanX} y2="200" stroke="#6366f1" stroke-width="1" class="opacity-50" />

        {/* Grid lines */}
        {[40, 80, 120, 160].map(y => (
          <line x1="0" y1={y} x2="1000" y2={y} stroke="currentColor" stroke-width="0.5" class="text-black/5 dark:text-white/5" stroke-dasharray="2 4" />
        ))}
      </svg>

      {/* Dynamic Data Panel */}
      {highlightedPeak && (
        <div 
          class="absolute pointer-events-none z-30 transition-all duration-150"
          style={{ left: `${(highlightedPeak.x / 1000) * 100}%`, top: '10%' }}
        >
          <div class="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-indigo-500/30 p-4 rounded-2xl shadow-2xl min-w-[180px] transform -translate-x-1/2">
            <div class="flex justify-between items-start mb-2">
              <span class="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Spectral Fingerprint</span>
              <span class="text-[9px] font-bold text-green-500">Active Feature</span>
            </div>
            <div class="text-sm font-bold text-slate-900 dark:text-white mb-1">{highlightedPeak.label}</div>
            <div class="flex gap-4 border-t border-black/5 dark:border-white/5 pt-2 mt-2">
              <div>
                <div class="text-[8px] font-black text-slate-400 uppercase">m/z Range</div>
                <div class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{highlightedPeak.mzRange}</div>
              </div>
              <div>
                <div class="text-[8px] font-black text-slate-400 uppercase">Feature Importance</div>
                <div class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">{(highlightedPeak.contribution * 100).toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legend & Controls */}
      <div class="absolute top-4 left-6 flex gap-6 pointer-events-none">
        <div class="flex items-center gap-2">
          <div class="w-2 h-0.5 bg-slate-400 opacity-50"></div>
          <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest">Raw Fingerprint</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-2 h-0.5 bg-indigo-500 shadow-[0_0_5px_rgba(99,102,241,1)]"></div>
          <span class="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Latent Feature Extraction</span>
        </div>
      </div>

      <div class="absolute top-4 right-6 flex items-center gap-4">
        <button
          onClick={runInference}
          disabled={classifying}
          class={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${
            classifying 
              ? "bg-indigo-500/20 text-indigo-400 animate-pulse" 
              : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg active:scale-95"
          }`}
        >
          {classifying ? "Processing Stream..." : "Run Neural Inference"}
        </button>
      </div>

      {result && (
        <div class="absolute top-16 right-6 animate-fade-in">
          <div class="bg-indigo-600 px-4 py-2 rounded-2xl shadow-xl border border-white/20">
            <div class="text-[8px] font-black text-indigo-200 uppercase tracking-widest">Classification Alpha</div>
            <div class="text-white font-bold text-sm">
              {result.species} • {result.confidence.toFixed(1)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}