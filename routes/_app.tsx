// _app.tsx
import { type PageProps } from "$fresh/server.ts";
import Navigation from "../components/Navigation.tsx";
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
      <body class="min-h-screen flex flex-col bg-gray-50 font-[Inter,sans-serif]">
        {/* Hero Banner with Gradient Background */}
        <div class="bg-gradient-to-r from-purple-800 via-violet-600 to-indigo-700 text-white">
          <div class="relative overflow-hidden">
            {/* Decorative elements */}
            <div class="absolute inset-0">
              <div class="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent opacity-60"></div>
              <div class="absolute -inset-x-0 -top-40 -bottom-40 bg-[url('/nebula-pattern.svg')] bg-center opacity-20"></div>
              <div class="absolute top-0 bottom-0 left-0 right-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)] pointer-events-none"></div>
            </div>
            
            {/* Content */}
            <div class="relative max-w-screen-xl mx-auto px-6 py-16 md:py-20 flex flex-col items-center text-center">
              <img
                class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/20 shadow-xl mb-6 object-cover"
                src="/favicon.png"
                alt="Jesse Wood"
              />
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3">
                Jesse Wood
              </h1>
              <div class="w-24 h-1 bg-white/50 rounded my-4"></div>
              <p class="text-xl md:text-2xl text-white/90 font-light max-w-2xl">
                Researcher • Engineer • Data Scientist
              </p>
            </div>
          </div>
        </div>
        
        {/* Navigation with proper path */}
        <Navigation path={currentPath} />
        
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