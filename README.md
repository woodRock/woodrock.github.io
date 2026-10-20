# woodrock.github.io

Personal site for Jesse Wood: research, publications, projects and contact.

Plain HTML, CSS and JavaScript. No framework and no runtime dependencies.
A small [Bun](https://bun.sh) script fills the page from JSON content and
writes the finished site to `docs/`, which GitHub Pages serves from the
`main` branch.

## Layout

```
content/      Editable content (site.json, publications.json, projects.json)
src/          Hand-written pages, styles and script
  index.html  Page template with {{placeholders}} for content
  404.html    Not-found page
  styles.css
  main.js     Theme toggle, active nav link, copy BibTeX, contact form
  public/     Copied as-is into docs/ (PDFs, favicon)
build.ts      Renders src/ + content/ into docs/
dev.ts        Local preview with rebuild on change
tools/        `site` CLI and TUI for editing content (cli.ts, tui.ts, content.ts)
docs/         Build output. Committed, served by GitHub Pages.
```

## Working on the site

```sh
bun install        # once, for editor types only
bun run dev        # build, serve on http://localhost:3000, rebuild on change
bun run build      # one-off build into docs/
```

Commit `docs/` together with the source change. CI runs `bun run check`,
which rebuilds and fails if the committed `docs/` differs from the source.

## Editing content

Use the `site` command. It validates against the schema, keeps the JSON files
in a stable order and rebuilds `docs/` after every change.

```sh
bun run site --help
bun run site list publications
bun run site get publications wood2025hook
bun run site add projects --title "Fish Finder" --href https://github.com/woodrock/fish-finder --tags Rust
bun run site update publications wood2025hook --doi 10.1007/s44295-025-00066-3
bun run site remove projects fish-finder
bun run site add publications --pdf ~/Downloads/paper.pdf --title "..." --year 2026 --kind "Journal article" --venue "..."
bun run site config set tagline "I teach computers to read fish."
bun run site schema            # every field, its type and what it means
```

The CLI is built for automation as much as for people: output is JSON when
`--json` is passed or stdout is not a terminal, items can be piped in as JSON
on stdin or passed with `--data '{...}'`, `--dry-run` validates without
writing, and the exit code is 0 on success, 1 for a data error and 2 for a
usage error.

For a quick look around, `bun run tui` opens a terminal UI: arrow keys to
move, Tab to switch between publications and projects, Enter to edit,
`n` for new, `d` to delete, `/` to filter, `b` to rebuild, `q` to quit.

Editing the JSON in `content/` by hand still works. Run `bun run build`
afterwards. PDFs go in `src/public/`.

## Hosting

GitHub Pages, configured as *Deploy from a branch*, branch `main`,
folder `/docs`. The `docs/.nojekyll` file is written by the build so Pages
serves the files exactly as built.
