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
    <div class="p-4">
      <h1 class="text-4xl font-bold text-center my-8">My Projects</h1>

      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div class="col-span-2 text-center p-8 bg-gray-100 rounded-lg">
            <p class="text-xl text-gray-500">Loading projects...</p>
          </div>
        )}
      </div>
    </div>
  );
}