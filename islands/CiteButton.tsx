import { useState } from "preact/hooks";

interface CiteButtonProps {
  citation: string;
}

export default function CiteButton({ citation }: CiteButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!citation) return;
    
    try {
      await navigator.clipboard.writeText(citation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy citation:", err);
    }
  };

  return (
    <div class="relative inline-block">
      <button
        onClick={handleCopy}
        class="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all flex items-center gap-2"
        aria-label="Copy citation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        {copied ? "Copied!" : "Cite"}
      </button>
      
      {copied && (
        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg shadow-xl animate-fade-in whitespace-nowrap">
          Citation copied to clipboard
          <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-indigo-600"></div>
        </div>
      )}
    </div>
  );
}
