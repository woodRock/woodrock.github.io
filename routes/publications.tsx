// routes/publications.tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import PaperCard from "../components/PaperCard.tsx";
import { Publication, publicationsApi } from "./api/supabase.ts";

// Server-side handler to fetch publications from Supabase
export const handler: Handlers<Publication[]> = {
  async GET(req, ctx) {
    try {
      const publications = await publicationsApi.getAll();
      return ctx.render(publications);
    } catch (error) {
      console.error("Error loading publications:", error);
      return ctx.render([]);
    }
  },
};

export default function Publications({ data: papers }: PageProps<Publication[]>) {
  return (
    <div class="min-h-screen bg-zinc-950 py-20 px-6 sm:px-8 lg:px-12">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-24">
          <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">Publications</h1>
          <div class="h-1.5 w-24 bg-indigo-500 mx-auto rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
          <p class="mt-8 text-xl text-slate-400 font-light max-w-2xl mx-auto">
            Scientific contributions to marine biology, machine learning, and environmental data science.
          </p>
        </div>
        
        <div class="grid grid-cols-1 gap-12">
          {papers.length > 0 ? (
            papers.map((paper) => (
              <PaperCard
                key={paper.id}
                title={paper.title}
                abstract={paper.abstract}
                filename={paper.filename}
                link={paper.link}
                linkLabel={paper.link_label}
                backgroundColor={paper.background_color}
                year={paper.year}
                journal={paper.journal}
              />
            ))
          ) : (
            <div class="text-center p-20 bg-white/5 rounded-[2.5rem] border border-white/5">
              <p class="text-xl text-slate-500 font-medium">Loading research contributions...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}