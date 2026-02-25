import { IS_BROWSER } from "$fresh/runtime.ts";
import SearchBoxIsland from "../islands/SearchBoxIsland.tsx";
import MobileMenuIsland from "../islands/MobileMenuIsland.tsx";

export default function NavigationWithSearch(props: { path?: string }) {
  const currentPath = props.path || (IS_BROWSER ? window.location.pathname : "");
  const isActive = (path: string) => currentPath === path;
  const isSearchPage = isActive("/search");

  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/publications", label: "Publications" },
    { path: "/projects", label: "Projects" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header class="bg-zinc-950/80 backdrop-blur-lg border-b border-white/5 sticky top-0 z-50 navigation-with-search">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="relative flex items-center justify-between h-16">
          <div class="flex items-center flex-shrink-0">
            {/* Search box on larger screens */}
            {!isSearchPage && (
              <div class="hidden lg:block lg:absolute lg:right-0 mr-28 w-48 xl:w-72">
                <SearchBoxIsland />
              </div>
            )}
          </div>

          <nav class="hidden md:flex items-center justify-center mx-auto space-x-1">
            {menuItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                class={`px-4 py-2 text-sm font-medium rounded-full transition duration-300 relative group ${
                  isActive(item.path)
                    ? "text-indigo-400"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <span class="absolute -bottom-1 left-4 right-4 h-0.5 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                )}
                {!isActive(item.path) && (
                  <span class="absolute -bottom-1 left-4 right-4 h-0.5 bg-white/0 rounded-full group-hover:bg-white/10 transition-all duration-300" />
                )}
              </a>
            ))}
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
            <a
              href="/download?filename=resume.pdf"
              class="hidden sm:inline-flex items-center justify-center px-5 py-2 rounded-full text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
            >
              Resume
            </a>
            <MobileMenuIsland menuItems={menuItems} currentPath={currentPath} />
          </div>
        </div>
      </div>

      {/* Mobile search bar - moved more left with -translate-x-24 */}
      {isSearchPage && (
        <div class="border-t border-gray-200 py-3 px-4">
          <div class="max-w-md mx-auto">
            <SearchBoxIsland />
          </div>
        </div>
      )}
    </header>
  );
}