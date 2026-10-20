#!/usr/bin/env bun
/**
 * `site`: command-line CRUD for the website content.
 *
 *   bun run site --help
 *
 * Designed to be driven by people and by agents: every command accepts flags
 * instead of prompts, prints JSON when `--json` is given or stdout is not a
 * terminal, and exits 0 on success, 1 on a data error, 2 on a usage error.
 */
import {
  type Collection,
  type Item,
  ContentError,
  coerce,
  collections,
  find,
  format,
  getCollection,
  getPath,
  importPdf,
  load,
  loadSite,
  parseLoose,
  rebuild,
  save,
  saveSite,
  setPath,
  validate,
} from "./content";

const HELP = `site - manage the content of woodrock.github.io

Usage
  site list    <collection>                       List items (id and label)
  site get     <collection> <id>                  Show one item
  site add     <collection> [--field value ...]   Create an item
  site update  <collection> <id> [--field value]  Change fields of an item
  site remove  <collection> <id>                  Delete an item
  site schema  [collection]                       Describe the fields
  site config  get [path]                         Read content/site.json (dot path)
  site config  set <path> <value>                 Write content/site.json (JSON or string)
  site build                                      Rebuild docs/
  site tui                                        Open the terminal UI

Collections
  publications, projects

Options
  --json             Machine-readable output (default when stdout is not a TTY)
  --data '{...}'     Item fields as a JSON object (add, update). Reads stdin when
                     stdin is not a TTY and no --data or field flags are given.
  --unset <field>    Remove a field (update). Repeatable.
  --no-build         Skip rebuilding docs/ after a change
  --dry-run          Validate and print the result without writing anything
  -h, --help         Show this help (works after any command too)

Field flags
  --title "..." --year 2025 --tags Rust,Python --links "Publisher=https://x;DOI=https://y"
  --pdf ./paper.pdf copies the file into src/public and stores its file name.
  Text fields accept \\n for a line break.

Examples
  site list publications
  site add projects --title "Fish Finder" --href https://github.com/woodrock/fish-finder --tags Rust
  site update publications wood2025hook --doi 10.1007/s44295-025-00066-3
  echo '{"title":"X","href":"https://x.dev"}' | site add projects
  site config set tagline "I teach computers to read fish."
  site config get research.highlights.0
`;

interface Args {
  positional: string[];
  flags: Record<string, string | boolean | string[]>;
}

const BOOLEAN_FLAGS = new Set(["json", "no-build", "dry-run", "help", "h"]);

function parseArgs(argv: string[]): Args {
  const positional: string[] = [];
  const flags: Args["flags"] = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--") {
      positional.push(...argv.slice(i + 1));
      break;
    }
    if (arg === "-h") {
      flags.help = true;
      continue;
    }
    if (!arg.startsWith("--")) {
      positional.push(arg);
      continue;
    }
    const eq = arg.indexOf("=");
    let key = eq === -1 ? arg.slice(2) : arg.slice(2, eq);
    let value: string | boolean;
    if (eq !== -1) value = arg.slice(eq + 1);
    else if (BOOLEAN_FLAGS.has(key)) value = true;
    else {
      if (i + 1 >= argv.length) throw new ContentError(`--${key} needs a value`, 2);
      value = argv[++i];
    }
    if (key === "unset") {
      const list = (flags.unset as string[] | undefined) ?? [];
      list.push(String(value));
      flags.unset = list;
      continue;
    }
    flags[key] = value;
  }
  return { positional, flags };
}

const wantJson = (args: Args) => args.flags.json === true || !process.stdout.isTTY;

function out(args: Args, data: unknown, human: () => string): void {
  if (wantJson(args)) console.log(JSON.stringify(data, null, 2));
  else console.log(human());
}

function truncate(text: string, width: number): string {
  return text.length > width ? text.slice(0, Math.max(0, width - 1)) + "…" : text;
}

function table(rows: string[][]): string {
  const widths = rows[0].map((_, i) => Math.max(...rows.map((r) => r[i].length)));
  return rows.map((r) => r.map((cell, i) => cell.padEnd(widths[i])).join("  ").trimEnd()).join("\n");
}

/** Build a patch object from --data, stdin and field flags. */
async function readPatch(c: Collection, args: Args): Promise<Record<string, unknown>> {
  const patch: Record<string, unknown> = {};
  const fieldFlags = Object.keys(args.flags).filter((k) => !BOOLEAN_FLAGS.has(k) && k !== "data" && k !== "unset");

  let data = args.flags.data;
  if (data === undefined && fieldFlags.length === 0 && !process.stdin.isTTY) {
    data = (await Bun.stdin.text()).trim();
  }
  if (typeof data === "string" && data !== "") {
    let parsed: unknown;
    try {
      parsed = JSON.parse(data);
    } catch (e) {
      throw new ContentError(`--data is not valid JSON: ${(e as Error).message}`, 2);
    }
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new ContentError("--data must be a JSON object", 2);
    Object.assign(patch, parsed);
  }

  for (const key of fieldFlags) {
    const field = c.fields.find((f) => f.name === key);
    if (!field) throw new ContentError(`Unknown field --${key} for ${c.name}. See: site schema ${c.name}`, 2);
    patch[key] = coerce(field, String(args.flags[key]));
  }
  if (typeof patch.pdf === "string") patch.pdf = await importPdf(patch.pdf);
  return patch;
}

async function finish(c: Collection, items: Item[], args: Args, result: unknown, message: string): Promise<void> {
  if (args.flags["dry-run"]) {
    out(args, { dryRun: true, result }, () => `[dry run] ${message}`);
    return;
  }
  await save(c, items);
  if (!args.flags["no-build"]) await rebuild();
  out(args, result, () => message);
}

