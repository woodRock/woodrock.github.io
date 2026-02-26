// islands/PdfViewer.tsx
import { fullscreenPdf } from "../utils/signals.ts";

interface PdfViewerProps {
  filename: string;
  title: string;
}

export default function PdfViewer({ filename, title }: PdfViewerProps) {
  const pdfUrl = `/${filename}`;

  return (
    <div class="relative group w-full">
      {/* Inline Preview Container */}
      <div class="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-slate-100 dark:bg-zinc-900 shadow-inner group-hover:border-indigo-500/30 transition-all duration-500">
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          class="w-full h-full grayscale-[50%] group-hover:grayscale-0 transition-all duration-700 pointer-events-none"
          loading="lazy"
        >
        </iframe>

        {/* Interaction Overlay */}
        <div class="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-500 flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              fullscreenPdf.value = { filename, title };
            }}
            class="px-6 py-3 bg-white text-zinc-950 rounded-full font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl hover:scale-105 active:scale-95"
          >
            Open Full Reader
          </button>
        </div>
      </div>
    </div>
  );
}
