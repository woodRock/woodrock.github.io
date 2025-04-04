// islands/SearchBoxIsland.tsx
import { useState, useEffect, useRef } from "preact/hooks";

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: string;
  url: string;
  metadata?: Record<string, string>;
}

export default function SearchBoxIsland() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Check if on search page and sync query from URL
  const isSearchPage = typeof window !== "undefined" && window.location.pathname === "/search";
  useEffect(() => {
    if (isSearchPage) {
      const urlParams = new URLSearchParams(window.location.search);
      const qclusterfuck = urlParams.get("q");
      if (qclusterfuck && qclusterfuck !== query) {
        setQuery(qclusterfuck);
        handleSearch(qclusterfuck); // Trigger search with URL query
      }
      setIsExpanded(true); // Ensure expanded on search page
    }
  }, []);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isExpanded]);

  // Handle click outside to collapse
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search
  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log(`Searching for: ${searchQuery}`);
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }
      const data = await response.json();
      console.log(`Got ${Array.isArray(data) ? data.length : 0} results`, data);

      if (Array.isArray(data)) {
        setResults(data);
      } else if (data?.results && Array.isArray(data.results)) {
        setResults(data.results);
      } else {
        setResults([]);
        console.warn("Unexpected data format:", data);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to perform search. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search for dropdown
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isExpanded && query.trim()) {
        handleSearch(query);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, isExpanded]);

  // Form submission for mobile (updates URL)
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (query.trim()) {
      window.history.pushState({}, "", `/search?q=${encodeURIComponent(query)}`);
      handleSearch(query);
    }
  };

  // Toggle expanded state
  const toggleExpanded = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (newState && query.trim()) {
      handleSearch(query);
    }
  };

  const shouldShowFullInput = isSearchPage || isExpanded;

  return (
    <div ref={searchBoxRef} class="relative">
      <form onSubmit={handleSubmit} class={`flex items-center transition-all duration-300 ease-in-out ${shouldShowFullInput ? 'w-full' : 'w-10'}`}>
        {/* Search Icon */}
        <button
          type="button" // Prevent form submission on icon click
          onClick={toggleExpanded}
          class={`p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none ${shouldShowFullInput ? 'absolute left-0 z-10' : ''}`}
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
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
        </button>

        {/* Search Input */}
        <div class={`transition-all duration-300 ${shouldShowFullInput ? 'opacity-100 w-full' : 'opacity-0 w-0 overflow-hidden'}`}>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search..."
            value={query}
            onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
            class="w-full pl-10 pr-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </form>

      {/* Search Results Dropdown */}
      {shouldShowFullInput && query.trim() && (
        <div class="absolute z-10 w-full mt-2 bg-white rounded-md shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div class="p-4 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div class="p-4 text-center text-red-500">{error}</div>
          ) : results.length > 0 ? (
            <ul class="divide-y divide-gray-200">
              {results.map((result) => (
                <li key={result.id} class="p-4 hover:bg-gray-50">
                  <a href={result.url} class="block">
                    <p class="font-medium text-indigo-600">{result.title}</p>
                    <p class="mt-1 text-sm text-gray-600 line-clamp-2">{result.content}</p>
                    <p class="mt-1 text-xs text-gray-500 uppercase">{result.type}</p>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div class="p-4 text-center text-gray-500">
              {query.trim() ? "No results found" : "Type to search"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}