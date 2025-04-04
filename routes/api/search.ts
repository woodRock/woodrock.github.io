// routes/api/search.ts
import { Handlers } from "$fresh/server.ts";

// Define a type for search results
interface SearchItem {
  id: string;
  title: string;
  content: string;
  type: string;
  url: string;
  metadata?: Record<string, string>;
}

export const handler: Handlers = {
  async GET(req) {
    console.log("Search API called");
    
    // Get the search query from URL parameters
    const url = new URL(req.url);
    const query = url.searchParams.get("q")?.toLowerCase() || "";
    console.log("Search query:", query);
    
    // If no query, return empty results
    if (!query.trim()) {
      console.log("Empty query, returning empty results");
      return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json" },
      });
    }
    
    try {
      // Log the path we're trying to read from
      const searchDataPath = "./static/data/searchable-content.json";
      console.log("Trying to read from path:", searchDataPath);
      
      // Check if the file exists
      try {
        await Deno.stat(searchDataPath);
        console.log("File exists");
      } catch (e) {
        console.error("File does not exist:", e);
        return new Response(JSON.stringify({ error: "Search data file not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      // Load the search data
      const searchDataText = await Deno.readTextFile(searchDataPath);
      console.log("File content length:", searchDataText.length);
      
      // Verify the JSON is valid
      let searchData: SearchItem[];
      try {
        searchData = JSON.parse(searchDataText);
        console.log("Parsed JSON successfully, item count:", searchData.length);
        console.log("Sample item:", searchData.length > 0 ? JSON.stringify(searchData[0]).substring(0, 100) + "..." : "No items");
      } catch (e) {
        console.error("JSON parse error:", e);
        return new Response(JSON.stringify({ error: "Invalid search data format" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      // Perform the search (simple contains search for now)
      const results = searchData.filter(item => {
        const titleMatch = item.title.toLowerCase().includes(query);
        const contentMatch = item.content.toLowerCase().includes(query);
        const typeMatch = item.type.toLowerCase().includes(query);
        const urlMatch = item.url.toLowerCase().includes(query);
        const metadataMatch = Object.values(item.metadata || {}).some(value =>
          value.toLowerCase().includes(query)
        );
        // Check if any of the fields match
        return titleMatch || contentMatch || typeMatch || urlMatch || metadataMatch;
      });
      
      console.log(`Search for "${query}" found ${results.length} results`);
      if (results.length > 0) {
        console.log("First result:", JSON.stringify(results[0]).substring(0, 100) + "...");
      }
      
      // Return the results as JSON
      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Search error:", error);
      
      // Return an error response
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};