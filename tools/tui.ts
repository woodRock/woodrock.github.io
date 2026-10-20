/**
 * `site tui`: a small terminal UI for browsing and editing the content.
 *
 * Raw-mode keyboard input and ANSI escapes only. No dependencies.
 *
 *   ↑/↓ or j/k  move        ⏎  edit        n  new       d  delete
 *   K/J         reorder     /  filter      b  build     q  quit
 *   tab         collection
 */
import {
  type Collection,
  type Item,
  coerce,
  collections,
  format,
  importPdf,
  load,
  move,
  rebuild,
  save,
  validate,
} from "./content";

const ESC = "\x1b";
const CSI = `${ESC}[`;
const style = {
  reset: `${CSI}0m`,
  bold: `${CSI}1m`,
  dim: `${CSI}2m`,
  reverse: `${CSI}7m`,
  red: `${CSI}31m`,
  green: `${CSI}32m`,
  yellow: `${CSI}33m`,
  cyan: `${CSI}36m`,
};

type Mode = "list" | "edit" | "confirm-delete";

interface EditState {
  original: Item | null;
  values: string[];
  field: number;
  typing: boolean;
  buffer: string;
  cursor: number;
}

class Tui {
  private names = Object.keys(collections);
  private col = 0;
  private items: Item[] = [];
  private filtered: Item[] = [];
  private selected = 0;
  private scroll = 0;
  private filter = "";
  private filtering = false;
  private mode: Mode = "list";
  private edit: EditState | null = null;
  private status = "";
  private statusKind: "info" | "ok" | "error" = "info";
  private dirty = false;
  private resolveExit!: () => void;

  get collection(): Collection {
    return collections[this.names[this.col]];
  }

  get current(): Item | undefined {
    return this.filtered[this.selected];
  }

  /* --------------------------------------------------------------- lifecycle */

  async start(): Promise<void> {
    await this.reload();
    const done = new Promise<void>((resolve) => (this.resolveExit = resolve));
    process.stdout.write(`${CSI}?1049h${CSI}?25l`);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    const onData = (chunk: string) => this.onInput(chunk).catch((e) => this.say(String(e), "error"));
    const onResize = () => this.render();
    process.stdin.on("data", onData);
    process.stdout.on("resize", onResize);
    process.on("SIGWINCH", onResize);
    this.render();
    await done;
    process.stdin.off("data", onData);
    process.stdout.off("resize", onResize);
    process.off("SIGWINCH", onResize);
    process.stdin.setRawMode(false);
    process.stdin.pause();
    process.stdout.write(`${CSI}?25h${CSI}?1049l`);
  }

  private async reload(): Promise<void> {
    this.items = await load(this.collection);
    this.applyFilter();
  }

  private applyFilter(): void {
    const q = this.filter.toLowerCase();
    this.filtered = q ? this.items.filter((i) => this.collection.label(i).toLowerCase().includes(q) || i.id.includes(q)) : this.items;
    this.selected = Math.min(this.selected, Math.max(0, this.filtered.length - 1));
  }

  private say(message: string, kind: "info" | "ok" | "error" = "info"): void {
    this.status = message;
    this.statusKind = kind;
    this.render();
  }

  /* ------------------------------------------------------------------ input */

  private async onInput(chunk: string): Promise<void> {
    if (chunk === "\x03") return this.quit();
    if (this.mode === "edit") return this.onEditKey(chunk);
    if (this.mode === "confirm-delete") return this.onConfirmKey(chunk);
    if (this.filtering) return this.onFilterKey(chunk);
    await this.onListKey(chunk);
  }

  private quit(): void {
    this.resolveExit();
  }

