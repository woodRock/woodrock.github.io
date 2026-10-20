/**
 * Local preview.
 *
 *   bun run dev
 *
 * Builds the site, serves `docs/` on http://localhost:3000 and rebuilds
 * whenever something in `src/` or `content/` changes.
 */
import { watch } from "node:fs";
import { join } from "node:path";
import { build } from "./build";

const ROOT = import.meta.dir;
const OUT = join(ROOT, "docs");
const PORT = Number(process.env.PORT ?? 3000);

await build();

let pending: ReturnType<typeof setTimeout> | undefined;
for (const dir of ["src", "content"]) {
  watch(join(ROOT, dir), { recursive: true }, () => {
    clearTimeout(pending);
    pending = setTimeout(() => build().catch((err) => console.error(err)), 50);
  });
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let path = decodeURIComponent(url.pathname);
    if (path.endsWith("/")) path += "index.html";

    const file = Bun.file(join(OUT, path));
    if (await file.exists()) return new Response(file);

    return new Response(Bun.file(join(OUT, "404.html")), {
      status: 404,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  },
});

console.log(`Serving docs/ at http://localhost:${PORT}`);
