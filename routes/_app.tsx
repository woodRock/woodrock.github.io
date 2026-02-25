// _app.tsx
import { type PageProps } from "$fresh/server.ts";
import NavigationWithSearch from "../components/NavigationWithSearch.tsx";
import Footer from "../components/Footer.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function App({ Component, url }: PageProps) {
  // Extract the current path for active navigation highlighting
  const currentPath = url.pathname;

  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Jesse Wood | Portfolio</title>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body class="min-h-screen flex flex-col bg-zinc-950 text-slate-200 font-[Inter,sans-serif] selection:bg-indigo-500/30">
        {/* Modern Hero Section */}
        <div class="relative overflow-hidden border-b border-white/5">
          {/* Subtle Ambient Glows */}
          <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div class="relative max-w-screen-xl mx-auto px-6 py-20 md:py-28 flex flex-col items-center text-center">
            <div class="relative mb-8 group">
              <div class="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/40 transition-all duration-700"></div>
              <img
                class="relative w-28 h-28 md:w-36 md:h-36 rounded-full border border-white/10 shadow-2xl object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-500"
                src="/favicon.png"
                alt="Jesse Wood"
              />
            </div>
            
            <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-white">
              Jesse Wood
            </h1>
            
            <div class="flex items-center gap-3 mb-6">
              <span class="h-px w-8 bg-indigo-500/50"></span>
              <p class="text-lg md:text-xl text-slate-400 font-medium tracking-wide uppercase">
                Researcher <span class="text-indigo-500/50 mx-1">•</span> Engineer <span class="text-indigo-500/50 mx-1">•</span> Data Scientist
              </p>
              <span class="h-px w-8 bg-indigo-500/50"></span>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <NavigationWithSearch path={currentPath} />
        
        {/* Main content */}
        <main class="flex-grow">
          <Component />
        </main>
        
        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}