// routes/index.tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import { projectsApi, publicationsApi, Project, Publication } from "./api/supabase.ts";
import ResearchNetwork from "../islands/ResearchNetwork.tsx";
import MarinePulse from "../islands/MarinePulse.tsx";
import SpectraTrace from "../islands/SpectraTrace.tsx";
import SkillsCompass from "../islands/SkillsCompass.tsx";
import PaperCard from "../components/PaperCard.tsx";
import ProjectCard from "../components/ProjectCard.tsx";
import { TeamMember } from "../components/TeamMember.tsx";
import NeuralFish from "../islands/NeuralFish.tsx";
import FishTank from "../islands/FishTank.tsx";
import WaveDivider from "../components/WaveDivider.tsx";
import DepthGauge from "../islands/DepthGauge.tsx";
import ScrollController from "../islands/ScrollController.tsx";

interface HomePageData {
  projects: Project[];
  publications: Publication[];
  featuredPublication: Publication | null;
}

const teamMembers = [
  {
    id: 1,
    name: "Jesse Wood",
    title: "Lead Researcher",
    bio: "Specializing in the intersection of deep learning and marine biochemistry.",
    email: "jrhwood98@gmail.com",
    linkedin: "https://www.linkedin.com/in/jrhwood",
    imageSrc: "https://pbs.twimg.com/profile_images/1904799151331958786/KxV1kqJ7_400x400.jpg"
  }
];

export const handler: Handlers<HomePageData> = {
  async GET(req, ctx) {
    try {
      const projects = await projectsApi.getAll();
      const publications = await publicationsApi.getAll();
      const featuredPublication = publications.length > 0 ? publications[0] : null;
      
      return ctx.render({ projects, publications, featuredPublication });
    } catch (error) {
      console.error("Error fetching data:", error);
      return ctx.render({ projects: [], publications: [], featuredPublication: null });
    }
  }
};

