/**
 * Shared content layer for the CLI and TUI.
 *
 * Knows the shape of each collection in `content/`, validates items, writes
 * them back in a stable order and rebuilds `docs/`. No dependencies.
 */
import { copyFile } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

export const ROOT = resolve(import.meta.dir, "..");
export const CONTENT = join(ROOT, "content");
export const PUBLIC = join(ROOT, "src", "public");

export type FieldType = "string" | "text" | "number" | "tags" | "links" | "pdf";

export interface Field {
  name: string;
  type: FieldType;
  required?: boolean;
  help: string;
}

export interface Link {
  label: string;
  href: string;
}

export type Item = Record<string, unknown> & { id: string };

export interface Collection {
  name: string;
  file: string;
  fields: Field[];
  /** Stable order used when writing the file. Omitted when the file order is the display order. */
  sort?: (a: Item, b: Item) => number;
  /** One-line label for lists. */
  label: (item: Item) => string;
  /** Suggest an id for a new item without one. */
  suggestId: (item: Partial<Item>) => string;
}

export class ContentError extends Error {
  constructor(message: string, public readonly exitCode = 1) {
    super(message);
  }
}

/* ---------------------------------------------------------------------------
   Schemas
   --------------------------------------------------------------------------- */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const STOP = new Set(["a", "an", "the", "of", "for", "and", "in", "on", "to", "using", "with", "via"]);

function keyword(title: string): string {
  const words = title.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  return words.find((w) => !STOP.has(w)) ?? "untitled";
}

