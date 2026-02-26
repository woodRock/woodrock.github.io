import { useState, useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import SearchBox from "../components/SearchBox.tsx";
import MobileMenu from "../components/MobileMenu.tsx";
import ThemeToggle from "../components/ThemeToggle.tsx";
import Soundscape from "../components/Soundscape.tsx";
import { activeSection } from "../utils/signals.ts";

export default function NavigationWithSearch(props: { path?: string }) {
  const currentPath = props.path || (IS_BROWSER ? window.location.pathname : "");
  const currentActiveSection = activeSection.value; // Force top-level subscription
  const isSearchPage = currentPath === "/search";
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!IS_BROWSER) return;
    const handleGlobalMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  const menuItems = [
    { id: "hero", path: "/#hero", label: "Home" },
    { id: "publications", path: "/#publications", label: "Research" },
    { id: "projects", path: "/#projects", label: "Projects" },
    { id: "contact", path: "/#contact", label: "Contact" },
  ];

  return (
    <header 
      class="bg-white dark:bg-zinc-950 border-b border-black/5 dark:border-white/5 fixed top-0 left-0 right-0 z-50 navigation-with-search"
      style={{ transition: 'none' }}
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-16">
          <div class="flex items-center flex-shrink-0">
            {/* Search box on larger screens */}
            {!isSearchPage && (
              <div class="hidden lg:block lg:absolute lg:right-0 mr-28 w-48 xl:w-72">
                <SearchBox />
              </div>
            )}
          </div>

          <nav class="hidden md:flex items-center justify-center mx-auto space-x-1">
            {menuItems.map((item) => {
              // Subtle magnetic effect logic
              const magneticStrength = 15;
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    const deltaX = (e.clientX - centerX) / (rect.width / 2);
                    const deltaY = (e.clientY - centerY) / (rect.height / 2);
                    e.currentTarget.style.transform = `translate(${deltaX * magneticStrength}px, ${deltaY * magneticStrength}px)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = `translate(0, 0)`;
                  }}
                  class={`px-4 py-2 text-sm font-medium rounded-full relative group ${
                    currentActiveSection === item.id || currentPath === item.path
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                  {(currentActiveSection === item.id || currentPath === item.path) && (
                    <span class="absolute -bottom-1 left-4 right-4 h-0.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                  )}
                </a>
              );
            })}
          </nav>

          <div class="flex items-center md:absolute md:right-0 space-x-2 md:space-x-4">
            {!isSearchPage && (
              <a
                href="/search"
                class="lg:hidden p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none transition-colors"
              >
                <span class="sr-only">Search</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </a>
            )}
            <Soundscape />
            <ThemeToggle />
            <a
              href="/download?filename=resume.pdf"
              class="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
            >
              Resume
            </a>
            <MobileMenu menuItems={menuItems} currentPath={currentPath} />
          </div>
        </div>
      </div>

      {/* Mobile search bar - moved more left with -translate-x-24 */}
      {isSearchPage && (
        <div class="border-t border-gray-200 py-3 px-4">
          <div class="max-w-md mx-auto">
            <SearchBox />
          </div>
        </div>
      )}
    </header>
  );
}