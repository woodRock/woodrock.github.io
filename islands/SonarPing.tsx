// islands/SonarPing.tsx
import { useEffect, useState, useRef } from "preact/hooks";
import { mousePos, lastSonarPing, depth } from "../utils/signals.ts";

interface Ping {
  id: number;
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

export default function SonarPing() {
  const [pings, setPings] = useState<Ping[]>([]);
  const pingIdCounter = useRef(0);

  useEffect(() => {
    // Only ping every 5 seconds OR if triggered
    const intervalId = setInterval(() => {
      // Periodic automatic ping from bottom center (submersible)
      const x = window.innerWidth / 2;
      const y = window.innerHeight;
      const id = pingIdCounter.current++;
      
      const newPing: Ping = { id, x, y, scale: 0, opacity: 0.6 };
      setPings(prev => [...prev, newPing]);
      lastSonarPing.value = { x, y, timestamp: Date.now() };
    }, 5000);

    // Also trigger ping on click
    const handleClick = (e: MouseEvent) => {
      const id = pingIdCounter.current++;
      const newPing: Ping = { id, x: e.clientX, y: e.clientY, scale: 0, opacity: 0.8 };
      setPings(prev => [...prev, newPing]);
      lastSonarPing.value = { x: e.clientX, y: e.clientY, timestamp: Date.now() };
    };

    window.addEventListener("click", handleClick);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    let frame: number;
    const animate = () => {
      setPings(prev => 
        prev
          .map(p => ({
            ...p,
            scale: p.scale + 0.015,
            opacity: p.opacity - 0.005,
          }))
          .filter(p => p.opacity > 0)
      );
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div class="fixed inset-0 pointer-events-none z-[110] overflow-hidden">
      {pings.map(p => (
        <div
          key={p.id}
          class="absolute rounded-full border border-indigo-500/30"
          style={{
            left: p.x,
            top: p.y,
            width: `${p.scale * 2000}px`,
            height: `${p.scale * 2000}px`,
            opacity: p.opacity,
            transform: 'translate(-50%, -50%)',
            boxShadow: 'inset 0 0 40px rgba(99, 102, 241, 0.1), 0 0 20px rgba(99, 102, 241, 0.1)'
          }}
        />
      ))}
    </div>
  );
}