export const publications: Collection = {
  name: "publications",
  file: "publications.json",
  fields: [
    { name: "id", type: "string", help: "Unique key, e.g. wood2025hook. Defaults to the BibTeX key or author+year+keyword." },
    { name: "year", type: "number", required: true, help: "Publication year." },
    { name: "title", type: "string", required: true, help: "Full title." },
    { name: "kind", type: "string", required: true, help: "Journal article, Conference paper, PhD thesis, Preprint, ..." },
    { name: "venue", type: "string", required: true, help: "Journal, conference or institution." },
    { name: "abstract", type: "text", help: "Abstract. Blank lines separate paragraphs." },
    { name: "pdf", type: "pdf", help: "File name in src/public. Pass a path to copy the file in." },
    { name: "doi", type: "string", help: "DOI without the https://doi.org/ prefix." },
    { name: "links", type: "links", help: "Extra links as Label=https://url;Other=https://url" },
    { name: "bibtex", type: "text", help: "BibTeX entry used by the Copy BibTeX button." },
  ],
  sort: (a, b) => Number(b.year) - Number(a.year) || String(a.title).localeCompare(String(b.title)),
  label: (item) => `${item.year}  ${item.title}`,
  suggestId: (item) => {
    const key = typeof item.bibtex === "string" ? /@\w+\{([^,\s]+)/.exec(item.bibtex)?.[1] : undefined;
    if (key) return key;
    const author = typeof item.bibtex === "string" ? /author\s*=\s*\{([^,}]+)/.exec(item.bibtex)?.[1] : undefined;
    return slugify(`${author ?? "wood"}${item.year ?? ""}${keyword(String(item.title ?? ""))}`).replace(/-/g, "");
  },
};

export const projects: Collection = {
  name: "projects",
  file: "projects.json",
  fields: [
    { name: "id", type: "string", help: "Unique slug. Defaults to a slug of the title." },
    { name: "title", type: "string", required: true, help: "Project name." },
    { name: "href", type: "string", required: true, help: "Primary link: the live website if there is one, otherwise the repository." },
    { name: "tags", type: "tags", help: "Comma-separated technologies, e.g. Rust,Python" },
    { name: "description", type: "text", help: "One or two sentences." },
    { name: "links", type: "links", help: "Extra links as Source=https://github.com/...;Docs=https://..." },
  ],
  label: (item) => String(item.title),
  suggestId: (item) => slugify(String(item.title ?? "untitled")),
};

export const collections: Record<string, Collection> = { publications, projects };

export function getCollection(name: string | undefined): Collection {
  const c = name ? collections[name] : undefined;
  if (!c) {
    throw new ContentError(`Unknown collection "${name ?? ""}". Choose one of: ${Object.keys(collections).join(", ")}`, 2);
  }
  return c;
}

/* ---------------------------------------------------------------------------
   Load and save
   --------------------------------------------------------------------------- */

export async function load(c: Collection): Promise<Item[]> {
  const items = (await Bun.file(join(CONTENT, c.file)).json()) as Item[];
  return items.map((item) => ({ ...item, id: String(item.id ?? c.suggestId(item)) }));
}

export async function save(c: Collection, items: Item[]): Promise<void> {
  const sorted = c.sort ? [...items].sort(c.sort) : [...items];
  const ordered = sorted.map((item) => orderFields(c, item));
  await Bun.write(join(CONTENT, c.file), JSON.stringify(ordered, null, 2) + "\n");
}

/** Keep keys in schema order so diffs stay readable. */
function orderFields(c: Collection, item: Item): Item {
  const out: Record<string, unknown> = {};
  for (const f of c.fields) if (f.name in item) out[f.name] = item[f.name];
  for (const k of Object.keys(item)) if (!(k in out)) out[k] = item[k];
  return out as Item;
}

/**
 * Move an item within a manually ordered collection. `target` is a 1-based
 * position, "top", "bottom", "up", "down", "before:<id>" or "after:<id>".
 * Returns the item's new 1-based position.
 */
export function move(c: Collection, items: Item[], id: string, target: string): number {
  if (c.sort) throw new ContentError(`${c.name} are sorted automatically and cannot be reordered`, 2);
  const from = items.findIndex((i) => i.id === id);
  if (from === -1) throw new ContentError(`No item with id "${id}". Use "list" to see ids.`);
  const last = items.length - 1;
  let to: number;
  if (target === "top") to = 0;
  else if (target === "bottom") to = last;
  else if (target === "up") to = Math.max(0, from - 1);
  else if (target === "down") to = Math.min(last, from + 1);
  else if (target.startsWith("before:") || target.startsWith("after:")) {
    const [rel, otherId] = target.split(":", 2);
    const other = items.findIndex((i) => i.id === otherId);
    if (other === -1) throw new ContentError(`No item with id "${otherId}"`);
    to = rel === "before" ? other : other + 1;
    if (to > from) to--;
  } else if (/^\d+$/.test(target)) {
    to = Math.min(last, Math.max(0, Number(target) - 1));
  } else {
    throw new ContentError(`Bad position "${target}". Use a number, top, bottom, up, down, before:<id> or after:<id>`, 2);
  }
  const [item] = items.splice(from, 1);
  items.splice(to, 0, item);
  return to + 1;
}

export function find(items: Item[], id: string): Item {
  const item = items.find((i) => i.id === id);
  if (!item) throw new ContentError(`No item with id "${id}". Use "list" to see ids.`);
  return item;
}

/* ---------------------------------------------------------------------------
   Parsing and formatting field values
   --------------------------------------------------------------------------- */

export function parseLinks(raw: string): Link[] {
  return raw
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const eq = pair.indexOf("=");
      if (eq < 1) throw new ContentError(`Bad link "${pair}". Use Label=https://url`, 2);
      return { label: pair.slice(0, eq).trim(), href: pair.slice(eq + 1).trim() };
    });
}

/** Turn a string from a flag or editor into the field's native value. */
export function coerce(field: Field, raw: string): unknown {
  const text = raw.trim();
  switch (field.type) {
    case "number": {
      if (text === "") return undefined;
      const n = Number(text);
      if (!Number.isFinite(n)) throw new ContentError(`${field.name} must be a number, got "${raw}"`, 2);
      return n;
    }
    case "tags":
      return text === "" ? [] : text.split(",").map((t) => t.trim()).filter(Boolean);
    case "links":
      return parseLinks(text);
    case "text":
      return raw.replace(/\\n/g, "\n").trim() || undefined;
    default:
      return text === "" ? undefined : text;
  }
}

