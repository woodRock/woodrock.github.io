// components/ProjectCard.tsx
import TechBadge from "./TechBadge.tsx";

interface ProjectCardProps {
  title: string;
  language: string;
  githubLink: string;
  description: string;
  backgroundColor?: string;
}

export default function ProjectCard({
  title,
  language,
  githubLink,
  description,
  backgroundColor = "#6366f1"
}: ProjectCardProps) {
  const techList = language.split(",").filter(t => t.trim().length > 0);

  return (
    <div class="flex-shrink-0 w-[320px] md:w-[400px] group relative bg-white/50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-500 shadow-xl dark:shadow-2xl flex flex-col">
      {/* Decorative accent background */}
      <div 
        class="absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-40 transition-opacity"
        style={{ backgroundColor }}
      ></div>
      
      <div class="p-8 md:p-10 flex flex-col h-full relative z-10">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight bioluminescent-text delay-5 mb-4">{title}</h2>
          <div class="flex flex-wrap gap-2">
            {techList.map((tech) => (
              <TechBadge name={tech} />
            ))}
          </div>
        </div>
        
        <p class="mb-8 text-slate-200 dark:text-slate-400 font-light leading-relaxed flex-grow line-clamp-4">
          {description}
        </p>
        
        <div class="mt-auto">
          <a href={githubLink} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-white font-bold text-[10px] uppercase tracking-widest hover:text-indigo-400 transition-colors group/link">
            <svg class="w-4 h-4 opacity-70 group-hover/link:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
            Review Architecture
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}