// islands/GlobalPdfReader.tsx
import { useEffect } from "preact/hooks";
import { fullscreenPdf } from "../utils/signals.ts";

export default function GlobalPdfReader() {
  const pdf = fullscreenPdf.value;

  useEffect(() => {
    if (pdf) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [pdf]);

  if (!pdf) return null;

  const pdfUrl = `/${pdf.filename}`;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
      }}
      class="bg-zinc-950 animate-fade-in"
    >
      {/* Header Bar */}
      <div
        class="flex-shrink-0 flex justify-between items-center px-6 py-4 border-b border-white/10 bg-zinc-900"
        style={{ zIndex: 100000 }}
      >
        <div class="flex items-center gap-6">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => {
              fullscreenPdf.value = null;
            }}
            class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            aria-label="Go Back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span class="text-xs font-black uppercase tracking-widest">
              Back
            </span>
          </button>

          <div class="h-8 w-px bg-white/10"></div>

          <div>
            <h2 class="text-white font-bold text-sm md:text-base tracking-tight">
              {pdf.title}
            </h2>
            <p class="text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em]">
              Research Disclosure Mode
            </p>
          </div>
        </div>

        <div class="flex items-center">
          <button
            type="button"
            onClick={() => {
              fullscreenPdf.value = null;
            }}
            class="group flex items-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-105 active:scale-95"
            aria-label="Close Reader"
          >
            <span class="text-[10px] font-black uppercase tracking-widest text-white">
              Exit Reader
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Truly Fullscreen Iframe Container */}
      <div class="flex-grow w-full bg-zinc-900 relative">
        <iframe
          src={pdfUrl}
          style={{ width: "100%", height: "100%", border: "none" }}
          title={pdf.title}
        >
        </iframe>
      </div>

      {/* Minimal Footer */}
      <div class="px-6 py-3 bg-black border-t border-white/10 flex justify-between items-center">
        <p class="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">
          Scientific Integrity • Jesse Wood
        </p>
        <div class="flex gap-2">
          <span class="h-1 w-1 rounded-full bg-indigo-500"></span>
          <span class="h-1 w-1 rounded-full bg-purple-500"></span>
        </div>
      </div>
    </div>
  );
}
