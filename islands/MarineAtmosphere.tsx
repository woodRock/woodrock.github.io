// islands/MarineAtmosphere.tsx
import { useEffect, useState, useRef } from "preact/hooks";
import { mousePos } from "../utils/signals.ts";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

interface SnowParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
}

export default function MarineAtmosphere() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [snow, setSnow] = useState<SnowParticle[]>([]);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Initialize Marine Snow (slower, drifting particles)
    const initialSnow: SnowParticle[] = [];
    for (let i = 0; i < 40; i++) {
      initialSnow.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.05,
        vy: Math.random() * 0.05 + 0.02
      });
    }
    setSnow(initialSnow);

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      const diff = Math.abs(currentScroll - lastScrollY.current);
      
      if (diff > 50) {
        // Create a bubble when scrolling fast
        const newBubble: Bubble = {
          id: Date.now(),
          x: Math.random() * 100,
          y: 100,
          size: Math.random() * 10 + 5,
          speed: Math.random() * 2 + 2
        };
        
        setBubbles(prev => [...prev.slice(-15), newBubble]);
        lastScrollY.current = currentScroll;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Animate Snow using requestAnimationFrame for better performance
    let frame: number;
    const animate = () => {
      const mx = mousePos.value.x;
      const my = mousePos.value.y;

      setSnow(prev => prev.map(p => {
        // Calculate displacement from mouse
        const px = (p.x / 100) * window.innerWidth;
        const py = (p.y / 100) * window.innerHeight;
        const dx = px - mx;
        const dy = py - my;
        const dist = Math.hypot(dx, dy);
        
        let shiftX = 0;
        let shiftY = 0;
        
        if (dist < 200) {
          const force = (200 - dist) / 200;
          shiftX = (dx / dist) * force * 1.5;
          shiftY = (dy / dist) * force * 1.5;
        }

        return {
          ...p,
          x: (p.x + p.vx + (shiftX / window.innerWidth * 100) + 100) % 100,
          y: (p.y + p.vy + (shiftY / window.innerHeight * 100) + 100) % 100
        };
      }));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div class="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Marine Snow */}
      {snow.map(p => (
        <div
          key={p.id}
          class="absolute bg-white/20 dark:bg-white/10 rounded-full blur-[1px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
        />
      ))}

      {/* Rising Bubbles */}
      {bubbles.map(b => (
        <div
          key={b.id}
          class="absolute border border-white/30 rounded-full bg-white/5 animate-bubble-up"
          style={{
            left: `${b.x}%`,
            bottom: `-20px`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            animationDuration: `${b.speed}s`
          }}
        >
          <div class="absolute top-1 left-1 w-1/4 h-1/4 bg-white/40 rounded-full" />
        </div>
      ))}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bubble-up {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.6; }
          100% { transform: translateY(-100vh) scale(1.5); opacity: 0; }
        }
        .animate-bubble-up {
          animation: bubble-up linear forwards;
        }
      `}} />
    </div>
  );
}