  private async onListKey(key: string): Promise<void> {
    switch (key) {
      case "q":
        return this.quit();
      case "\t":
      case `${CSI}C`:
        this.col = (this.col + 1) % this.names.length;
        this.selected = 0;
        this.scroll = 0;
        await this.reload();
        return this.render();
      case `${CSI}Z`:
      case `${CSI}D`:
        this.col = (this.col + this.names.length - 1) % this.names.length;
        this.selected = 0;
        this.scroll = 0;
        await this.reload();
        return this.render();
      case `${CSI}A`:
      case "k":
        this.selected = Math.max(0, this.selected - 1);
        return this.render();
      case `${CSI}B`:
      case "j":
        this.selected = Math.min(this.filtered.length - 1, this.selected + 1);
        return this.render();
      case "g":
      case `${CSI}H`:
        this.selected = 0;
        return this.render();
      case "G":
      case `${CSI}F`:
        this.selected = Math.max(0, this.filtered.length - 1);
        return this.render();
      case "K":
      case "J":
        return this.reorder(key === "K" ? "up" : "down");
      case "/":
        this.filtering = true;
        return this.say("filter: type to narrow, ⏎ to keep, esc to clear");
      case "\r":
      case "e":
        if (this.current) this.beginEdit(this.current);
        return;
      case "n":
        return this.beginEdit(null);
      case "d":
        if (!this.current) return;
        this.mode = "confirm-delete";
        return this.say(`Delete ${this.collection.name}/${this.current.id}? y/N`, "error");
      case "b":
        return this.build();
      case "r":
        await this.reload();
        return this.say("Reloaded from disk", "ok");
      default:
        return;
    }
  }

  private async reorder(direction: "up" | "down"): Promise<void> {
    const item = this.current;
    if (!item) return;
    if (this.collection.sort) return this.say(`${this.collection.name} are sorted automatically`, "error");
    if (this.filter) return this.say("Clear the filter before reordering", "error");
    const position = move(this.collection, this.items, item.id, direction);
    await save(this.collection, this.items);
    this.applyFilter();
    this.selected = position - 1;
    this.dirty = true;
    this.say(`Moved ${item.id} to position ${position}  (b to rebuild)`, "ok");
  }

  private onFilterKey(key: string): void {
    if (key === "\r") this.filtering = false;
    else if (key === ESC) {
      this.filter = "";
      this.filtering = false;
    } else if (key === "\x7f" || key === "\b") this.filter = this.filter.slice(0, -1);
    else if (!key.startsWith(ESC) && key >= " ") this.filter += key;
    this.applyFilter();
    this.status = "";
    this.render();
  }

  private async onConfirmKey(key: string): Promise<void> {
    this.mode = "list";
    if (key.toLowerCase() !== "y" || !this.current) return this.say("Cancelled");
    const id = this.current.id;
    this.items = this.items.filter((i) => i.id !== id);
    await save(this.collection, this.items);
    this.applyFilter();
    this.dirty = true;
    this.say(`Removed ${this.collection.name}/${id}  (b to rebuild)`, "ok");
  }

  /* ------------------------------------------------------------------- edit */

  private beginEdit(item: Item | null): void {
    this.mode = "edit";
    this.edit = {
      original: item,
      values: this.collection.fields.map((f) => (item ? format(f, item[f.name]) : "")),
      field: item ? 1 : 1,
      typing: false,
      buffer: "",
      cursor: 0,
    };
    this.say(item ? `Editing ${this.collection.name}/${item.id}` : `New ${this.collection.name.replace(/s$/, "")}. Leave id blank to generate one.`);
  }

  private async onEditKey(key: string): Promise<void> {
    const e = this.edit!;
    const fields = this.collection.fields;

    if (e.typing) {
      switch (key) {
        case "\r":
          e.values[e.field] = e.buffer;
          e.typing = false;
          return this.render();
        case ESC:
          e.typing = false;
          return this.render();
        case `${CSI}D`:
          e.cursor = Math.max(0, e.cursor - 1);
          return this.render();
        case `${CSI}C`:
          e.cursor = Math.min(e.buffer.length, e.cursor + 1);
          return this.render();
        case `${CSI}H`:
        case "\x01":
          e.cursor = 0;
          return this.render();
        case `${CSI}F`:
        case "\x05":
          e.cursor = e.buffer.length;
          return this.render();
        case "\x7f":
        case "\b":
          if (e.cursor > 0) {
            e.buffer = e.buffer.slice(0, e.cursor - 1) + e.buffer.slice(e.cursor);
            e.cursor--;
          }
          return this.render();
        case `${CSI}3~`:
          e.buffer = e.buffer.slice(0, e.cursor) + e.buffer.slice(e.cursor + 1);
          return this.render();
        case "\x15":
          e.buffer = "";
          e.cursor = 0;
          return this.render();
        default:
          if (key.startsWith(ESC)) return;
          const text = key.replace(/\r?\n/g, "\\n").replace(/[\x00-\x1f]/g, "");
          e.buffer = e.buffer.slice(0, e.cursor) + text + e.buffer.slice(e.cursor);
          e.cursor += text.length;
          return this.render();
      }
    }

    switch (key) {
      case ESC:
      case "q":
        this.mode = "list";
        this.edit = null;
        return this.say("Edit cancelled");
      case `${CSI}A`:
      case "k":
        e.field = Math.max(0, e.field - 1);
        return this.render();
      case `${CSI}B`:
      case "j":
      case "\t":
        e.field = Math.min(fields.length - 1, e.field + 1);
        return this.render();
      case "\r":
        e.typing = true;
        e.buffer = e.values[e.field];
        e.cursor = e.buffer.length;
        return this.render();
      case "s":
        return this.commitEdit();
      default:
        return;
    }
  }

