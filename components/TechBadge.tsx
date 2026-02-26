// components/TechBadge.tsx
import { JSX } from "preact";

interface TechBadgeProps {
  name: string;
}

// Mapping of tech names to Simple Icons slugs
// Add more mappings as needed based on your project languages/tools
const ICON_MAP: Record<string, string> = {
  "typescript": "typescript",
  "javascript": "javascript",
  "python": "python",
  "deno": "deno",
  "rust": "rust",
  "pytorch": "pytorch",
  "tensorflow": "tensorflow",
  "react": "react",
  "preact": "preact",
  "supabase": "supabase",
  "postgresql": "postgresql",
  "sql": "postgresql",
  "tailwind": "tailwindcss",
  "tailwindcss": "tailwindcss",
  "css": "css3",
  "html": "html5",
  "docker": "docker",
  "github": "github",
  "git": "git",
  "d3": "d3dotjs",
  "d3.js": "d3dotjs",
  "three.js": "threedotjs",
  "onnx": "onnx",
  "next.js": "nextdotjs",
  "node.js": "nodedotjs",
  "transformers": "huggingface",
  "huggingface": "huggingface",
  "bash": "gnubash",
  "shell": "gnubash",
  "linux": "linux",
  "c++": "cplusplus",
  "mass spectrometry": "googlecharts", 
};

export default function TechBadge({ name }: TechBadgeProps) {
  const normalizedName = name.trim().toLowerCase();
  const iconSlug = ICON_MAP[normalizedName] || null;
  
  // Base colors for the badge
  const badgeClass = "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/10 text-slate-600 dark:text-slate-300 transition-all hover:border-indigo-500/30 group/badge";

  return (
    <div class={badgeClass}>
      {iconSlug && (
        <img 
          src={`https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/${iconSlug}.svg`}
          alt=""
          class="w-3 h-3 opacity-70 group-hover/badge:opacity-100 transition-opacity dark:invert"
          loading="lazy"
        />
      )}
      <span>{name.trim()}</span>
    </div>
  );
}
