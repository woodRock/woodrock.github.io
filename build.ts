/**
 * Static site build.
 *
 *   bun run build
 *
 * Reads the hand-written HTML in `src/`, fills the `{{placeholders}}` from the
 * JSON in `content/`, and writes the finished site to `docs/`, which GitHub
 * Pages serves. Everything in `src/public/` is copied across unchanged.
 */
import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";

const ROOT = import.meta.dir;
const SRC = join(ROOT, "src");
const CONTENT = join(ROOT, "content");
const OUT = join(ROOT, "docs");

interface Link {
  label: string;
  href: string;
}

interface Site {
  name: string;
  title: string;
  description: string;
  url: string;
  role: string;
  affiliation: string;
  location: string;
  tagline: string;
  email: string;
  links: Link[];
  about: string[];
  research: {
    intro: string[];
    code: Link;
    docs: Link;
  };
  repo: string;
}

interface Publication {
  id: string;
  year: number;
  title: string;
  venue: string;
  kind: string;
  abstract: string;
  pdf?: string;
  doi?: string | null;
  links: Link[];
  bibtex?: string | null;
}

interface Project {
  id?: string;
  title: string;
  tags: string[];
  href: string;
  description: string;
  links?: Link[];
}

/** Escape text for use inside HTML content or attribute values. */
function esc(value: string | number): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Split text on blank lines and wrap each block in a paragraph. */
function paragraphs(text: string): string {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${esc(p)}</p>`)
    .join("\n");
}

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}

function anchor(link: Link, extra = ""): string {
  const rel = isExternal(link.href) ? ' rel="noopener"' : "";
  return `<a href="${esc(link.href)}"${rel}${extra}>${esc(link.label)}</a>`;
}

function renderHeroLinks(site: Site): string {
  return site.links.map((l) => `<li>${anchor(l)}</li>`).join("\n        ");
}

function renderParagraphs(items: string[]): string {
  return items.map((p) => `<p>${esc(p)}</p>`).join("\n      ");
}

function renderPublication(pub: Publication): string {
  const primary = pub.links[0]?.href ?? (pub.pdf ? `/${pub.pdf}` : undefined);
  const title = primary
    ? `<a href="${esc(primary)}"${isExternal(primary) ? ' rel="noopener"' : ""}>${esc(pub.title)}</a>`
    : esc(pub.title);

  const actions: string[] = [];
  if (pub.pdf) actions.push(`<li><a href="/${esc(pub.pdf)}">PDF</a></li>`);
  for (const link of pub.links) actions.push(`<li>${anchor(link)}</li>`);
  if (pub.doi) {
    actions.push(`<li><a href="https://doi.org/${esc(pub.doi)}" rel="noopener">DOI</a></li>`);
  }
  const bib = pub.bibtex
    ? `\n          <details>\n            <summary>BibTeX</summary>\n            <pre>${esc(pub.bibtex)}</pre>\n          </details>`
    : "";

  return `<li class="pub" id="${esc(pub.id)}">
          <p class="meta"><time datetime="${pub.year}">${pub.year}</time> · ${esc(pub.kind)} · ${esc(pub.venue)}</p>
          <h3>${title}</h3>
          <details>
            <summary>Abstract</summary>
            ${paragraphs(pub.abstract).split("\n").join("\n            ")}
          </details>
          <ul class="actions" aria-label="Links for ${esc(pub.title)}">
            ${actions.join("\n            ")}
          </ul>${bib}
        </li>`;
}

function renderProject(project: Project): string {
  const id = project.id ? ` id="${esc(project.id)}"` : "";
  // Always spell the links out: "Website" when the title goes to a live site, then Source, Docs, Article...
  const isRepo = /^https?:\/\/(www\.)?github\.com\//.test(project.href);
  const extra = [...(isRepo ? [] : [{ label: "Website", href: project.href }]), ...(project.links ?? [])];
  const actions = extra.length
    ? `\n          <ul class="actions" aria-label="Links for ${esc(project.title)}">\n            ${extra
        .map((l) => `<li>${anchor(l)}</li>`)
        .join("\n            ")}\n          </ul>`
    : "";
  return `<li class="project"${id}>
          <h3>${anchor({ label: project.title, href: project.href })}</h3>
          <p class="tags">${project.tags.map(esc).join(" · ")}</p>
          <p>${esc(project.description)}</p>${actions}
        </li>`;
}

/** Replace every `{{key}}` in the template; unknown keys are an error. */
function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    if (!(key in values)) throw new Error(`No value for placeholder {{${key}}}`);
    return values[key];
  });
}

async function readJson<T>(name: string): Promise<T> {
  return (await Bun.file(join(CONTENT, name)).json()) as T;
}

export async function build(): Promise<void> {
  const started = performance.now();
  const site = await readJson<Site>("site.json");
  const publications = await readJson<Publication[]>("publications.json");
  const projects = await readJson<Project[]>("projects.json");

  publications.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  // Projects keep the order of content/projects.json; use `site move` to change it.

  const common: Record<string, string> = {
    name: esc(site.name),
    title: esc(site.title),
    description: esc(site.description),
    url: esc(site.url),
    year: String(new Date().getFullYear()),
    repo: esc(site.repo),
  };

  const indexValues: Record<string, string> = {
    ...common,
    role: esc(site.role),
    affiliation: esc(site.affiliation),
    location: esc(site.location),
    tagline: esc(site.tagline),
    email: esc(site.email),
    hero_links: renderHeroLinks(site),
    about: renderParagraphs(site.about),
    research: renderParagraphs(site.research.intro),
    research_code_href: esc(site.research.code.href),
    research_code_label: esc(site.research.code.label),
    research_docs_href: esc(site.research.docs.href),
    research_docs_label: esc(site.research.docs.label),
    publications: publications.map(renderPublication).join("\n        "),
    projects: projects.map(renderProject).join("\n        "),
  };

  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  // Static files first, so a generated page can never be overwritten by one.
  await cp(join(SRC, "public"), OUT, { recursive: true });
  await Bun.write(join(OUT, ".nojekyll"), "");

  for (const file of await readdir(SRC)) {
    const path = join(SRC, file);
    if ((await stat(path)).isDirectory()) continue;
    const text = await Bun.file(path).text();
    const values = file === "index.html" ? indexValues : common;
    const output = file.endsWith(".html") ? fill(text, values) : text;
    await Bun.write(join(OUT, file), output);
  }

  const ms = Math.round(performance.now() - started);
  console.log(`Built ${publications.length} publications and ${projects.length} projects into docs/ in ${ms}ms`);
}

if (import.meta.main) {
  await build();
}
