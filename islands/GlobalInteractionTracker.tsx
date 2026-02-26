// islands/GlobalInteractionTracker.tsx
import { useEffect } from "preact/hooks";
import { mousePos } from "../utils/signals.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function GlobalInteractionTracker() {
  useEffect(() => {
    if (!IS_BROWSER) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.value = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return null; // This island only tracks global interaction
}
