import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET() {
    const pdf = await Deno.readFile("./static/wood2022automated.pdf");
    return new Response(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=wood2022automated.pdf",
      },
    });
  },
};
