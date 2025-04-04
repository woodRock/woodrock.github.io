// routes/api/check-file.ts
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req) {
    try {
      const url = new URL(req.url);
      const filePath = url.searchParams.get("path") || "./static/data/searchable-content.json";
      
      console.log(`Checking file: ${filePath}`);
      
      try {
        const stat = await Deno.stat(filePath);
        const isFile = stat.isFile;
        const fileSize = stat.size;
        
        if (isFile) {
          try {
            const content = await Deno.readTextFile(filePath);
            const firstChars = content.substring(0, 200);
            const isJson = content.trim().startsWith('[') || content.trim().startsWith('{');
            
            return new Response(JSON.stringify({
              exists: true,
              isFile,
              fileSize,
              firstChars,
              isJson,
              contentLength: content.length
            }), {
              headers: { "Content-Type": "application/json" }
            });
          } catch (readError) {
            return new Response(JSON.stringify({
              exists: true,
              isFile,
              fileSize,
              error: `Could not read file: ${readError.message}`
            }), {
              headers: { "Content-Type": "application/json" }
            });
          }
        } else {
          return new Response(JSON.stringify({
            exists: true,
            isFile: false,
            message: "Path exists but is not a file"
          }), {
            headers: { "Content-Type": "application/json" }
          });
        }
      } catch (statError) {
        // List all files in static/data directory if possible
        const files = [];
        try {
          for await (const entry of Deno.readDir("./static/data")) {
            files.push({
              name: entry.name,
              isFile: entry.isFile,
              isDirectory: entry.isDirectory
            });
          }
        } catch (readDirError) {
          console.error("Could not read directory:", readDirError);
        }
        
        return new Response(JSON.stringify({
          exists: false,
          error: statError.message,
          files: files
        }), {
          headers: { "Content-Type": "application/json" }
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({
        error: error.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};