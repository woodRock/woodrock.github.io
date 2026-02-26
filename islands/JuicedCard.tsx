// islands/JuicedCard.tsx
import { useState, useRef, useEffect } from "preact/hooks";
import { lastSonarPing } from "../utils/signals.ts";

export default function JuicedCard({ children, className = "" }: { children: any; className?: string }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [pingPulse, setPingPulse] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = x / rect.width;
    const yPercent = y / rect.height;
    
    // Rotation amplitude (deg)
    const rotateY = (xPercent - 0.5) * 10;
    const rotateX = (0.5 - yPercent) * 10;
    
    setRotation({ x: rotateX, y: rotateY });
    setGlarePos({ x: xPercent * 100, y: yPercent * 100 });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (!lastSonarPing.value || !cardRef.current) return;
    
    // Simple check if card is somewhat near the ping center or just trigger it for fun
    const rect = cardRef.current.getBoundingClientRect();
    const cardX = rect.left + rect.width / 2;
    const cardY = rect.top + rect.height / 2;
    const dist = Math.hypot(cardX - lastSonarPing.value.x, cardY - lastSonarPing.value.y);
    
    // If within reasonable range, trigger pulse
    if (dist < 1000) {
      setPingPulse(true);
      setTimeout(() => setPingPulse(false), 1000);
    }
  }, [lastSonarPing.value]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      class={`perspective-1000 transition-all duration-300 h-full ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transformStyle: "preserve-3d"
      }}
    >
      <div 
        class={`relative h-full w-full rounded-3xl overflow-hidden ${
          pingPulse ? "ring-2 ring-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.4)]" : "ring-1 ring-white/10"
        } transition-all duration-500`}
      >
        {/* Caustic / Glare overlay */}
        <div 
          class="absolute inset-0 pointer-events-none z-10 opacity-0 group-hover:opacity-40 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.15), transparent 60%), 
                         linear-gradient(135deg, transparent 40%, rgba(99, 102, 241, 0.1) 50%, transparent 60%)`
          }}
        />
        
        {/* Content */}
        {children}
      </div>
    </div>
  );
}
