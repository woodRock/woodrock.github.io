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
        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        <span class="sr-only">Open main menu</span>
        {isOpen ? (
          <svg
            class="block h-6 w-6"
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
            class="block h-6 w-6"
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
        <div class="absolute top-12 right-0 w-48 z-50 bg-white shadow-lg rounded-b-lg">
          <div class="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                class={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/download?filename=resume.pdf"
              class="block px-3 py-2 mt-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Resume
            </a>
          </div>
        </div>
      )}
    </div>
  );
}