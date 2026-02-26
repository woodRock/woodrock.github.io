// islands/NeuralFish.tsx
import { useEffect } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { isClassifying, classificationResult } from "../utils/signals.ts";

export default function NeuralFish() {
  const time = useSignal(0);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      time.value += (isClassifying.value ? 0.03 : 0.01);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  const nodes = [
    { x: 50, y: 50, layer: 0 }, // Nose
    { x: 100, y: 30, layer: 1 }, { x: 100, y: 70, layer: 1 }, // Front
    { x: 160, y: 20, layer: 2 }, { x: 160, y: 50, layer: 2 }, { x: 160, y: 80, layer: 2 }, // Mid
    { x: 220, y: 40, layer: 3 }, { x: 220, y: 60, layer: 3 }, // Back
    { x: 270, y: 50, layer: 4 }, // Tail
  ];

  const connections = [
    [0, 1], [0, 2],
    [1, 3], [1, 4], [1, 5],
    [2, 3], [2, 4], [2, 5],
    [3, 6], [3, 7],
    [4, 6], [4, 7],
    [5, 6], [5, 7],
    [6, 8], [7, 8]
  ];

  const t = time.value; // Subscribe to signal updates

  // Single source of truth for node positions in the current frame
  const getPos = (i: number) => {
    const n = nodes[i];
    const progress = (n.x - 50) / 220;
    // Dramatically reduced amplitude and slower frequency for subtle motion
    const amp = (0.5 + progress * 4) * (isClassifying.value ? 1.2 : 1);
    const wave = Math.sin(t * 5 - n.x * 0.04) * amp;
    return { x: n.x, y: n.y + wave };
  };

  return (
    <div class={`relative w-full h-full transition-opacity duration-1000 ${
      isClassifying.value ? "scale-110 opacity-100" : "opacity-60 dark:opacity-40"
    }`}>
      <svg class="w-full h-full" viewBox="0 0 320 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Neural Connections */}
        {connections.map(([i, j]) => {
          const p1 = getPos(i);
          const p2 = getPos(j);
          return (
            <line
              key={`${i}-${j}`}
              x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
              stroke="currentColor"
              stroke-width={isClassifying.value ? "1" : "0.5"}
              class={classificationResult.value ? "text-green-500/50" : isClassifying.value ? "text-indigo-400" : "text-indigo-500/30"}
            />
          );
        })}

        {/* Tail Fin */}
        {(() => {
          const pTail = getPos(8);
          return (
            <path
              d={`M ${pTail.x} ${pTail.y} L 310 ${pTail.y - 20} L 310 ${pTail.y + 20} Z`}
              fill="currentColor"
              class={classificationResult.value ? "text-green-500/20" : "text-indigo-500/10"}
            />
          );
        })()}

        {/* Neural Nodes */}
        {nodes.map((_, idx) => {
          const p = getPos(idx);
          return (
            <circle
              key={idx}
              cx={p.x} cy={p.y} r={isClassifying.value ? "3.5" : "2.5"}
              fill="currentColor"
              class={classificationResult.value ? "text-green-400" : isClassifying.value ? "text-white" : "text-indigo-400"}
              filter="url(#node-glow)"
            />
          );
        })}
      </svg>
      <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span class={`text-[8px] font-black uppercase tracking-[0.4em] transition-colors duration-500 ${
          classificationResult.value ? "text-green-500" : "text-indigo-500/40"
        }`}>
          {classificationResult.value ? `Match: ${classificationResult.value.species}` : "Jesse Wood"}
        </span>
      </div>
    </div>
  );
}