/** Human-readable, single-line form of a value (the inverse of `coerce`). */
export function format(field: Field, value: unknown): string {
  if (value === undefined || value === null) return "";
  switch (field.type) {
    case "tags":
      return Array.isArray(value) ? value.join(", ") : String(value);
    case "links":
      return Array.isArray(value) ? (value as Link[]).map((l) => `${l.label}=${l.href}`).join("; ") : String(value);
    case "text":
      return String(value).replace(/\n/g, "\\n");
    default:
      return String(value);
  }
}

/* ---------------------------------------------------------------------------
   Validation
   --------------------------------------------------------------------------- */

export function validate(c: Collection, item: Item, others: Item[]): string[] {
  const errors: string[] = [];
  if (!item.id || typeof item.id !== "string") errors.push("id is required");
  else if (others.some((o) => o.id === item.id)) errors.push(`id "${item.id}" is already used`);

  for (const f of c.fields) {
    const v = item[f.name];
    const missing = v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0 && f.required);
    if (f.required && missing) {
      errors.push(`${f.name} is required`);
      continue;
    }
    if (v === undefined || v === null) continue;
    switch (f.type) {
      case "number":
        if (typeof v !== "number") errors.push(`${f.name} must be a number`);
        break;
      case "tags":
        if (!Array.isArray(v) || !v.every((t) => typeof t === "string")) errors.push(`${f.name} must be a list of strings`);
        break;
      case "links":
        if (!Array.isArray(v) || !v.every((l) => l && typeof l.label === "string" && typeof l.href === "string")) {
          errors.push(`${f.name} must be a list of {label, href}`);
        }
        break;
      default:
        if (typeof v !== "string") errors.push(`${f.name} must be a string`);
    }
  }
  const known = new Set(c.fields.map((f) => f.name));
  for (const k of Object.keys(item)) if (!known.has(k)) errors.push(`unknown field "${k}"`);
  return errors;
}

/** Copy a PDF into src/public if `value` is a path; return the file name to store. */
export async function importPdf(value: string): Promise<string> {
  if (!value.includes("/") && !value.includes("\\")) return value;
  const source = resolve(value);
  if (!(await Bun.file(source).exists())) throw new ContentError(`PDF not found: ${source}`);
  const name = basename(source);
  await copyFile(source, join(PUBLIC, name));
  return name;
}

/* ---------------------------------------------------------------------------
   Site settings (content/site.json) addressed by dot paths
   --------------------------------------------------------------------------- */

const SITE_FILE = join(CONTENT, "site.json");

export async function loadSite(): Promise<Record<string, unknown>> {
  return (await Bun.file(SITE_FILE).json()) as Record<string, unknown>;
}

export async function saveSite(site: Record<string, unknown>): Promise<void> {
  await Bun.write(SITE_FILE, JSON.stringify(site, null, 2) + "\n");
}

export function getPath(obj: unknown, path: string): unknown {
  if (!path) return obj;
  return path.split(".").reduce<unknown>((cur, key) => {
    if (cur === null || typeof cur !== "object") return undefined;
    return (cur as Record<string, unknown>)[key];
  }, obj);
}

export function setPath(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split(".");
  let cur: Record<string, unknown> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (cur[key] === null || typeof cur[key] !== "object") cur[key] = /^\d+$/.test(keys[i + 1]) ? [] : {};
    cur = cur[key] as Record<string, unknown>;
  }
  cur[keys[keys.length - 1]] = value;
}

/** Parse a CLI value for site.json: JSON when it parses, otherwise a string. */
export function parseLoose(raw: string): unknown {
  const t = raw.trim();
  if (/^(\{|\[|"|-?\d|true$|false$|null$)/.test(t)) {
    try {
      return JSON.parse(t);
    } catch {
      /* fall through to string */
    }
  }
  return raw;
}

/* ---------------------------------------------------------------------------
   Build
   --------------------------------------------------------------------------- */

export async function rebuild(): Promise<void> {
  const { build } = await import(join(ROOT, "build.ts"));
  await build();
}
