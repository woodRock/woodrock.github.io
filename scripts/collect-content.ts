// scripts/collect-content.ts
// This script collects content from your website and generates a searchable content file

import { walk } from "https://deno.land/std/fs/mod.ts";
import { parse as parseYAML } from "https://deno.land/std/yaml/mod.ts";

// Define content types for search
type ContentType = "publication" | "project" | "page";

// Define structure for content items
interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: ContentType;
  url: string;
  metadata?: Record<string, string>;
}

/**
 * Simple function to extract plain text from markdown
 * @param markdown - Markdown text to extract content from
 * @returns Plain text with markdown syntax removed
 */
function extractMarkdownContent(markdown: string): string {
  return markdown
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove inline code
    .replace(/`[^`]*`/g, '')
    // Remove headers
    .replace(/#{1,6}\s+([^\n]+)/g, '$1')
    // Remove bold/italic
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    // Remove html tags
    .replace(/<[^>]*>/g, '')
    // Remove horizontal rules
    .replace(/(\n\s*[-*_]){3,}/g, '')
    // Replace multiple newlines with single space
    .replace(/\n+/g, ' ')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts front matter and content from markdown files
 * @param content - Raw markdown content
 * @returns Object containing frontmatter and content
 */
function extractMarkdownData(content: string): { frontMatter: any, content: string } {
  const pattern = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(pattern);
  
  if (!match) {
    return { frontMatter: {}, content };
  }
  
  try {
    const frontMatter = parseYAML(match[1]);
    const extractedContent = match[2].trim();
    return { frontMatter, content: extractedContent };
  } catch (e) {
    console.error("Error parsing front matter:", e);
    return { frontMatter: {}, content };
  }
}

/**
 * Converts a filename to a URL path
 * @param filename - The filename to convert
 * @param baseDir - The base directory
 * @param basePath - The base URL path
 * @returns The URL path
 */
function filenameToUrl(filename: string, baseDir: string, basePath: string): string {
  const relativePath = filename.replace(baseDir, "").replace(/\.md$/, "");
  if (relativePath === "/index") return basePath;
  return `${basePath}${relativePath}`;
}

/**
 * Extracts content from publications.tsx file
 * @param filePath - Path to publications.tsx file
 * @returns Array of publication content items
 */
async function extractPublicationsFromTsx(filePath: string): Promise<ContentItem[]> {
  console.log("Extracting publications from TSX file...");
  const publications: ContentItem[] = [];
  
  try {
    const content = await Deno.readTextFile(filePath);
    
    // Extract papers array
    const papersRegex = /const\s+papers\s*=\s*\[\s*([\s\S]*?)\s*\];/;
    const papersMatch = content.match(papersRegex);
    
    if (papersMatch) {
      const papersContent = papersMatch[1];
      // This regex matches objects with nested properties, handling multi-line content
      const paperRegex = /{([^{}]*(?:{[^{}]*}[^{}]*)*?)}/g;
      const paperMatches = [...papersContent.matchAll(paperRegex)];
      
      console.log(`Found ${paperMatches.length} paper objects in array`);
      
      for (let i = 0; i < paperMatches.length; i++) {
        const paperStr = paperMatches[i][0];
        
        // Extract fields using regex - using [\s\S]*? for multi-line content
        const titleRegex = /title:\s*["']([^"']*)["']/;
        const abstractRegex = /abstract:\s*["']([\s\S]*?)["'],/;
        const yearRegex = /year:\s*(\d+)/;
        const journalRegex = /journal:\s*["']([^"']*)["']/;
        const linkRegex = /link:\s*["']([^"']*)["']/;
        
        const titleMatch = paperStr.match(titleRegex);
        const abstractMatch = paperStr.match(abstractRegex);
        const yearMatch = paperStr.match(yearRegex);
        const journalMatch = paperStr.match(journalRegex);
        const linkMatch = paperStr.match(linkRegex);
        
        if (titleMatch) {
          const id = `pub-${i + 1}`;
          const title = titleMatch[1];
          
          publications.push({
            id,
            title,
            content: abstractMatch ? abstractMatch[1] : "",
            type: "publication",
            url: linkMatch ? linkMatch[1] : `/publications#${id}`,
            metadata: {
              year: yearMatch ? yearMatch[1] : "",
              journal: journalMatch ? journalMatch[1] : "",
              authors: ""  // No authors in your current format
            }
          });
          
          console.log(`Extracted publication: ${title.substring(0, 30)}...`);
        }
      }
    } else {
      console.log("Could not find papers array in publications.tsx");
    }
    
    console.log(`Successfully extracted ${publications.length} publications from TSX file`);
  } catch (e) {
    console.error(`Error extracting publications from TSX:`, e);
  }
  
  return publications;
}

