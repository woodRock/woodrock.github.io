// routes/search.tsx
import { PageProps } from "$fresh/server.ts";
import SearchBoxIsland from "../islands/SearchBoxIsland.tsx";

// Define your SearchData interface if needed
interface SearchData {
  // Add properties as needed
}

export default function SearchPage({ data }: PageProps<SearchData>) {
  return (
    <div class="min-h-screen bg-white pt-24 px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        {/* This div creates extra white space */}
        <div class="h-96"></div>
      </div>
    </div>
  );
}