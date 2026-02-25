// routes/projects.tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import ProjectCard from "../components/ProjectCard.tsx";
import { Project, projectsApi } from "./api/supabase.ts"

// Server-side handler to fetch projects from Supabase
export const handler: Handlers<Project[]> = {
  async GET(req, ctx) {
    try {
      const projects = await projectsApi.getAll();
      return ctx.render(projects);
    } catch (error) {
      console.error("Error loading projects:", error);
      return ctx.render([]);
    }
  },
};

export default function Projects({ data: projects }: PageProps<Project[]>) {
  return (
    <div class="min-h-screen bg-zinc-950 py-20 px-6 sm:px-8 lg:px-12">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-24">
          <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">Technical Projects</h1>
          <div class="h-1.5 w-24 bg-indigo-500 mx-auto rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
          <p class="mt-8 text-xl text-slate-400 font-light max-w-2xl mx-auto">
            A collection of software engineering and data science projects across various domains.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                language={project.language}
                githubLink={project.github_link}
                description={project.description}
                backgroundColor={project.background_color}
              />
            ))
          ) : (
            <div class="col-span-full text-center p-20 bg-white/5 rounded-[2.5rem] border border-white/5">
              <p class="text-xl text-slate-500 font-medium">Loading project showcase...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}