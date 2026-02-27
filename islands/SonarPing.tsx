// islands/SonarPing.tsx
import { useEffect, useRef, useState } from "preact/hooks";
import { lastSonarPing } from "../utils/signals.ts";

interface Ping {
  id: number;
  x: number;
  y: number;
  type: "auto" | "click";
}

export default function SonarPing() {
  const [pings, setPings] = useState<Ping[]>([]);
  const pingIdCounter = useRef(0);

  useEffect(() => {
    // Only ping every 5 seconds OR if triggered
    const intervalId = setInterval(() => {
      // Don't add automatic pings if the tab is in the background
      if (document.visibilityState !== "visible") return;

      const x = window.innerWidth / 2;
      const y = window.innerHeight;
      const id = pingIdCounter.current++;

      const newPing: Ping = { id, x, y, type: "auto" };
      setPings((prev) => [...prev.slice(-9), newPing]); // Keep only last 10
      lastSonarPing.value = { x, y, timestamp: Date.now() };

      // Clean up the ping after animation (4 seconds)
      setTimeout(() => {
        setPings((prev) => prev.filter((p) => p.id !== id));
      }, 4000);
    }, 5000);

    const handleClick = (e: MouseEvent) => {
      const id = pingIdCounter.current++;
      const x = e.clientX;
      const y = e.clientY;

      const newPing: Ping = { id, x, y, type: "click" };
      setPings((prev) => [...prev.slice(-9), newPing]);
      lastSonarPing.value = { x, y, timestamp: Date.now() };

      setTimeout(() => {
        setPings((prev) => prev.filter((p) => p.id !== id));
      }, 4000);
    };

    window.addEventListener("click", handleClick);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div class="fixed inset-0 pointer-events-none z-[110] overflow-hidden">
      {pings.map((p) => (
        <div
          key={p.id}
          class={`absolute rounded-full border border-indigo-500/30 animate-sonar-ping`}
          style={{
            left: p.x,
            top: p.y,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes sonar-fade-grow {
          0% { width: 0; height: 0; opacity: 0.8; }
          100% { width: 2000px; height: 2000px; opacity: 0; }
        }
        .animate-sonar-ping {
          animation: sonar-fade-grow 4s cubic-bezier(0.1, 0, 0.3, 1) forwards;
          box-shadow: inset 0 0 40px rgba(99, 102, 241, 0.1), 0 0 20px rgba(99, 102, 241, 0.1);
        }
      `,
        }}
      />
    </div>
  );
}
