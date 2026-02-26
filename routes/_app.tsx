// _app.tsx
import { type PageProps } from "$fresh/server.ts";
import NavigationWithSearch from "../islands/NavigationWithSearch.tsx";
import Footer from "../components/Footer.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function App({ Component, url }: PageProps) {
  // Extract the current path for active navigation highlighting
  const currentPath = url.pathname;

  return (
    <html class="scroll-smooth">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Jesse Wood | Portfolio</title>
        <link rel="stylesheet" href="/styles.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            function getTheme() {
              const saved = localStorage.getItem('theme');
              if (saved) return saved;
              return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            const theme = getTheme();
            if (theme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          })()
        ` }} />
      </head>
      <body class="min-h-screen flex flex-col font-[Inter,sans-serif]">
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