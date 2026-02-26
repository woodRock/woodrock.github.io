// islands/NeuralFish.tsx
import { useEffect, useState } from "preact/hooks";
import { isClassifying, classificationResult } from "../utils/signals.ts";

export default function NeuralFish() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      setTime(prev => prev + (isClassifying.value ? 0.08 : 0.02));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Fish body nodes (ANN style)
  const nodes = [
    { x: 50, y: 50, layer: 0 }, // Nose
    { x: 100, y: 30, layer: 1 }, { x: 100, y: 70, layer: 1 }, // Front
    { x: 160, y: 20, layer: 2 }, { x: 160, y: 50, layer: 2 }, { x: 160, y: 80, layer: 2 }, // Mid
    { x: 220, y: 40, layer: 3 }, { x: 220, y: 60, layer: 3 }, // Back
    { x: 270, y: 50, layer: 4 }, // Tail start
  ];

  const getPos = (n: {x: number, y: number, layer: number}) => {
    const multiplier = isClassifying.value ? 2 : 1;
    const drift = Math.sin(time + n.layer * 0.5) * 5 * multiplier;
    const tailDrift = n.layer > 3 ? Math.sin(time * 2 + n.layer) * 15 * multiplier : 0;
    return { x: n.x, y: n.y + drift + tailDrift };
  };

  return (
    <div class={`relative w-full h-full transition-all duration-1000 ${
      isClassifying.value ? "scale-110 opacity-100 animate-vibrate" : "opacity-60 dark:opacity-40"
    }`}>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes vibrate {
          0% { transform: translate(0,0) scale(1.1); }
          25% { transform: translate(1px, -1px) scale(1.1); }
          50% { transform: translate(-1px, 1px) scale(1.1); }
          75% { transform: translate(1px, 1px) scale(1.1); }
          100% { transform: translate(0,0) scale(1.1); }
        }
        .animate-vibrate {
          animation: vibrate 0.2s infinite linear;
        }
      `}} />
      <svg class="w-full h-full" viewBox="0 0 320 100" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Neural Connections */}
        {nodes.map((n1, i) => 
          nodes.slice(i + 1).map((n2, j) => {
            if (Math.abs(n1.layer - n2.layer) !== 1) return null;
            const p1 = getPos(n1);
            const p2 = getPos(n2);
            return (
              <line
                key={`${i}-${j}`}
                x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                stroke="currentColor"
                stroke-width={isClassifying.value ? "1" : "0.5"}
                class={`transition-colors duration-500 ${
                  classificationResult.value 
                    ? "text-green-500/50" 
                    : isClassifying.value ? "text-indigo-400" : "text-indigo-500/30"
                }`}
              />
            );
          })
        )}

        {/* Tail Fin */}
        <path
          d={`M ${getPos(nodes[8]).x} ${getPos(nodes[8]).y} L 310 ${getPos(nodes[8]).y - 20} L 310 ${getPos(nodes[8]).y + 20} Z`}
          fill="currentColor"
          class={`transition-colors duration-500 ${
            classificationResult.value ? "text-green-500/20" : "text-indigo-500/10"
          }`}
        />

        {/* Neural Nodes */}
        {nodes.map((n, idx) => {
          const p = getPos(n);
          return (
            <circle
              key={idx}
              cx={p.x} cy={p.y} r={isClassifying.value ? "3.5" : "2.5"}
              fill="currentColor"
              class={`transition-colors duration-500 ${
                classificationResult.value 
                  ? "text-green-400" 
                  : isClassifying.value ? "text-white" : "text-indigo-400"
              }`}
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