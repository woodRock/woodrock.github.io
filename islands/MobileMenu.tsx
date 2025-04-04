// islands/MobileMenu.tsx
import { useState } from "preact/hooks";

interface MobileMenuProps {
  items: Array<{
    path: string;
    label: string;
  }>;
  currentPath: string;
}

export default function MobileMenu({ items, currentPath }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => currentPath === path;

  return (
    <div class="md:hidden">
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={toggleMenu}
        class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        aria-expanded={isOpen}
      >
        <span class="sr-only">{isOpen ? "Close main menu" : "Open main menu"}</span>
        {!isOpen ? (
          <svg
            class="block h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        ) : (
          <svg
            class="block h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        )}
      </button>

      {/* Mobile menu, show/hide based on menu state */}
      {isOpen && (
        <div class="absolute top-16 inset-x-0 z-50 bg-white shadow-lg rounded-b-lg">
          <div class="px-2 pt-2 pb-3 space-y-1">
            {items.map((item) => (
              <a
                key={item.path}
                href={item.path}
                class={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/download?filename=resume.pdf"
              class="block px-3 py-2 mt-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={() => setIsOpen(false)}
            >
              Resume
            </a>
          </div>
        </div>
      )}
    </div>
  );
}