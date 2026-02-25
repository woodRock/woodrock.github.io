// islands/MobileMenuIsland.tsx
import { useState } from "preact/hooks";

interface MenuItem {
  path: string;
  label: string;
}

export default function MobileMenuIsland({ 
  menuItems, 
  currentPath 
}: { 
  menuItems: MenuItem[];
  currentPath: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Function to check if a path is active
  const isActive = (path: string) => currentPath === path;

  // Toggle menu open/closed
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div class="md:hidden relative">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={toggleMenu}
        class="inline-flex items-center justify-center p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 focus:outline-none transition-colors border border-white/5"
      >
        <span class="sr-only">Open main menu</span>
        {isOpen ? (
          <svg
            class="block h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            class="block h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>
      
      {/* Mobile menu dropdown */}
      {isOpen && (
        <div class="absolute top-14 right-0 w-64 z-50 bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-2">
          <div class="space-y-1">
            {menuItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                class={`block px-5 py-3 rounded-2xl text-sm font-bold tracking-tight transition-all duration-300 ${
                  isActive(item.path)
                    ? "bg-white/10 text-white shadow-inner"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            ))}
            <div class="px-2 py-3 mt-1 border-t border-white/5">
              <a
                href="/download?filename=resume.pdf"
                class="block w-full text-center px-5 py-3 rounded-2xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}