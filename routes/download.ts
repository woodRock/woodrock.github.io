import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const filename = url.searchParams.get("filename");
    
    if (!filename) {
      return new Response("Filename parameter is required", { status: 400 });
    }
    
    try {
      const pdf = await Deno.readFile(`./static/${filename}`);
      
      // Get just the base filename without path information for security
      const safeFilename = filename.split("/").pop();
      
      return new Response(pdf, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=${safeFilename}`,
        },
      });
    } catch (error) {
      console.error(`Error reading file: ${error.message}`);
      return new Response("File not found", { status: 404 });
    }
  },
};