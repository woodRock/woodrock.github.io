// routes/index.tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import { Button } from "../components/Button.tsx";
import Countdown from "../components/Countdown.tsx";
import { projectsApi, publicationsApi, Project, Publication } from "./api/supabase.ts";

// Define the data structure for the page
interface HomePageData {
  showcaseProjects: Project[];
  featuredPublication: Publication | null;
}

// Server-side handler to fetch data
export const handler: Handlers<HomePageData> = {
  async GET(req, ctx) {
    try {
      // Fetch all projects and randomly select 2
      const allProjects = await projectsApi.getAll();
      const randomProjects = getRandomItems(allProjects, 2);
      
      // Fetch all publications and randomly select 1
      const allPublications = await publicationsApi.getAll();
      const randomPublication = allPublications.length > 0 
        ? getRandomItems(allPublications, 1)[0] 
        : null;
      
      return ctx.render({
        showcaseProjects: randomProjects,
        featuredPublication: randomPublication
      });
    } catch (error) {
      console.error("Error fetching data for homepage:", error);
      // Return empty data on error
      return ctx.render({
        showcaseProjects: [],
        featuredPublication: null
      });
    }
  },
};

// Helper function to get random items from an array
function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function Home({ data }: PageProps<HomePageData>) {
  const { showcaseProjects, featuredPublication } = data;
  
  return (
    <div class="bg-zinc-950">
      {/* Hero Content Section */}
      <section class="py-20 md:py-32 px-6">
        <div class="max-w-6xl mx-auto text-center">
          <h1 class="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter">
            <span class="inline-block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Building the Future
            </span>
            <br />
            <span class="inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x">
              with Data & AI
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            Combining machine learning, scientific research, and software engineering 
            to solve complex problems in marine biology and beyond.
          </p>
          <div class="flex flex-wrap justify-center gap-6">
            <a href="/projects" class="group relative px-8 py-4 bg-white text-zinc-950 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Explore Projects
            </a>
            <a href="/publications" class="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
              View Publications
            </a>
          </div>
        </div>
      </section>

      {/* Research Focus Cards - Glassmorphism */}
      <section class="py-24 px-6 border-y border-white/5 bg-white/[0.02]">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-center mb-20 tracking-tight text-white">Research Focus</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Focus Card Component */}
            {[
              {
                title: "AI for Marine Science",
                desc: "Developing machine learning approaches to analyze fatty acid chromatographic data and mass spectrometry for marine biomass classification.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                )
              },
              {
                title: "Data-Driven Engineering",
                desc: "Creating innovative software solutions that bridge the gap between scientific research and practical applications in industry.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                )
              },
              {
                title: "Sustainable Tech",
                desc: "Leveraging technology to support environmental sustainability and develop solutions for real-world ecological challenges.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                )
              }
            ].map((focus) => (
              <div class="group relative p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div class="relative h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-white/10 transition-colors">
                  {focus.icon}
                </div>
                <h3 class="text-xl font-bold mb-4 text-white">{focus.title}</h3>
                <p class="text-slate-400 leading-relaxed">
                  {focus.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Publication - Modern Layout */}
      <section class="py-32 px-6">
        <div class="max-w-6xl mx-auto">
          <div class="flex items-center gap-4 mb-16">
            <h2 class="text-3xl md:text-4xl font-bold text-white tracking-tight">Latest Research</h2>
            <div class="h-px flex-grow bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>
          
          {featuredPublication ? (
            <div class="group relative bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-white/10 transition-all duration-500">
              <div class="grid grid-cols-1 lg:grid-cols-12">
                <div class="lg:col-span-4 bg-indigo-600/10 p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/5">
                  <span class="text-indigo-400 font-bold uppercase tracking-widest text-xs mb-4">Featured Paper</span>
                  <h3 class="text-2xl font-bold text-white mb-6">
                    {featuredPublication.title.split(":")[0]}
                  </h3>
                  <a href="/publications" class="inline-flex items-center text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group">
                    Explore all publications
                    <svg xmlns="http://www.w3.org/2000/svg" class="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
                
                <div class="lg:col-span-8 p-12">
                  <h4 class="text-xl font-semibold text-white mb-6 leading-snug">
                    {featuredPublication.title}
                  </h4>
                  <p class="text-slate-400 mb-10 line-clamp-4 text-lg leading-relaxed font-light">
                    {featuredPublication.abstract}
                  </p>
                  <div class="flex flex-wrap gap-4">
                    <a 
                      href={`/download?filename=${featuredPublication.filename}`}
                      class="px-6 py-3 bg-white/10 hover:bg-white/15 rounded-full text-sm font-bold text-white transition-all flex items-center gap-2 border border-white/5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Read PDF
                    </a>
                    <a 
                      href={featuredPublication.link}
                      target="_blank" 
                      class="px-6 py-3 bg-white/10 hover:bg-white/15 rounded-full text-sm font-bold text-white transition-all flex items-center gap-2 border border-white/5"
                    >
                      Source Link
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div class="bg-white/5 rounded-3xl p-12 text-center border border-white/5">
              <p class="text-slate-500">No publications found. Check back later!</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects - Modern Grid */}
      <section class="py-32 px-6 border-t border-white/5">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-center mb-4 text-white">Featured Projects</h2>
          <p class="text-lg text-slate-400 text-center max-w-2xl mx-auto mb-20 font-light">
            Crafting software solutions at the intersection of data and design.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
            {showcaseProjects.length > 0 ? (
              showcaseProjects.map((project) => (
                <div key={project.id} class="group relative bg-zinc-900/50 border border-white/5 rounded-[2rem] overflow-hidden hover:border-indigo-500/30 transition-all duration-500">
                  <div class="relative h-64 overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent z-10 opacity-60"></div>
                    <div class="h-full bg-indigo-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-700" style={project.background_color ? `background: ${project.background_color}44` : ''}>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-indigo-400/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                  </div>
                  <div class="p-10 relative -mt-20 z-20">
                    <div class="bg-zinc-900/90 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl">
                      <div class="flex justify-between items-start mb-6">
                        <h3 class="text-2xl font-bold text-white">{project.title}</h3>
                        <span class="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {project.language.split(',')[0]}
                        </span>
                      </div>
                      <p class="text-slate-400 mb-8 font-light line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>
                      <a 
                        href={project.github_link}
                        target="_blank"
                        class="inline-flex items-center text-white font-bold text-sm hover:text-indigo-400 transition-colors"
                      >
                        <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                        </svg>
                        Source Code
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div class="col-span-2 text-center p-20 bg-white/5 rounded-[2.5rem] border border-white/5">
                <p class="text-xl text-slate-500">Loading showcase...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA - Modern Glow */}
      <section class="py-40 px-6 relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
        <div class="max-w-4xl mx-auto text-center relative z-10">
          <h2 class="text-4xl md:text-6xl font-black mb-8 text-white tracking-tighter">Ready to collaborate?</h2>
          <p class="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            I'm currently open to discussing research opportunities, project ideas, or potential collaborations.
          </p>
          <a href="/contact" class="inline-block px-12 py-5 bg-white text-zinc-950 rounded-full font-black text-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-105 active:scale-95">
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}