// routes/search.tsx
import { PageProps } from "$fresh/server.ts";

// Define your SearchData interface if needed
interface SearchData {
  // Add properties as needed
}

export default function SearchPage({ data }: PageProps<SearchData>) {
  return (
    <div class="min-h-screen bg-slate-50 dark:bg-zinc-950 pt-24 px-6 sm:px-8 transition-colors duration-300">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-12">
          <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Search</h1>
          <p class="text-slate-500 dark:text-slate-400 font-light">Find publications, projects, and research data.</p>
        </div>
        <div class="h-96 flex items-center justify-center border border-black/5 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] rounded-[2.5rem] shadow-xl dark:shadow-2xl">
           <p class="text-slate-400 dark:text-slate-600 uppercase tracking-widest text-xs font-black">Search results will appear here</p>
        </div>
      </div>
    </div>
  );
}