// routes/api/search.ts
import { Handlers } from "$fresh/server.ts";
import { createSupabaseClient } from "../api/supabase.ts";

// Define a type for search results
interface SearchItem {
  id: string | number;
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
      // Initialize Supabase client
      const supabase = createSupabaseClient();
      console.log("Supabase client initialized");
      
      // Array to store all search results
      const searchResults: SearchItem[] = [];
      
      // Search in projects table
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select("id, title, description, github_link")
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,language.ilike.%${query}%`);
      
      if (projectsError) {
        console.error("Error searching projects:", projectsError);
      } else {
        console.log(`Found ${projectsData?.length || 0} matching projects`);
        
        // Convert projects to SearchItem format
        const projectItems = (projectsData || []).map(project => ({
          id: project.id.toString(),
          title: project.title,
          content: project.description,
          type: "project",
          url: `/#projects`,
          metadata: {
            github: project.github_link
          }
        }));
        
        searchResults.push(...projectItems);
      }
      
      // Search in publications table
      const { data: publicationsData, error: publicationsError } = await supabase
        .from("publications")
        .select("id, title, abstract, year, journal, link")
        .or(`title.ilike.%${query}%,abstract.ilike.%${query}%,journal.ilike.%${query}%`);
      
      if (publicationsError) {
        console.error("Error searching publications:", publicationsError);
      } else {
        console.log(`Found ${publicationsData?.length || 0} matching publications`);
        
        // Convert publications to SearchItem format
        const publicationItems = (publicationsData || []).map(pub => ({
          id: pub.id.toString(),
          title: pub.title,
          content: pub.abstract,
          type: "publication",
          url: `/#publications`,
          metadata: {
            year: pub.year.toString(),
            journal: pub.journal,
            link: pub.link
          }
        }));
        
        searchResults.push(...publicationItems);
      }
      
      console.log(`Total search results: ${searchResults.length}`);
      
      // Return the combined results as JSON
      return new Response(JSON.stringify(searchResults), {
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