  private async commitEdit(): Promise<void> {
    const e = this.edit!;
    const c = this.collection;
    const item: Record<string, unknown> = {};
    try {
      c.fields.forEach((f, i) => {
        const value = coerce(f, e.values[i]);
        if (value !== undefined && !(Array.isArray(value) && value.length === 0 && !e.values[i].trim())) item[f.name] = value;
      });
      if (typeof item.pdf === "string") item.pdf = await importPdf(item.pdf);
    } catch (err) {
      return this.say((err as Error).message, "error");
    }
    if (!item.id) item.id = c.suggestId(item);
    const next = item as Item;
    const others = this.items.filter((i) => i !== e.original);
    const errors = validate(c, next, others);
    if (errors.length) return this.say(errors.join("; "), "error");

    if (e.original) this.items[this.items.indexOf(e.original)] = next;
    else this.items.push(next);
    if (c.sort) this.items.sort(c.sort);
    await save(c, this.items);
    this.applyFilter();
    this.selected = Math.max(0, this.filtered.indexOf(next));
    this.mode = "list";
    this.edit = null;
    this.dirty = true;
    this.say(`Saved ${c.name}/${next.id}  (b to rebuild)`, "ok");
  }

  private async build(): Promise<void> {
    this.say("Building docs/…");
    try {
      await rebuild();
      this.dirty = false;
      this.say("Built docs/", "ok");
    } catch (err) {
      this.say(`Build failed: ${(err as Error).message}`, "error");
    }
  }

  /* ----------------------------------------------------------------- render */

  private render(): void {
    const cols = process.stdout.columns || 80;
    const rows = process.stdout.rows || 24;
    const lines = this.mode === "edit" ? this.renderEdit(cols, rows) : this.renderList(cols, rows);

    const out: string[] = [`${CSI}H`];
    for (let i = 0; i < rows; i++) {
      out.push(`${CSI}${i + 1};1H${CSI}2K${lines[i] ?? ""}`);
    }

    const e = this.edit;
    if (this.mode === "edit" && e?.typing) {
      const row = rows - 1;
      const prefix = `${this.collection.fields[e.field].name}> `;
      const width = cols - prefix.length - 1;
      const start = Math.max(0, e.cursor - width + 1);
      out.push(`${CSI}${row};${prefix.length + 1 + (e.cursor - start)}H${CSI}?25h`);
    } else if (this.filtering) {
      out.push(`${CSI}${rows};${("/" + this.filter).length + 1}H${CSI}?25h`);
    } else {
      out.push(`${CSI}?25l`);
    }
    process.stdout.write(out.join(""));
  }

  private statusLine(cols: number): string {
    const color = this.statusKind === "ok" ? style.green : this.statusKind === "error" ? style.red : style.dim;
    const text = this.filtering ? `/${this.filter}` : this.status;
    const flag = this.dirty && !this.filtering ? `${style.yellow} unbuilt changes${style.reset}` : "";
    return `${color}${clip(text, cols - 20)}${style.reset}${flag}`;
  }

