// components/PaperCard.tsx
import PaperCardContent from "../islands/PaperCardContent.tsx";
import { JSX } from "preact";

interface PaperCardProps {
  title: string;
  abstract: string;
  filename: string;
  link: string;
  linkLabel: string;
  backgroundColor: string;
  year: number;
  journal: string;
}

export default function PaperCard({
  title,
  abstract,
  filename,
  link,
  linkLabel,
  backgroundColor,
  year,
  journal
}: PaperCardProps) {
  return (
    <div 
      class="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-900/40 backdrop-blur-sm transition-all duration-500 hover:border-indigo-500/30 hover:-translate-y-1 shadow-2xl"
    >
      <div class="p-8 md:p-10 relative z-10">
        <div class="flex justify-between items-start mb-8">
          <div class="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 4v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span class="text-xs font-black uppercase tracking-widest text-slate-300">{journal}</span>
          </div>
          <span class="text-2xl font-black text-white/10 group-hover:text-white/20 transition-colors tabular-nums">{year}</span>
        </div>
        
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight group-hover:text-indigo-400 transition-colors">
          {title}
        </h2>
        
        <PaperCardContent abstract={abstract} />
        
        <div class="mt-10 flex flex-wrap gap-4">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            class="px-6 py-3 rounded-full text-sm font-bold bg-white text-zinc-950 hover:bg-indigo-50 transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {linkLabel}
          </a>

          <a
            href={`/${filename}`}
            target="_blank"
            rel="noopener noreferrer"
            class="px-6 py-3 rounded-full text-sm font-bold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Download PDF
          </a>

          <a
            href={`/doc-chat/${filename}`}
            class="px-6 py-3 rounded-full text-sm font-bold bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-600/30 transition-all flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat with AI
          </a>
        </div>
      </div>
    </div>
  );
}