export default function Home({ data }: PageProps<HomePageData>) {
  const { projects, publications } = data;
  
  return (
    <div class="relative dive-gradient transition-colors duration-1000">
      <FishTank />
      <DepthGauge />
      <ScrollController />
      
      {/* 1. Hero Section - The Surface */}
      <section id="hero" class="relative pt-32 pb-24 px-6 min-h-screen flex flex-col justify-center border-b border-black/5 dark:border-white/5">
        <div class="max-w-6xl mx-auto text-center relative z-10">
          <div class="flex flex-col items-center mb-12">
            <div class="flex justify-center mb-8 animate-float">
              <div class="p-12 md:p-16 rounded-[5rem] bg-white/20 dark:bg-white/5 backdrop-blur-3xl border border-white/30 dark:border-white/10 shadow-[0_0_120px_rgba(99,102,241,0.15)]">
                <div class="w-64 h-32 md:w-[32rem] md:h-[16rem]">
                  <NeuralFish />
                </div>
              </div>
            </div>
            
            <div class="flex flex-wrap justify-center gap-3 mb-8">
              <img src="https://img.shields.io/badge/PhD-AI%20Candidate-blue?style=for-the-badge&logo=google-scholar" alt="PhD AI Candidate" class="h-6" />
              <img src="https://img.shields.io/badge/Location-Wellington,%20NZ-orange?style=for-the-badge&logo=google-maps" alt="Wellington, NZ" class="h-6" />
              <img src="https://img.shields.io/github/followers/woodRock?label=Followers&style=for-the-badge&color=238636&logo=github" alt="GitHub Followers" class="h-6" />
            </div>
          </div>
          
          <h1 class="text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter text-indigo-600 dark:text-indigo-400">
            Fin-tuned Deep Learning
          </h1>
          <h2 class="text-xl md:text-2xl font-bold text-slate-700 dark:text-slate-200 mb-8 tracking-tight">
            Jesse Wood @ Victoria University of Wellington
          </h2>
          <p class="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-16 font-light leading-relaxed">
            Transitioning from <span class="font-bold text-indigo-500">NIWA</span> software engineering to a PhD in AI, 
            using code as a scientific medium to unlock biochemical secrets through transformer architectures.
          </p>
          
          <div class="max-w-5xl mx-auto pt-8">
            <SpectraTrace />
          </div>
        </div>
      </section>

      {/* 2. Telemetry Section - Research Breakthroughs */}
      <section class="py-32 px-6 relative z-10">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center gap-4 mb-16">
            <div class="h-px flex-grow bg-black/10 dark:bg-white/10"></div>
            <h2 class="text-xs font-black uppercase tracking-[0.4em] text-slate-700 dark:text-slate-400">Featured Research: fishy-business</h2>
            <div class="h-px flex-grow bg-black/10 dark:bg-white/10"></div>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div class="lg:col-span-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                <div class="p-8 rounded-[2.5rem] bg-white/40 dark:bg-indigo-900/10 border border-indigo-500/20 backdrop-blur-md">
                  <div class="text-[10px] font-black text-indigo-500 uppercase mb-2">Gone Phishing</div>
                  <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-4">100% Accuracy</h3>
                  <p class="text-sm text-slate-600 dark:text-slate-400">Species Identification (Hoki vs. Mackerel) using MoE Transformer architectures.</p>
                </div>
                <div class="p-8 rounded-[2.5rem] bg-white/40 dark:bg-purple-900/10 border border-purple-500/20 backdrop-blur-md">
                  <div class="text-[10px] font-black text-purple-500 uppercase mb-2">Autobots Ensemble</div>
                  <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-4">74.13% Accuracy</h3>
                  <p class="text-sm text-slate-600 dark:text-slate-400">Body Part Classification, significantly outperforming traditional OPLS-DA (51.17%).</p>
                </div>
                <div class="md:col-span-2 p-8 rounded-[2.5rem] bg-white/40 dark:bg-emerald-900/10 border border-emerald-500/20 backdrop-blur-md">
                  <div class="flex justify-between items-start">
                    <div>
                      <div class="text-[10px] font-black text-emerald-500 uppercase mb-2">SpectroSim & XAI</div>
                      <h3 class="text-2xl font-black text-slate-900 dark:text-white mb-2">Batch Traceability</h3>
                      <p class="text-sm text-slate-600 dark:text-slate-400 max-w-xl">Self-supervised contrastive learning enabling physical tag-less tracking. Decisions mapped via LIME/SHAP to specific m/z chemical peaks.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="lg:col-span-4 flex flex-grow">
              <MarinePulse />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Expertise Section - Tech Stack */}
      <section id="expertise" class="py-32 px-6 relative z-10 border-y border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/[0.02]">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div class="order-2 lg:order-1 flex justify-center">
              <SkillsCompass />
            </div>
            <div class="order-1 lg:order-2">
              <h2 class="text-5xl md:text-7xl font-black text-slate-400 dark:text-white tracking-tighter mb-8 leading-none">The Scientific<br />Tech Stack.</h2>
              
              <div class="space-y-8">
                <div>
                  <h4 class="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-4">AI & Data Science</h4>
                  <div class="flex flex-wrap gap-2">
                    {['PyTorch', 'Transformers', 'Scikit-Learn', 'Pandas', 'NumPy', 'HuggingFace'].map(tech => (
                      <span class="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">{tech}</span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 class="text-[10px] font-black uppercase tracking-widest text-purple-500 mb-4">Optimization & Systems</h4>
                  <div class="flex flex-wrap gap-2">
                    {['Optuna', 'DEAP', 'Rust', 'C++', 'Haskell', 'Docker', 'Streamlit'].map(tech => (
                      <span class="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">{tech}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 class="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-4">Explainable AI (XAI)</h4>
                  <div class="flex flex-wrap gap-2">
                    {['LIME', 'SHAP', 'WandB'].map(tech => (
                      <span class="px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Publications Section */}
      <section id="publications" class="py-32 px-6 relative z-10">
        <div class="max-w-6xl mx-auto">
          <div class="mb-24 text-center">
            <h2 class="text-5xl md:text-7xl font-black text-slate-100 dark:text-white tracking-tighter mb-4 bioluminescent-text delay-1">Scientific Papers</h2>
            <div class="h-1.5 w-24 bg-indigo-500 mx-auto rounded-full mb-8"></div>
            <p class="text-xl text-slate-200 dark:text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
              Advancing self-supervised learning, Masked Spectra Modeling (MSM), and Evolutionary Computation.
            </p>
          </div>
          
          <div class="space-y-20">
            {publications.map((paper) => (
              <PaperCard
                key={paper.id}
                title={paper.title}
                abstract={paper.abstract}
                filename={paper.filename}
                link={paper.link}
                linkLabel={paper.link_label}
                backgroundColor={paper.background_color || "#6366f1"}
                year={paper.year}
                journal={paper.journal}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Projects Section */}
      <section id="projects" class="py-32 bg-black/10 dark:bg-white/[0.02] relative z-10 border-y border-black/10 dark:border-white/5 overflow-hidden">
        <div class="max-w-6xl mx-auto px-6 mb-16">
          <h2 class="text-5xl md:text-7xl font-black text-white tracking-tighter bioluminescent-text">Technical Projects</h2>
        </div>
        
        <div class="flex overflow-x-auto gap-8 px-6 md:px-[calc((100vw-1152px)/2+24px)] pb-12 no-scrollbar snap-x snap-mandatory">
          {projects.map((project, index) => (
            <div class="snap-center">
              <ProjectCard
                key={project.id}
                title={project.title}
                language={project.language}
                githubLink={project.github_link}
                description={project.description}
                backgroundColor={project.background_color}
              />
            </div>
          ))}
          <div class="flex-shrink-0 w-6 md:w-24"></div>
        </div>
      </section>

      {/* 6. Contact & Team - Hadal Zone */}
      <section id="contact" class="py-32 px-6 relative z-10">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 class="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 bioluminescent-text delay-2">Collaborate</h2>
              <p class="text-xl text-slate-300 font-light leading-relaxed mb-12 max-w-lg">
                Seeking a scientific partner or technical engineer? Let's establish a connection in the deep.
              </p>
              <div class="space-y-6">
                {[
                  { label: "Direct Email", val: "jrhwood98@gmail.com", href: "mailto:jrhwood98@gmail.com", delay: "delay-1" },
                  { label: "Linktree", val: "linktr.ee/jrhwood", href: "http://linktr.ee/jrhwood", delay: "delay-2" },
                  { label: "LinkedIn", val: "linkedin.com/in/jrhwood", href: "https://www.linkedin.com/in/jrhwood", delay: "delay-3" },
                  { label: "GitHub Repos", val: "github.com/woodrock", href: "https://github.com/woodrock", delay: "delay-4" }
                ].map(item => (
                  <div class="group border-b border-white/10 pb-6">
                    <div class={`text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-1 bioluminescent-text ${item.delay}`}>{item.label}</div>
                    <a href={item.href} class={`text-xl font-bold text-white hover:text-indigo-400 transition-colors block bioluminescent-text ${item.delay}`}>{item.val}</a>
                  </div>
                ))}
              </div>
              
              <div class="mt-16 p-8 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm">
                <div class="text-[10px] font-black text-indigo-400 uppercase mb-2">Fun Fact</div>
                <p class="text-sm text-slate-300 leading-relaxed italic">
                  "I once built a <a href="https://woodrock.github.io/moody-bitch/" target="_blank" class="text-indigo-400 hover:text-indigo-300 underline decoration-indigo-500/30 underline-offset-4">Skyrim Wellbeing Manager</a> to gamify tracking mental health. Currently, I'm navigating the depths of Baldur's Gate 3."
                </p>
              </div>
            </div>
            <div>
              <div class="bg-white/10 dark:bg-zinc-900/40 border border-white/10 rounded-[3rem] p-10 md:p-16 shadow-2xl backdrop-blur-sm">
                <form action="/" method="POST" class="space-y-8">
                  <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-slate-300">Identity</label>
                    <input type="email" name="email" placeholder="email@institution.edu" class="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" required />
                  </div>
                  <div class="space-y-2">
                    <label class="text-[10px] font-black uppercase tracking-widest text-slate-300">Subject</label>
                    <textarea name="message" placeholder="Describe the project or research opportunity..." rows={4} class="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none transition-colors" required></textarea>
                  </div>
                  <button type="submit" class="w-full py-5 bg-indigo-600 text-white rounded-full font-black uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95">Transmitting Signal</button>
                </form>
              </div>
            </div>
          </div>
          
          <div class="mt-40">
            <h3 class="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-16 text-center bioluminescent-text delay-3">Principal System Architect</h3>
            <div class="max-w-sm mx-auto p-4 bg-white/5 rounded-[3rem] backdrop-blur-md border border-white/10">
              {teamMembers.map(member => <TeamMember key={member.id} member={member} />)}
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}