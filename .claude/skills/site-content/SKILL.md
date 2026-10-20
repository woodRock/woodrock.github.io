---
name: site-content
description: Update the content of woodrock.github.io (bio, publications, projects, links) through the `site` CLI. Use when asked to add or edit a paper, project, bio text, tagline, links or research text on the website, or to fix wording on the site.
---

# Editing website content

All content lives in `content/*.json`. Never edit those files by hand or
edit `docs/` directly: use the CLI, which validates, keeps the JSON in a
stable order and rebuilds `docs/` for GitHub Pages.

```sh
bun run site --help            # all commands and flags
bun run site schema            # every field, type, required flag and meaning
```

Run commands from the repo root. Output is JSON when piped, so parse it
directly. Exit codes: 0 ok, 1 data error (message on stderr as JSON),
2 usage error.

## Workflow

1. Look before you change: `bun run site list <collection>` then
   `bun run site get <collection> <id>`, or `bun run site config get <path>`.
2. Try it: add `--dry-run` to any mutating command to see the result without
   writing.
3. Apply the change. The build runs automatically; the output names how many
   items were rendered.
4. Commit `content/`, `src/public/` (if a PDF was added) and `docs/` together.
   CI fails if `docs/` is stale.

## Collections

`publications` and `projects`. Items are addressed by `id`.

```sh
bun run site add publications --title "..." --year 2026 --kind "Journal article" \
  --venue "..." --doi 10.1234/abcd --pdf ~/Downloads/paper.pdf \
  --links "Publisher=https://..." --abstract "..." --bibtex "@article{...}"
bun run site update publications wood2025hook --doi 10.1007/s44295-025-00066-3
bun run site add projects --title "Fish Finder" --href https://github.com/woodrock/fish-finder \
  --tags Rust,Python --description "..."
bun run site remove projects fish-finder
bun run site move projects fish-finder top          # or 3, bottom, up, down, before:<id>, after:<id>
```

Publications are sorted by year automatically. Projects appear in the order
of `content/projects.json`; new ones go to the bottom, so `move` them where
they belong (current research first, then tools, then older or starred work).

- `id` is generated when omitted: the BibTeX key for a publication
  (`wood2025hook` style), a slug of the title for a project. Pass `--id` to
  override.
- `authors` is a comma-separated list in paper order, e.g.
  `--authors "Jesse Wood, Bach Nguyen, Bing Xue"`. Always set it.
- `kind` values in use: `PhD thesis`, `Journal article`, `Conference paper`,
  `PhD proposal`, `Preprint`.
- `--pdf` with a path copies the file into `src/public/` and stores the file
  name. With a bare file name it just records it.
- `--links` takes `Label=https://url;Other=https://url`. `--tags` is
  comma-separated. For projects, `href` is the primary link (the live site
  when there is one, otherwise the repo) and `links` holds the rest, usually
  `Source=<repo url>` or `Article=`, `Docs=`. Text fields accept `\n` for a line break; blank lines
  split abstract paragraphs.
- `--unset <field>` removes a field on update. Complex items can be passed as
  `--data '{...}'` or piped as JSON on stdin.

## Site settings (`content/site.json`)

Addressed by dot path with `config get` / `config set`. Values that parse as
JSON are stored as JSON; anything else is a string.

| Path | What it is |
|---|---|
| `tagline` | One sentence under the name on the home page |
| `role`, `affiliation` | Lines in the hero |
| `about.N` | About paragraphs, in order (currently 0 to 3) |
| `research.intro.N` | Research paragraphs, in order |
| `links.N.label` / `.href` | Hero links (GitHub, LinkedIn, CV) |
| `email`, `repo`, `description` | Contact and metadata |

```sh
bun run site config get about
bun run site config set about.1 "Before the PhD I was ..."
bun run site config set research.intro.1 "..."
```

To add an About paragraph, get the array, append in JSON and set the whole
`about` path. Paragraphs in `about` and `research.intro` may contain links
written as `[label](https://url)`; nothing else is interpreted.

## Voice

First person, plain and direct, one idea per sentence. Keep the existing
tone: a researcher who codes, with a little personality in the last About
paragraph. Do not invent results or affiliations; numbers in the research
text come from the thesis and papers.

## Verify

```sh
grep -c "text you changed" docs/index.html   # 1 or more means it rendered
bun run dev                                   # preview on http://localhost:3000
```
