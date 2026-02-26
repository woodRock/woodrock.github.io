// islands/PdfViewer.tsx
import { useState, useEffect } from "preact/hooks";

interface PdfViewerProps {
  filename: string;
  title: string;
}

export default function PdfViewer({ filename, title }: PdfViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const pdfUrl = `/${filename}`;

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isFullscreen]);

  return (
    <div class="relative group w-full">
      {/* Inline Preview Container */}
      <div class="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-black/5 dark:border-white/10 bg-slate-100 dark:bg-zinc-900 shadow-inner group-hover:border-indigo-500/30 transition-all duration-500">
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          class="w-full h-full grayscale-[50%] group-hover:grayscale-0 transition-all duration-700 pointer-events-none"
          loading="lazy"
        ></iframe>
        
        {/* Interaction Overlay */}
        <div class="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all duration-500 flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(true)}
            class="px-6 py-3 bg-white text-zinc-950 rounded-full font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl hover:scale-105 active:scale-95"
          >
            Open Full Reader
          </button>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column'
          }}
          class="bg-zinc-950"
        >
          {/* Header Bar */}
          <div class="flex-shrink-0 flex justify-between items-center px-6 py-4 border-b border-white/10 bg-zinc-900 z-50">
            <div>
              <h2 class="text-white font-bold text-sm md:text-base tracking-tight">{title}</h2>
              <p class="text-indigo-400 text-[9px] font-black uppercase tracking-[0.2em]">Research Disclosure Mode</p>
            </div>
            
            <div class="flex items-center">
              <button 
                onClick={() => setIsFullscreen(false)}
                class="group flex items-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:scale-105 active:scale-95"
                aria-label="Close Reader"
              >
                <span class="text-[10px] font-black uppercase tracking-widest">Exit Reader</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Truly Fullscreen Iframe Container */}
          <div class="flex-grow w-full bg-zinc-900 relative">
            <iframe
              src={pdfUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              title={title}
            ></iframe>
          </div>
          
          {/* Minimal Footer */}
          <div class="px-6 py-3 bg-black border-t border-white/10 flex justify-between items-center">
            <p class="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">Scientific Integrity • Jesse Wood</p>
            <div class="flex gap-2">
               <span class="h-1 w-1 rounded-full bg-indigo-500"></span>
               <span class="h-1 w-1 rounded-full bg-purple-500"></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}