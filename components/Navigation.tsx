// components/Navigation.tsx
import { IS_BROWSER } from "$fresh/runtime.ts";
import MobileMenu from "../islands/MobileMenu.tsx";

export default function Navigation(props: { path?: string }) {
  // Get the current path, either from props or from the browser
  const currentPath = props.path || (IS_BROWSER ? window.location.pathname : "");
  
  // Function to check if a path is active
  const isActive = (path: string) => currentPath === path;

  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/publications", label: "Publications" },
    { path: "/projects", label: "Projects" },
    { path: "/contact", label: "Contact" }
  ];

  return (
    <header class="bg-white shadow-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-center h-16">
          {/* Logo (moved to left side but still visible) */}
          <div class="absolute left-4 sm:left-6 lg:left-8 h-16 flex items-center">
            <a href="/" class="font-bold text-xl text-indigo-600">
              <span class="sr-only">Your Portfolio</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </a>
          </div>
          
          {/* Centered navigation */}
          <nav class="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                class={`px-3 py-2 text-sm font-medium rounded-md transition duration-150 ease-in-out relative ${
                  isActive(item.path)
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {item.label}
                {isActive(item.path) && (
                  <span class="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600" />
                )}
              </a>
            ))}
          </nav>
          
          {/* Resume button (moved to right side) */}
          <div class="absolute right-4 sm:right-6 lg:right-8 h-16 flex items-center">
            <a
              href="/download?filename=resume.pdf"
              class="whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 hidden md:flex"
            >
              Resume
            </a>
            
            {/* Mobile menu as an island component */}
            <div class="md:hidden relative">
              <MobileMenu items={menuItems} currentPath={currentPath} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}