/* ---------------------------------------------------------------------------
   Commands
   --------------------------------------------------------------------------- */

async function list(args: Args): Promise<void> {
  const c = getCollection(args.positional[1]);
  const items = await load(c);
  out(
    args,
    items.map((i) => ({ id: i.id, label: c.label(i) })),
    () => {
      const width = (process.stdout.columns || 100) - 2;
      const idWidth = Math.max(2, ...items.map((i) => i.id.length));
      return table([["ID", "ITEM"], ...items.map((i) => [i.id, truncate(c.label(i), width - idWidth - 2)])]);
    },
  );
}

async function get(args: Args): Promise<void> {
  const c = getCollection(args.positional[1]);
  const id = args.positional[2];
  if (!id) throw new ContentError(`Usage: site get ${c.name} <id>`, 2);
  const item = find(await load(c), id);
  out(args, item, () => table(c.fields.filter((f) => item[f.name] !== undefined).map((f) => [f.name, format(f, item[f.name])])));
}

async function add(args: Args): Promise<void> {
  const c = getCollection(args.positional[1]);
  const items = await load(c);
  const patch = await readPatch(c, args);
  const item = { ...patch } as Item;
  if (!item.id) item.id = c.suggestId(item);
  const errors = validate(c, item, items);
  if (errors.length) throw new ContentError(`Cannot add ${c.name} item:\n  ${errors.join("\n  ")}`);
  items.push(item);
  await finish(c, items, args, item, `Added ${c.name}/${item.id}`);
}

async function update(args: Args): Promise<void> {
  const c = getCollection(args.positional[1]);
  const id = args.positional[2];
  if (!id) throw new ContentError(`Usage: site update ${c.name} <id> [--field value ...]`, 2);
  const items = await load(c);
  const current = find(items, id);
  const patch = await readPatch(c, args);
  const unset = (args.flags.unset as string[] | undefined) ?? [];
  if (Object.keys(patch).length === 0 && unset.length === 0) throw new ContentError("Nothing to change. Pass --field value, --data or --unset.", 2);

  const next = { ...current, ...patch } as Item;
  for (const key of unset) {
    if (key === "id") throw new ContentError("id cannot be unset", 2);
    delete next[key];
  }
  const errors = validate(c, next, items.filter((i) => i !== current));
  if (errors.length) throw new ContentError(`Cannot update ${c.name}/${id}:\n  ${errors.join("\n  ")}`);
  items[items.indexOf(current)] = next;
  await finish(c, items, args, next, `Updated ${c.name}/${next.id}`);
}

async function remove(args: Args): Promise<void> {
  const c = getCollection(args.positional[1]);
  const id = args.positional[2];
  if (!id) throw new ContentError(`Usage: site remove ${c.name} <id>`, 2);
  const items = await load(c);
  const item = find(items, id);
  await finish(c, items.filter((i) => i !== item), args, { removed: item }, `Removed ${c.name}/${id}`);
}

function schema(args: Args): void {
  const names = args.positional[1] ? [getCollection(args.positional[1]).name] : Object.keys(collections);
  const data = Object.fromEntries(names.map((n) => [n, collections[n].fields]));
  out(args, data, () =>
    names
      .map((n) => `${n}\n` + table(collections[n].fields.map((f) => [`  --${f.name}`, f.type + (f.required ? " (required)" : ""), f.help])))
      .join("\n\n"),
  );
}

async function config(args: Args): Promise<void> {
  const [, action, path, value] = args.positional;
  const site = await loadSite();
  if (action === "get" || action === undefined) {
    const result = getPath(site, path ?? "");
    if (result === undefined) throw new ContentError(`No value at "${path}"`);
    out(args, result, () => (typeof result === "string" ? result : JSON.stringify(result, null, 2)));
    return;
  }
  if (action === "set") {
    if (!path || value === undefined) throw new ContentError("Usage: site config set <path> <value>", 2);
    setPath(site, path, parseLoose(value));
    if (args.flags["dry-run"]) {
      out(args, { dryRun: true, path, value: getPath(site, path) }, () => `[dry run] ${path} = ${JSON.stringify(getPath(site, path))}`);
      return;
    }
    await saveSite(site);
    if (!args.flags["no-build"]) await rebuild();
    out(args, { path, value: getPath(site, path) }, () => `Set ${path}`);
    return;
  }
  throw new ContentError("Usage: site config get [path] | site config set <path> <value>", 2);
}

export async function main(argv: string[]): Promise<number> {
  let args: Args;
  try {
    args = parseArgs(argv);
    const command = args.positional[0];
    if (!command || args.flags.help) {
      console.log(HELP);
      return command || args.flags.help ? 0 : 2;
    }
    switch (command) {
      case "list": await list(args); break;
      case "get": await get(args); break;
      case "add": await add(args); break;
      case "update": await update(args); break;
      case "remove": await remove(args); break;
      case "schema": schema(args); break;
      case "config": await config(args); break;
      case "build": await rebuild(); break;
      case "tui": {
        const { run } = await import("./tui");
        await run();
        break;
      }
      default:
        throw new ContentError(`Unknown command "${command}". Run: site --help`, 2);
    }
    return 0;
  } catch (e) {
    const err = e as ContentError;
    const code = err instanceof ContentError ? err.exitCode : 1;
    if (!process.stdout.isTTY || process.argv.includes("--json")) {
      console.error(JSON.stringify({ error: err.message, exitCode: code }));
    } else {
      console.error(`error: ${err.message}`);
    }
    return code;
  }
}

if (import.meta.main) {
  process.exit(await main(process.argv.slice(2)));
}
