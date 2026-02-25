// routes/contact.tsx

// Import section remains the same
import { Button } from "../components/Button.tsx";
import { FreshContext } from "$fresh/server.ts";
import { useState } from "preact/hooks";
import { TeamMember } from "../components/TeamMember.tsx";

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  bio: string;
  email: string;
  linkedin: string;
  imageSrc: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: "jesse-wood",
    name: "Jesse Wood",
    title: "PhD Candidate",
    bio: "Software engineer with expertise in full-stack development, machine learning, and data visualization. Passionate about building tools that solve real-world problems.",
    email: "jrhwood98@gmail.com",
    linkedin: "https://www.linkedin.com/in/jrhwood",
    imageSrc: "https://pbs.twimg.com/profile_images/1904799151331958786/KxV1kqJ7_400x400.jpg"
  },
  {
    id: "bach-hoai-nguyen",
    name: "Bach Hoai Nguyen",
    title: "Lecturer",
    bio: "Lecturer in Computer Science at Victoria University of Wellington. My research focuses on machine learning, data mining, and their applications in various domains.",
    email: "Bach.Nguyen@ecs.vuw.ac.nz",
    linkedin: "https://www.linkedin.com/in/hoaibach/",
    imageSrc: "https://people.wgtn.ac.nz/bach.nguyen/thumbnail"
  },
  {
    id: "bing-xue",
    name: "Bing Xue",
    title: "Professor, IEEE Fellow",
    bio: "Professor of Computer Science at Victoria University of Wellington. I am interested in the intersection of AI and human-computer interaction.",
    email: "Bing.Xue@ecs.vuw.ac.nz",
    linkedin: "https://www.linkedin.com/in/bing-xue-116a4736/",
    imageSrc: "https://homepages.ecs.vuw.ac.nz/~xuebing/Photos/BingXUE.png"
  },
  {
    id: "mengjie-zhang",
    name: "Mengjie Zhang",
    title: "Professor, IEEE Fellow",
    bio: "Professor of Computer Science at Victoria University of Wellington. My research interests include evolutionary computation, machine learning, and their applications.",
    email: "Mengjie.Zhang@ecs.vuw.ac.nz",
    linkedin: "https://www.linkedin.com/in/mengjie-zhang-a8b156a7",
    imageSrc: "https://homepages.ecs.vuw.ac.nz/~mengjie/mengjie-new.jpg"
  },
  {
    id: "daniel-killeen",
    name: "Daniel Killeen",
    title: "Project Manager, PhD",
    bio: "I lead a team of chemists that work on multidisiplinary applied research projects. Our focus is on science delivery that achieves real-world impact.",
    email: "Daniel.Killeen@plantandfood.co.nz",
    linkedin: "https://www.linkedin.com/in/daniel-killeen-7a1a7885/",
    imageSrc: "https://images.ctfassets.net/y9no91j9bwnp/7E9E6yx1L7L6XcvJrAMBP2/a50d912f31c3a9808b3f2ff456d3c52b/profile-photo-daniel-killeen.jpg?w=800&h=800&q=80"
  }
];

export default function Contact() {
  return (
    <div class="min-h-screen bg-zinc-950 py-20 px-6 sm:px-8 lg:px-12">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-24">
          <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">Get In Touch</h1>
          <div class="h-1.5 w-24 bg-indigo-500 mx-auto rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
          <p class="mt-8 text-xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed">
            I'm always open to discussing new projects, research opportunities, or
            potential collaborations.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          {/* Contact Methods */}
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-zinc-900/40 border border-white/5 rounded-3xl p-8 backdrop-blur-sm">
              <h2 class="text-xl font-bold mb-8 text-white tracking-tight">Connect</h2>

              <div class="space-y-8">
                {[
                  { 
                    label: "Email", 
                    value: "jrhwood98@gmail.com", 
                    href: "mailto:jrhwood98@gmail.com",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    )
                  },
                  { 
                    label: "LinkedIn", 
                    value: "linkedin.com/in/jrhwood", 
                    href: "https://www.linkedin.com/in/jrhwood",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    )
                  },
                  { 
                    label: "GitHub", 
                    value: "github.com/woodrock", 
                    href: "https://github.com/woodrock",
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                      </svg>
                    )
                  }
                ].map((method) => (
                  <div class="flex items-start group">
                    <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-indigo-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/30 transition-all">
                      {method.icon}
                    </div>
                    <div class="ml-4">
                      <h3 class="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">{method.label}</h3>
                      <p class="text-sm font-medium text-slate-300">
                        <a href={method.href} class="hover:text-white transition-colors">
                          {method.value}
                        </a>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div class="lg:col-span-2">
            <div class="bg-zinc-900/40 border border-white/5 rounded-3xl p-10 backdrop-blur-sm relative overflow-hidden">
              <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none"></div>
              
              <h2 class="text-xl font-bold mb-8 text-white tracking-tight">Send a Message</h2>

              <form class="space-y-6" action="https://formspree.io/f/mpwpynqy" method="POST">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label for="name" class="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      class="block w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label for="email" class="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      class="block w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label for="subject" class="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    class="block w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    placeholder="Project Inquiry"
                  />
                </div>

                <div>
                  <label for="message" class="block text-xs font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    class="block w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                    placeholder="Tell me more about your project..."
                  ></textarea>
                </div>

                <div class="pt-4">
                  <button
                    type="submit"
                    class="w-full sm:w-auto px-10 py-4 bg-white text-zinc-950 font-bold rounded-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:bg-indigo-50 transition-all active:scale-95"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Location/Map Section */}
        <div class="mb-32">
          <div class="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden">
            <div class="grid grid-cols-1 md:grid-cols-2">
              <div class="p-12 md:p-16 flex flex-col justify-center">
                <span class="text-xs font-black uppercase tracking-widest text-indigo-400 mb-4">Location</span>
                <h2 class="text-3xl font-bold text-white mb-6">Wellington, New Zealand</h2>
                <p class="text-slate-400 text-lg font-light leading-relaxed mb-8">
                  I'm currently based in the windy capital of Aotearoa, but I'm open to remote collaboration and opportunities worldwide.
                </p>
                <div class="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-widest">
                  <span class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  Available for remote work
                </div>
              </div>
              <div class="h-[400px] md:h-auto border-t md:border-t-0 md:border-l border-white/5">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=174.7655%2C-41.2966%2C174.7856%2C-41.2766&amp;layer=mapnik&amp;marker=-41.28664%2C174.77557"
                  class="grayscale invert opacity-50 hover:opacity-80 transition-opacity duration-700"
                  title="Wellington, New Zealand Map"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Our Team Section */}
        <div class="mb-12">
          <div class="flex items-center gap-4 mb-16">
            <h2 class="text-3xl md:text-5xl font-black text-white tracking-tighter">Our Team</h2>
            <div class="h-px flex-grow bg-gradient-to-r from-white/10 to-transparent"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {teamMembers.map(member => (
              <TeamMember key={member.id} member={member} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Optional server-side handler for form submission
export const handler = {
  async POST(req: Request, ctx: FreshContext) {
    // This would handle the form submission
    // For now, just return a success response
    const formData = await req.formData();

    // Here you would process the form data, e.g. send an email
    console.log("Contact form submission:", Object.fromEntries(formData));

    // Redirect back to the contact page with a success message
    const url = new URL(req.url);
    url.searchParams.set("success", "true");
    return Response.redirect(url.toString(), 303);
  },
};