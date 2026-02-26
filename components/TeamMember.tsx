// components/TeamMember.tsx

type TeamMemberType = {
  name: string;
  title: string;
  bio: string;
  email: string;
  linkedin: string;
  imageSrc: string;
};

interface TeamMemberProps {
  member: TeamMemberType;
}

export function TeamMember({ member }: TeamMemberProps) {
  const { name, title, bio, email, linkedin, imageSrc } = member;
  
  return (
    <div class="group bg-white/50 dark:bg-zinc-900/40 border border-black/5 dark:border-white/5 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all duration-500 shadow-xl dark:shadow-2xl">
      <div class="h-72 overflow-hidden relative">
        <img
          src={imageSrc}
          alt={name}
          class="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-100 dark:from-zinc-950 to-transparent opacity-60"></div>
      </div>
      <div class="p-8 relative -mt-12 z-10">
        <div class="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-6 rounded-3xl border border-black/5 dark:border-white/10 shadow-2xl">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-1 tracking-tight">
            {name}
          </h3>
          <p class="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-4">
            {title}
          </p>
          <p class="text-slate-600 dark:text-slate-400 text-sm font-light mb-6 leading-relaxed">
            {bio}
          </p>
          <div class="space-y-3">
            <div class="flex items-center group/link">
              <div class="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mr-3 group-hover/link:bg-indigo-50 dark:group-hover/link:bg-white/10 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5 text-slate-500 dark:text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <a
                href={`mailto:${email}`}
                class="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white text-xs transition-colors font-medium"
              >
                {email}
              </a>
            </div>
            <div class="flex items-center group/link">
              <div class="w-7 h-7 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mr-3 group-hover/link:bg-indigo-50 dark:group-hover/link:bg-white/10 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3.5 w-3.5 text-slate-500 dark:text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              <a
                href={linkedin}
                target="_blank"
                class="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white text-xs transition-colors font-medium"
              >
                LinkedIn Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}