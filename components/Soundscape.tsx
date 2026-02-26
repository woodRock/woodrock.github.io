// islands/Soundscape.tsx
import { useEffect, useRef } from "preact/hooks";
import { isSoundEnabled } from "../utils/signals.ts";

export default function Soundscape() {
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);
  const sonarAudioRef = useRef<HTMLAudioElement | null>(null);
  const enabled = isSoundEnabled.value;

  useEffect(() => {
    // Initialize audio elements
    bgAudioRef.current = new Audio("/underwater.mp3");
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = 0.3;

    clickAudioRef.current = new Audio("/splash.mp3");
    clickAudioRef.current.volume = 0.4;

    sonarAudioRef.current = new Audio("/sonar.mp3");
    sonarAudioRef.current.volume = 0.5;

    // Global click listener for sounds
    const handleGlobalClick = (e: MouseEvent) => {
      if (!isSoundEnabled.value) return;
      
      const target = e.target as HTMLElement;
      const clickable = target.closest("button, a") as HTMLElement;
      
      if (clickable) {
        // Special case for sonar sound
        if (clickable.getAttribute("data-sound") === "sonar" || clickable.classList.contains("sonar-ping")) {
          if (sonarAudioRef.current) {
            sonarAudioRef.current.currentTime = 0;
            sonarAudioRef.current.play().catch(() => {});
          }
        } else {
          // Default splash sound
          if (clickAudioRef.current) {
            clickAudioRef.current.currentTime = 0;
            clickAudioRef.current.play().catch(() => {});
          }
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);

    return () => {
      document.removeEventListener("click", handleGlobalClick);
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current = null;
      }
    };
  }, []);

  // React to signal changes
  useEffect(() => {
    if (!bgAudioRef.current) return;

    if (enabled) {
      bgAudioRef.current.play().catch((err) => {
        console.warn("Audio playback failed:", err);
        isSoundEnabled.value = false;
      });
    } else {
      bgAudioRef.current.pause();
    }
  }, [enabled]);

  const toggleSound = () => {
    const newState = !isSoundEnabled.value;
    isSoundEnabled.value = newState;
    
    // Immediate feedback for enabling sound
    if (newState && clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {});
    }
  };

  return (
    <button
      onClick={toggleSound}
      class={`p-2 rounded-full border transition-all duration-500 ${
        enabled 
          ? "bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400" 
          : "bg-white/5 border-white/10 text-slate-500"
      }`}
      aria-label="Toggle Soundscape"
    >
      <div class="relative w-5 h-5 flex items-center justify-center">
        {enabled ? (
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        )}
      </div>
    </button>
  );
}
