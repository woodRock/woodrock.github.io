// routes/api/research-network.ts
import { Handlers } from "$fresh/server.ts";
import { publicationsApi } from "./supabase.ts";

const SEMANTIC_SCHOLAR_API = "https://api.semanticscholar.org/graph/v1";

interface PaperNode {
  id: string;
  title: string;
  year?: number;
  authors?: { name: string }[];
  citationCount?: number;
  type: "root" | "reference" | "citation";
}

interface GraphLink {
  source: string;
  target: string;
  type: "references" | "citedBy";
}

// Simple in-memory cache to prevent 429s during session
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (response.status === 429 && attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 2000 + Math.random() * 1000;
        console.warn(`Rate limited (429). Retrying in ${Math.round(delay)}ms... (Attempt ${attempt + 1}/${maxRetries})`);
        await sleep(delay);
        continue;
      }
      
      return response;
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 2000 + Math.random() * 1000;
        await sleep(delay);
        continue;
      }
    }
  }
  
  throw lastError || new Error(`Failed to fetch after ${maxRetries} attempts`);
}

// Fallback data in case of persistent 429s or 500s
const fallbackData = {
  nodes: [
    { id: "root1", title: "Automated Fish Classification Using Unprocessed Fatty Acid Data", year: 2022, type: "root" },
    { id: "root2", title: "Hook, Line and Spectra: ML for Fish Species Classification", year: 2025, type: "root" },
    { id: "ref1", title: "Rapid Evaporative Ionization Mass Spectrometry", year: 2014, type: "reference" },
    { id: "ref2", title: "Deep Learning for Chemical Analysis", year: 2019, type: "reference" },
    { id: "cite1", title: "Applications of AI in Marine Biology", year: 2023, type: "citation" },
    { id: "cite2", title: "Modern Spectrometry Techniques", year: 2024, type: "citation" }
  ],
  links: [
    { source: "root1", target: "ref1", type: "references" },
    { source: "root1", target: "ref2", type: "references" },
    { source: "root2", target: "ref1", type: "references" },
    { source: "cite1", target: "root1", type: "citedBy" },
    { source: "cite2", target: "root2", type: "citedBy" }
  ]
};

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const query = url.searchParams.get("query") || "Jesse Wood marine mass spectrometry classification";
    const apiKey = Deno.env.get("SEMANTIC_SCHOLAR_API_KEY");
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey) {
      headers["x-api-key"] = apiKey;
    }
    
    // Check cache
    const cached = cache.get(query);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
      return new Response(JSON.stringify(cached.data), {
        headers: { "Content-Type": "application/json" }
      });
    }

    try {
      const nodes: PaperNode[] = [];
      const links: GraphLink[] = [];
      const nodeIds = new Set<string>();

      // 1. Try to get DOIs from database first
      let dbPublications = [];
      try {
        dbPublications = await publicationsApi.getAll();
      } catch (e) {
        console.warn("Could not fetch publications from DB, falling back to keyword search only.");
      }

      const dois = dbPublications
        .map(p => p.doi)
        .filter(doi => doi && doi.trim().length > 0);

      if (dois.length > 0) {
        console.log(`Building network from ${dois.length} DOIs`);
        
        // Fetch details for each DOI
        for (const doi of dois.slice(0, 5)) { // Limit to top 5 to avoid long wait/429
          try {
            await sleep(2000); // Increased to 2s delay between API calls
            const paperRes = await fetchWithRetry(`${SEMANTIC_SCHOLAR_API}/paper/DOI:${doi}?fields=title,year,authors,citationCount,references.citedPaper.title,references.citedPaper.year,references.citedPaper.authors,citations.citingPaper.title,citations.citingPaper.year,citations.citingPaper.authors`, {
              headers
            });

            if (paperRes.ok) {
              const paper = await paperRes.json();
              const rootId = paper.paperId;

              if (!nodeIds.has(rootId)) {
                nodes.push({
                  id: rootId,
                  title: paper.title,
                  year: paper.year,
                  authors: paper.authors,
                  citationCount: paper.citationCount,
                  type: "root"
                });
                nodeIds.add(rootId);
              }

              // Add references (papers this paper cites)
              if (paper.references) {
                paper.references.slice(0, 5).forEach((ref: any) => {
                  const p = ref.citedPaper;
                  if (p && p.paperId) {
                    if (!nodeIds.has(p.paperId)) {
                      nodes.push({
                        id: p.paperId,
                        title: p.title || "Unknown Title",
                        year: p.year,
                        authors: p.authors,
                        type: "reference"
                      });
                      nodeIds.add(p.paperId);
                    }
                    links.push({
                      source: rootId,
                      target: p.paperId,
                      type: "references"
                    });
                  }
                });
              }

              // Add citations (papers that cite this paper)
              if (paper.citations) {
                paper.citations.slice(0, 5).forEach((cite: any) => {
                  const p = cite.citingPaper;
                  if (p && p.paperId) {
                    if (!nodeIds.has(p.paperId)) {
                      nodes.push({
                        id: p.paperId,
                        title: p.title || "Unknown Title",
                        year: p.year,
                        authors: p.authors,
                        type: "citation"
                      });
                      nodeIds.add(p.paperId);
                    }
                    links.push({
                      source: p.paperId,
                      target: rootId,
                      type: "citedBy"
                    });
                  }
                });
              }
            }
          } catch (e) {
            console.error(`Error fetching paper for DOI ${doi}:`, e);
          }
        }
      }

      // 2. If no nodes were found via DOI (or no DOIs available), fall back to keyword search
      if (nodes.length === 0) {
        console.log("No DOIs found or fetch failed, falling back to keyword search.");
        
        let searchRes;
        try {
          searchRes = await fetchWithRetry(`${SEMANTIC_SCHOLAR_API}/paper/search?query=${encodeURIComponent(query)}&limit=10&fields=title,year,authors,citationCount,references.citedPaper.title,references.citedPaper.year,references.citedPaper.authors,citations.citingPaper.title,citations.citingPaper.year,citations.citingPaper.authors`, {
            headers
          });
        } catch (e) {
          console.error("Semantic Scholar Search Fetch totally failed:", e);
          return new Response(JSON.stringify(fallbackData), {
            headers: { "Content-Type": "application/json", "X-Fatal-Error-Fallback": "true" }
          });
        }
        
        if (searchRes.status === 429) {
          console.warn("Semantic Scholar Rate Limit Exceeded after retries. Using fallback data.");
          return new Response(JSON.stringify(fallbackData), {
            headers: { "Content-Type": "application/json", "X-Fallback": "true" }
          });
        }

        if (!searchRes.ok) {
          console.warn(`Semantic Scholar Search failed with status ${searchRes.status}. Using fallback data.`);
          return new Response(JSON.stringify(fallbackData), {
            headers: { "Content-Type": "application/json", "X-API-Error-Fallback": "true" }
          });
        }
        
        const searchData = await searchRes.json();
        
        if (!searchData.data || searchData.data.length === 0) {
          return new Response(JSON.stringify(fallbackData), {
            headers: { "Content-Type": "application/json", "X-No-Results-Fallback": "true" }
          });
        }

        // Process top search results as root nodes
        const rootPapers = searchData.data.slice(0, 3);
        
        for (const rootPaper of rootPapers) {
          const rootId = rootPaper.paperId;
          if (!nodeIds.has(rootId)) {
            nodes.push({
              id: rootId,
              title: rootPaper.title,
              year: rootPaper.year,
              authors: rootPaper.authors,
              citationCount: rootPaper.citationCount,
              type: "root"
            });
            nodeIds.add(rootId);
          }

          // Fetch references and citations for each root paper
          try {
            await sleep(2000); // Increased to 2s delay
            const detailsRes = await fetchWithRetry(`${SEMANTIC_SCHOLAR_API}/paper/${rootId}?fields=references.citedPaper.title,references.citedPaper.year,references.citedPaper.authors,citations.citingPaper.title,citations.citingPaper.year,citations.citingPaper.authors`, {
              headers
            });
            
            if (detailsRes.ok) {
              const details = await detailsRes.json();
              
              if (details.references) {
                details.references.slice(0, 5).forEach((ref: any) => {
                  const p = ref.citedPaper;
                  if (p && p.paperId) {
                    if (!nodeIds.has(p.paperId)) {
                      nodes.push({
                        id: p.paperId,
                        title: p.title || "Unknown Title",
                        year: p.year,
                        authors: p.authors,
                        type: "reference"
                      });
                      nodeIds.add(p.paperId);
                    }
                    links.push({
                      source: rootId,
                      target: p.paperId,
                      type: "references"
                    });
                  }
                });
              }

              if (details.citations) {
                details.citations.slice(0, 5).forEach((cite: any) => {
                  const p = cite.citingPaper;
                  if (p && p.paperId) {
                    if (!nodeIds.has(p.paperId)) {
                      nodes.push({
                        id: p.paperId,
                        title: p.title || "Unknown Title",
                        year: p.year,
                        authors: p.authors,
                        type: "citation"
                      });
                      nodeIds.add(p.paperId);
                    }
                    links.push({
                      source: p.paperId,
                      target: rootId,
                      type: "citedBy"
                    });
                  }
                });
              }
            }
          } catch (e) {
            console.error(`Error fetching details for paper ${rootId}:`, e);
          }
        }
      }

      const responseData = { nodes, links };
      
      // Update cache
      cache.set(query, { data: responseData, timestamp: Date.now() });

      return new Response(JSON.stringify(responseData), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Research Network API Error:", error);
      // Return fallback data instead of 500 error
      return new Response(JSON.stringify(fallbackData), {
        headers: { "Content-Type": "application/json", "X-Error-Fallback": "true" }
      });
    }
  }
};