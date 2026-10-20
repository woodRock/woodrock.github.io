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

## Adding content

- **Publication**: add an entry to `content/publications.json` and drop the
  PDF into `src/public/`. Entries are sorted by year, newest first.
- **Project**: add an entry to `content/projects.json`. Sorted by title.
- **Bio, links, skills, research summary**: edit `content/site.json`.

## Hosting

GitHub Pages, configured as *Deploy from a branch*, branch `main`,
folder `/docs`. The `docs/.nojekyll` file is written by the build so Pages
serves the files exactly as built.
