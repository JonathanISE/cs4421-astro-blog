# Adding books

Books are content entries in [`src/content/books/`](../src/content/books/). To add one:

1. Create a new `.md` file in that folder (the filename is only an internal identifier).
2. Copy the frontmatter structure from an existing book and provide the required fields:
   `title`, `author`, `description`, `genre`, `reviewUrl`, and `cover`.
3. Use a cover image stored under `src/assets/` and set `cover` to its relative path.
4. Optionally add `chapters`. Each chapter needs a `title`; `summary` is optional and can support a future detail page.
5. Run `npm run check` or `npm run build`. The home page discovers the new entry automatically.

Valid genres are `Fiction`, `Non-fiction`, and `Fantasy`. The shared [`Bookcase`](../src/components/Bookcase.astro) component owns the layout, styling, shelf grouping, and book-opening interaction, so new entries do not require layout changes.
