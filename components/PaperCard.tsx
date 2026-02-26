// components/PaperCard.tsx
import PaperCardContent from "../islands/PaperCardContent.tsx";
import PdfViewer from "../islands/PdfViewer.tsx";
import CiteButton from "../islands/CiteButton.tsx";

interface PaperCardProps {
  title: string;
  abstract: string;
  filename: string;
  link: string;
  linkLabel: string;
  backgroundColor: string;
  year: number;
  journal: string;
  citation?: string;
}

export default function PaperCard({
  title,
  abstract,
  filename,
  link,
  linkLabel,
  year,
  journal,
  citation
}: PaperCardProps) {
  return (
    <div class="group grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white/80 dark:bg-zinc-900/80 border border-black/10 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 transition-colors duration-500 hover:border-indigo-500/20">
      {/* Left: Text Content */}
      <div class="lg:col-span-7 flex flex-col justify-center">
        <div class="flex items-center gap-4 mb-8">
          <span class="text-2xl font-black text-indigo-600 dark:text-indigo-400 opacity-20 tabular-nums tracking-tighter">{year}</span>
          <div class="h-px w-8 bg-black/10 dark:bg-white/10"></div>
          <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">{journal}</span>
        </div>
        
        <h2 class="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-8 leading-tight tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {title}
        </h2>
        
        <PaperCardContent abstract={abstract} />
        
        <div class="mt-10 flex flex-wrap items-center gap-4">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            class="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
          >
            {linkLabel}
          </a>

          {citation && <CiteButton citation={citation} />}
        </div>
      </div>

      {/* Right: Interactive PDF Preview */}
      <div class="lg:col-span-5 flex items-center">
        <PdfViewer filename={filename} title={title} />
      </div>
    </div>
  );
}