  private renderList(cols: number, rows: number): string[] {
    const c = this.collection;
    const tabs = this.names
      .map((n, i) => (i === this.col ? `${style.reverse} ${n} ${style.reset}` : `${style.dim} ${n} ${style.reset}`))
      .join("");
    const reorder = c.sort ? "" : "  K/J reorder";
    const help = `${style.dim}↑↓ move  ⏎ edit  n new  d delete${reorder}  / filter  tab switch  b build  q quit${style.reset}`;
    const lines: string[] = [`${style.bold}site${style.reset}  ${tabs}  ${help}`, rule(cols)];

    const detailRows = Math.min(c.fields.length, Math.max(4, Math.floor(rows / 3)));
    const listRows = rows - 2 - 1 - detailRows - 1;

    if (this.selected < this.scroll) this.scroll = this.selected;
    if (this.selected >= this.scroll + listRows) this.scroll = this.selected - listRows + 1;

    if (this.filtered.length === 0) lines.push(`${style.dim}  (no ${c.name}${this.filter ? " match the filter" : ""})${style.reset}`);
    for (let i = this.scroll; i < Math.min(this.filtered.length, this.scroll + listRows); i++) {
      const item = this.filtered[i];
      const label = clip(`${c.label(item)}  ${style.dim}${item.id}${style.reset}`, cols - 4);
      lines.push(i === this.selected ? `${style.reverse}> ${pad(clip(c.label(item), cols - 4), cols - 2)}${style.reset}` : `  ${label}`);
    }
    while (lines.length < 2 + listRows) lines.push("");

    lines.push(rule(cols));
    const item = this.current;
    if (item) {
      for (const f of c.fields.slice(0, detailRows)) {
        lines.push(clip(`${style.cyan}${f.name.padEnd(10)}${style.reset} ${format(f, item[f.name])}`, cols - 1));
      }
    }
    while (lines.length < rows - 1) lines.push("");
    lines.push(this.statusLine(cols));
    return lines;
  }

  private renderEdit(cols: number, rows: number): string[] {
    const c = this.collection;
    const e = this.edit!;
    const title = e.original ? `${c.name}/${e.original.id}` : `new ${c.name.replace(/s$/, "")}`;
    const help = `${style.dim}↑↓ field  ⏎ edit value  s save  esc cancel${style.reset}`;
    const lines: string[] = [`${style.bold}edit${style.reset}  ${title}  ${help}`, rule(cols)];

    c.fields.forEach((f, i) => {
      const value = i === e.field && e.typing ? e.buffer : e.values[i];
      const name = `${f.name}${f.required ? "*" : ""}`.padEnd(11);
      const row = `${name} ${value || `${style.dim}${f.help}${style.reset}`}`;
      lines.push(i === e.field ? `${style.reverse}${pad(clip(row, cols - 1), cols - 1)}${style.reset}` : clip(row, cols - 1));
    });

    while (lines.length < rows - 2) lines.push("");
    if (e.typing) {
      const prefix = `${c.fields[e.field].name}> `;
      const width = cols - prefix.length - 1;
      const start = Math.max(0, e.cursor - width + 1);
      lines.push(`${style.bold}${prefix}${style.reset}${e.buffer.slice(start, start + width)}`);
    } else {
      lines.push(`${style.dim}${c.fields[e.field].help}${style.reset}`);
    }
    lines.push(this.statusLine(cols));
    return lines;
  }
}

/* ------------------------------------------------------------------ helpers */

const ANSI = /\x1b\[[0-9;?]*[A-Za-z]/g;
const visible = (s: string) => s.replace(ANSI, "").length;

function clip(s: string, width: number): string {
  if (visible(s) <= width) return s;
  let out = "";
  let seen = 0;
  for (const part of s.split(/(\x1b\[[0-9;?]*[A-Za-z])/)) {
    if (part.startsWith(ESC)) {
      out += part;
      continue;
    }
    const room = width - 1 - seen;
    if (room <= 0) break;
    out += part.slice(0, room);
    seen += Math.min(part.length, room);
  }
  return out + "…" + style.reset;
}

function pad(s: string, width: number): string {
  return s + " ".repeat(Math.max(0, width - visible(s)));
}

function rule(cols: number): string {
  return `${style.dim}${"─".repeat(cols)}${style.reset}`;
}

export async function run(): Promise<void> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error("The TUI needs an interactive terminal. Use the CLI commands instead: site --help");
  }
  await new Tui().start();
}

if (import.meta.main) {
  await run();
}
