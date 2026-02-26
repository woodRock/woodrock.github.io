import { useEffect, useState } from "preact/hooks";
import { activeSection } from "../utils/signals.ts";

export default function ScrollController() {
  const [showAscent, setShowAscent] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const shouldShow = scrollY > 1000;
      if (showAscent !== shouldShow) {
        setShowAscent(shouldShow);
      }

      // Section detection
      const sections = ["hero", "publications", "projects", "contact"];
      const viewportMid = 300; // Look for section at 300px from top
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportMid && rect.bottom >= viewportMid) {
            if (activeSection.value !== section) {
              activeSection.value = section;
            }
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("hashchange", handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleScroll);
    };
  }, [showAscent]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div 
      class={`fixed bottom-28 left-8 z-[70] transition-opacity duration-500 ${
        showAscent ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        class="p-4 rounded-full bg-zinc-900 border border-white/20 text-indigo-500 shadow-2xl hover:scale-110 active:scale-95 transition-all group animate-fade-in"
        aria-label="Emergency Ascent"
      >
        <div class="flex flex-col items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span class="text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Surface</span>
        </div>
      </button>
    </div>
  );
}
