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
    <div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-5xl mx-auto">
        <h1 class="text-5xl font-bold text-center mb-12 text-gray-800">Publications</h1>
        
        <div class="space-y-10">
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
            <div class="text-center p-8 bg-gray-100 rounded-lg">
              <p class="text-xl text-gray-500">Loading publications...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}