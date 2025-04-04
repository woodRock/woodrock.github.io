# Search Feature for Portfolio Website

This search feature allows users to search across your portfolio website, including projects, publications, and other content.

## Features

- Real-time search suggestions as you type
- Full search results page with highlighted terms
- Searches across titles, content, and metadata
- Mobile and desktop friendly
- Integration with navigation

## Components

1. **SearchBoxIsland** - Interactive search box with dropdown results
2. **Search API** - Backend API for searching content
3. **Search Results Page** - Full page for displaying search results
4. **Content Collector** - Script to gather content from your site

## Implementation Steps

### 1. Add the Components to Your Project

1. Copy the files to their respective locations:
   - `islands/SearchBoxIsland.tsx`
   - `routes/api/search.ts`
   - `routes/search.tsx`
   - `components/NavigationWithSearch.tsx`
   - `scripts/collect-content.ts`

### 2. Generate Searchable Content

Run the content collector script to gather content from your site:

```bash
deno run --allow-read --allow-write scripts/collect-content.ts
```

This will create a file at `static/data/searchable-content.json` containing all your searchable content.

### 3. Update Your Layout

Replace your current navigation component with `NavigationWithSearch.tsx` in your `_app.tsx`:

```tsx
// _app.tsx
import { type PageProps } from "$fresh/server.ts";
import NavigationWithSearch from "../components/NavigationWithSearch.tsx";
import Footer from "../components/Footer.tsx";

export default function App({ Component, url }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Jesse Wood | Portfolio</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="min-h-screen flex flex-col bg-gray-50">
        <NavigationWithSearch path={url.pathname} />
        <main class="flex-grow">
          <Component />
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

## Customization

### Adding New Content Types

To add new content types:

1. Update the `ContentType` type in both `scripts/collect-content.ts` and `routes/api/search.ts`
2. Add the new content type to the collector script
3. Regenerate the content file

### Styling

The search components use Tailwind CSS for styling. You can customize the appearance by modifying the classes in:

- `SearchBoxIsland.tsx` - For the dropdown search interface
- `search.tsx` - For the search results page

### Content Sources

By default, the content collector looks for:

1. Markdown files with YAML frontmatter in:
   - `content/publications/`
   - `content/projects/`
   - `content/pages/`

2. JSON files:
   - `static/data/publications.json`
   - `static/data/projects.json`

You can modify `collect-content.ts` to add more sources.

## Maintaining Content

For best search results:

1. Keep your content up to date
2. Re-run the collector script whenever you add new content
3. Use descriptive titles and content
4. Add relevant metadata to your content

## Performance Considerations

- The search is performed client-side for the quick suggestions
- For larger sites, consider implementing server-side pagination
- The content file should be kept under 1MB for optimal performance