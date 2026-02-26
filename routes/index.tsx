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
import MarineAtmosphere from "../islands/MarineAtmosphere.tsx";
import OceanicHUD from "../islands/OceanicHUD.tsx";
import AtmosphericOverlay from "../islands/AtmosphericOverlay.tsx";

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
  },
  async POST(req, ctx) {
    const formData = await req.formData();
    
    try {
      // Forward the data to Formspree
      const response = await fetch("https://formspree.io/f/mpwpynqy", {
        method: "POST",
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        console.log("✅ Formspree Submission SUCCESS");
      } else {
        const errData = await response.json();
        console.error("❌ Formspree Submission FAILED:", errData);
      }
    } catch (error) {
      console.error("❌ Error forwarding to Formspree:", error);
    }

    // Redirect back to home with a success parameter
    const url = new URL(req.url);
    url.searchParams.set("success", "true");
    url.hash = "contact";
    return Response.redirect(url.toString(), 303);
  }
};

export default function Home({ data, url }: PageProps<HomePageData>) {
  const { projects, publications } = data;
  const isSuccess = url.searchParams.get("success") === "true";
  
  return (
    <div class="relative dive-gradient transition-colors duration-1000">
      <MarineAtmosphere />
      <AtmosphericOverlay />
      <OceanicHUD />
      <FishTank />
      <DepthGauge />
      <ScrollController />
      
      {/* 1. Hero Section - The Surface */}
      <section id="hero" class="relative pt-32 pb-24 px-6 min-h-screen flex flex-col justify-center border-b border-black/5 dark:border-white/5">
        <div class="caustics hidden dark:block"></div>
        <div class="max-w-6xl mx-auto text-center relative">
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
      <section class="py-32 px-6 relative">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div class="flex-grow">
              <div class="flex items-center gap-4 mb-4">
                <div class="h-px w-8 bg-indigo-500"></div>
                <h2 class="text-xs font-black uppercase tracking-[0.4em] text-slate-700 dark:text-slate-400">Featured Research</h2>
              </div>
              <h3 class="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">fishy-business</h3>
            </div>
            
            <div class="flex gap-4">
              <a 
                href="https://github.com/woodrock/fishy-business" 
                target="_blank"
                class="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all flex items-center gap-3 group"
              >
                <svg class="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                </svg>
                <span class="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">Source Code</span>
              </a>
              <a 
                href="https://fishy-business.readthedocs.io/en/latest/index.html" 
                target="_blank"
                class="px-6 py-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 hover:border-indigo-500/50 transition-all flex items-center gap-3 group shadow-lg shadow-indigo-500/5"
              >
                <svg class="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span class="text-xs font-black uppercase tracking-widest text-indigo-400 group-hover:text-indigo-300 transition-colors">Documentation</span>
              </a>
            </div>
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
      <section id="expertise" class="py-32 px-6 relative border-y border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/[0.02]">
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
      <section id="publications" class="py-32 px-6 relative">
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
                citation={paper.citation}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Projects Section */}
      <section id="projects" class="py-32 bg-black/10 dark:bg-white/[0.02] relative border-y border-black/10 dark:border-white/5 overflow-hidden">
        <div class="max-w-6xl mx-auto px-6 mb-16">
          <h2 class="text-5xl md:text-7xl font-black text-white tracking-tighter bioluminescent-text">Technical Projects</h2>
        </div>
        
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex flex-col md:flex-row flex-wrap justify-center gap-8">
            {projects.map((project, index) => (
              <div class="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] flex">
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
          </div>
        </div>
      </section>

      {/* 6. Contact & Team - Hadal Zone */}
      <section id="contact" class="py-32 px-6 relative">
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
                {isSuccess ? (
                  <div class="text-center py-12 animate-fade-in">
                    <div class="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 class="text-2xl font-black text-white mb-4 uppercase tracking-tighter">Signal Transmitted</h3>
                    <p class="text-slate-400 font-light">Your research inquiry has been logged. Expect a connection soon.</p>
                    <a 
                      href="/#contact" 
                      class="mt-10 inline-block text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Send another signal
                    </a>
                  </div>
                ) : (
                  <form action="/" method="POST" class="space-y-8">
                    <div class="space-y-2">
                      <label class="text-[10px] font-black uppercase tracking-widest text-slate-300">Identity</label>
                      <input type="email" name="email" placeholder="email@institution.edu" class="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors" required />
                    </div>
                    <div class="space-y-2">
                      <label class="text-[10px] font-black uppercase tracking-widest text-slate-300">Subject</label>
                      <textarea name="message" placeholder="Describe the project or research opportunity..." rows={4} class="w-full bg-transparent border-b border-white/20 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none transition-colors" required></textarea>
                    </div>
                    <button 
                      type="submit" 
                      data-sound="sonar"
                      class="w-full py-5 bg-indigo-600 text-white rounded-full font-black uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all active:scale-95 sonar-ping"
                    >
                      Transmitting Signal
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
          
          <div class="mt-40">
            <h3 class="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 mb-16 text-center bioluminescent-text delay-3">Machine Learning Engineer</h3>
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