/**
 * Extracts content from projects.tsx file
 * @param filePath - Path to projects.tsx file
 * @returns Array of project content items
 */
async function extractProjectsFromTsx(filePath: string): Promise<ContentItem[]> {
  console.log("Extracting projects from TSX file...");
  const projects: ContentItem[] = [];
  
  try {
    const content = await Deno.readTextFile(filePath);
    
    // Extract projects array (similar to publications)
    const projectsRegex = /const\s+projects\s*=\s*\[\s*([\s\S]*?)\s*\];/;
    const projectsMatch = content.match(projectsRegex);
    
    if (projectsMatch) {
      const projectsContent = projectsMatch[1];
      // This regex matches objects with nested properties, handling multi-line content
      const projectRegex = /{([^{}]*(?:{[^{}]*}[^{}]*)*?)}/g;
      const projectMatches = [...projectsContent.matchAll(projectRegex)];
      
      console.log(`Found ${projectMatches.length} project objects in array`);
      
      for (let i = 0; i < projectMatches.length; i++) {
        const projectStr = projectMatches[i][0];
        
        // Extract fields using regex - using [\s\S]*? for multi-line content
        const titleRegex = /title:\s*["']([^"']*)["']/;
        const descriptionRegex = /description:\s*["']([\s\S]*?)["'],/;
        const languageRegex = /language:\s*["']([^"']*)["']/;
        const githubLinkRegex = /githubLink:\s*["']([^"']*)["']/;
        
        const titleMatch = projectStr.match(titleRegex);
        const descriptionMatch = projectStr.match(descriptionRegex);
        const languageMatch = projectStr.match(languageRegex);
        const githubLinkMatch = projectStr.match(githubLinkRegex);
        
        if (titleMatch) {
          const id = `proj-${i + 1}`;
          const title = titleMatch[1];
          
          projects.push({
            id,
            title,
            content: descriptionMatch ? descriptionMatch[1] : "",
            type: "project",
            url: `/projects#${id}`,
            metadata: {
              language: languageMatch ? languageMatch[1] : "",
              github: githubLinkMatch ? githubLinkMatch[1] : "",
              tags: ""
            }
          });
          
          console.log(`Extracted project: ${title}`);
        }
      }
    } else {
      // Fallback to ProjectCard extraction method
      console.log("Could not find projects array, trying ProjectCard extraction...");
      
      // Extract ProjectCard components
      const projectCardRegex = /<ProjectCard\s+([\s\S]*?)\/>/g;
      const projectMatches = [...content.matchAll(projectCardRegex)];
      
      console.log(`Found ${projectMatches.length} ProjectCard components`);
      
      for (let i = 0; i < projectMatches.length; i++) {
        const projectStr = projectMatches[i][0];
        
        // Extract fields using regex - be careful with multi-line attributes
        const titleRegex = /title=["']([^"']*)["']/;
        const descriptionRegex = /description=["']([\s\S]*?)["']/;
        const languageRegex = /language=["']([^"']*)["']/;
        const githubLinkRegex = /githubLink=["']([^"']*)["']/;
        
        const titleMatch = projectStr.match(titleRegex);
        const descriptionMatch = projectStr.match(descriptionRegex);
        const languageMatch = projectStr.match(languageRegex);
        const githubLinkMatch = projectStr.match(githubLinkRegex);
        
        if (titleMatch) {
          const id = `proj-${i + 1}`;
          const title = titleMatch[1];
          
          projects.push({
            id,
            title,
            content: descriptionMatch ? descriptionMatch[1] : "",
            type: "project",
            url: `/projects#${id}`,
            metadata: {
              language: languageMatch ? languageMatch[1] : "",
              github: githubLinkMatch ? githubLinkMatch[1] : "",
              tags: ""
            }
          });
          
          console.log(`Extracted project: ${title}`);
        }
      }
    }
    
    console.log(`Successfully extracted ${projects.length} projects from TSX file`);
  } catch (e) {
    console.error(`Error extracting projects from TSX:`, e);
  }
  
  return projects;
}

/**
 * Collects pages from the pages directory
 * @param pagesDir - Path to pages directory
 * @returns Array of page content items
 */
async function collectPages(pagesDir: string): Promise<ContentItem[]> {
  console.log("Collecting pages...");
  const pages: ContentItem[] = [];
  const baseUrl = "";
  
  for await (const entry of walk(pagesDir, { exts: [".tsx", ".jsx", ".md"] })) {
    if (entry.isFile) {
      try {
        let title = "";
        let content = "";
        let url = filenameToUrl(entry.path, pagesDir, baseUrl);
        
        // Handle different file types
        if (entry.path.endsWith(".md")) {
          const fileContent = await Deno.readTextFile(entry.path);
          const { frontMatter, content: extractedContent } = extractMarkdownData(fileContent);
          title = frontMatter.title || entry.name.replace(/\.(md|tsx|jsx)$/, "");
          content = extractMarkdownContent(extractedContent);
        } else {
          // For TSX/JSX files, try to extract title from file
          const fileContent = await Deno.readTextFile(entry.path);
          const titleMatch = fileContent.match(/<title>(.*?)<\/title>/);
          title = titleMatch ? titleMatch[1] : entry.name.replace(/\.(md|tsx|jsx)$/, "");
          
          // Extract text content - simplified approach
          const contentMatch = fileContent.match(/<main[^>]*>([\s\S]*?)<\/main>/);
          if (contentMatch) {
            // Strip HTML tags for basic text extraction
            content = contentMatch[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
          }
        }
        
        // Only add pages with actual content
        if (content.length > 0) {
          pages.push({
            id: `page-${entry.name.replace(/\.(md|tsx|jsx)$/, "")}`,
            title: title.charAt(0).toUpperCase() + title.slice(1),
            content,
            type: "page",
            url
          });
        }
      } catch (e) {
        console.error(`Error processing page ${entry.path}:`, e);
      }
    }
  }
  
  console.log(`Found ${pages.length} pages`);
  return pages;
}

/**
 * Fallback function to generate sample content if no content is found
 * @returns Array of sample content items
 */
function generateSampleContent(): ContentItem[] {
  console.warn("No content found, generating sample content instead");
  return [
    {
      id: "pub-1",
      title: "Automated Fish Classification Using Unprocessed Fatty Acid Chromatographic Data: A Machine Learning Approach",
      content: "Fish is approximately 40% edible fillet. The remaining 60% can be processed into low-value fertilizer or high-value pharmaceutical-grade omega-3 concentrates. High-value manufacturing options depend on the composition of the biomass, which varies with fish species, fish tissue and seasonally throughout the year.",
      type: "publication",
      url: "/publications/fish-classification",
      metadata: {
        year: "2022",
        journal: "Journal of Machine Learning for Biomedical Imaging"
      }
    },
    {
      id: "proj-1",
      title: "Fishy Business",
      content: "An ML-powered toolkit for automated analysis of fatty acid chromatographic data to classify fish species and quality.",
      type: "project",
      url: "/projects/fishy-business",
      metadata: {
        language: "Python",
        github: "https://github.com/woodRock/fishy-business"
      }
    },
    {
      id: "page-1",
      title: "Home",
      content: "Jesse Wood is a researcher and engineer specializing in machine learning and data science applications for marine biology and environmental science.",
      type: "page",
      url: "/"
    }
  ];
}

/**
 * Check if a directory exists
 * @param dir - Directory path to check
 * @returns Boolean indicating if directory exists
 */
async function directoryExists(dir: string): Promise<boolean> {
  try {
    const stat = await Deno.stat(dir);
    return stat.isDirectory;
  } catch (e) {
    return false;
  }
}

/**
 * Check if a file exists
 * @param filePath - File path to check
 * @returns Boolean indicating if file exists
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stat = await Deno.stat(filePath);
    return stat.isFile;
  } catch (e) {
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log("Collecting searchable content...");
  
  // Define content directories
  const baseDir = Deno.cwd();
  
  // Possible content directories to check
  const possibleDirs = [
    { path: `${baseDir}/routes`, type: "pages" },
    { path: `${baseDir}/pages`, type: "pages" }
  ];
  
  console.log("Checking for content directories...");
  
  // Find existing directories
  const contentDirs: Record<string, string> = {};
  for (const dir of possibleDirs) {
    if (await directoryExists(dir.path)) {
      console.log(`Found ${dir.type} directory at ${dir.path}`);
      contentDirs[dir.type] = dir.path;
    }
  }
  
  try {
    // Initialize arrays for each content type
    const publications: ContentItem[] = [];
    const projects: ContentItem[] = [];
    const pages: ContentItem[] = [];
    
    // Check for specific TSX files
    const routesDir = contentDirs["pages"]; // This should be the routes folder
    if (routesDir) {
      // Check for publications.tsx
      const publicationsTsxPath = `${routesDir}/publications.tsx`;
      if (await fileExists(publicationsTsxPath)) {
        console.log(`Found publications.tsx at ${publicationsTsxPath}`);
        const pubItems = await extractPublicationsFromTsx(publicationsTsxPath);
        publications.push(...pubItems);
      } else {
        console.log("publications.tsx not found.");
      }
      
      // Check for projects.tsx
      const projectsTsxPath = `${routesDir}/projects.tsx`;
      if (await fileExists(projectsTsxPath)) {
        console.log(`Found projects.tsx at ${projectsTsxPath}`);
        const projItems = await extractProjectsFromTsx(projectsTsxPath);
        projects.push(...projItems);
      } else {
        console.log("projects.tsx not found.");
      }
      
      // Collect regular pages
      const pageItems = await collectPages(routesDir);
      pages.push(...pageItems);
    } else {
      console.log("No routes directory found.");
    }
    
    // Combine all content
    let allContent = [...publications, ...projects, ...pages];
    
    // Use sample content if no content was found
    if (allContent.length === 0) {
      console.log("No content directories with valid content were found.");
      allContent = generateSampleContent();
    }
    
    // Create directory if it doesn't exist
    try {
      await Deno.mkdir("./static/data", { recursive: true });
    } catch (e) {
      // Directory already exists
      console.log("Directory already exists");
    }
    
    // Write content to JSON file
    const outputPath = "./static/data/searchable-content.json";
    await Deno.writeTextFile(
      outputPath, 
      JSON.stringify(allContent, null, 2)
    );
    
    console.log(`Generated searchable content with ${allContent.length} items`);
    console.log(`File saved to: ${outputPath}`);
  } catch (e) {
    console.error("Error collecting content:", e);
    // Fallback to sample content on error
    const sampleContent = generateSampleContent();
    
    try {
      await Deno.mkdir("./static/data", { recursive: true });
    } catch {
      // Directory already exists
    }
    
    const outputPath = "./static/data/searchable-content.json";
    await Deno.writeTextFile(
      outputPath, 
      JSON.stringify(sampleContent, null, 2)
    );
    
    console.log(`Generated fallback sample content with ${sampleContent.length} items`);
    console.log(`File saved to: ${outputPath}`);
  }
}

// Run the script
if (import.meta.main) {
  main().catch(e => {
    console.error("Script failed:", e);
    Deno.exit(1);
  });
}