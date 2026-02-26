// islands/Bioluminescence.tsx
import { useEffect, useState, useRef } from "preact/hooks";
import { mousePos, depth } from "../utils/signals.ts";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
}

export default function Bioluminescence() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdCounter = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only spawn particles if we are deep (e.g. > 1000m)
    if (depth.value < 1000) {
      if (particles.length > 0) setParticles([]);
      return;
    }

    const dist = Math.hypot(mousePos.value.x - lastPos.current.x, mousePos.value.y - lastPos.current.y);
    if (dist > 5) {
      const newParticle: Particle = {
        id: particleIdCounter.current++,
        x: mousePos.value.x,
        y: mousePos.value.y,
        size: Math.random() * 4 + 2,
        alpha: 0.8,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
      };
      setParticles(prev => [...prev.slice(-40), newParticle]);
      lastPos.current = { x: mousePos.value.x, y: mousePos.value.y };
    }
  }, [mousePos.value, depth.value]);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            alpha: p.alpha - 0.02,
          }))
          .filter(p => p.alpha > 0)
      );
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  if (depth.value < 1000) return null;

  return (
    <div class="fixed inset-0 pointer-events-none z-[85] overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          class="absolute rounded-full bg-cyan-400/30 blur-[4px]"
          style={{
            left: p.x,
            top: p.y,
            width: `${p.size * 2}px`,
            height: `${p.size * 2}px`,
            opacity: p.alpha,
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 15px rgba(34, 211, 238, 0.5)'
          }}
        />
      ))}
    </div>
  );
}
