// islands/AtmosphericOverlay.tsx
import { useEffect, useState, useRef } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function AtmosphericOverlay() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [depthProgress, setDepthProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!IS_BROWSER) return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || ('ontouchstart' in window));
    };
    checkMobile();

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth >= 768) {
        setMousePos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setDepthProgress(window.scrollY / scrollHeight);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", checkMobile);
    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Spotlight becomes more intense and focused as we go deeper
  const spotlightOpacity = 0.1 + (depthProgress * 0.4);
  const spotlightSize = 400 - (depthProgress * 150);
  
  // Static noise only appears in the deepest zones (Hadal zone > 85% progress)
  const staticOpacity = Math.max(0, (depthProgress - 0.85) * 4);

  return (
    <div class="fixed inset-0 pointer-events-none z-[90] overflow-hidden" style={{ transform: 'translateZ(0)' }}>
      {/* Submersible Spotlight - Only on non-mobile */}
      {!isMobile && (
        <div 
          class="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle ${spotlightSize}px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, ${spotlightOpacity}), transparent 80%)`,
          }}
        />
      )}

      {/* Hadal Zone Static / Film Grain - Only on non-mobile */}
      {!isMobile && staticOpacity > 0 && (
        <div 
          class="absolute -inset-[50%] mix-blend-overlay opacity-20 animate-grain"
          style={{
            opacity: staticOpacity * 0.3,
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -10%); }
          20% { transform: translate(-15%, 5%); }
          30% { transform: translate(7%, -25%); }
          40% { transform: translate(-5%, 25%); }
          50% { transform: translate(-15%, 10%); }
          60% { transform: translate(15%, 0%); }
          70% { transform: translate(0%, 15%); }
          80% { transform: translate(3%, 35%); }
          90% { transform: translate(-10%, 10%); }
        }
        .animate-grain {
          animation: grain 8s steps(10) infinite;
        }
      `}} />
    </div>
  );
}
