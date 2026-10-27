# Adding book reviews

Books are content entries in [`src/content/books/`](../src/content/books/). To add one:

1. Create a new `.md` file in that folder (the filename is only an internal identifier).
2. Copy the frontmatter structure from [the placeholder review](../src/content/books/why-nations-fail.md) and provide:
   `title`, `author`, `genre`, `rating`, `readScore`, `verdict`, `reviewDate`, and `reviewText`.
   `verdict` is one short sentence (160 characters max) summing up the book. It appears in the
   Logbook and under the scores on the review page.
3. Set `readScore` to exactly one of: `Skip`, `If you have time`, `Worth Reading`, or `Must Read`.
4. Add an `isbn` when possible. The build first checks the committed ISBN-keyed cover cache,
   then tries Open Library by ISBN. If `GOOGLE_BOOKS_API_KEY` is configured, it tries Google
   Books next. Successful results are written to [`src/data/book-cover-cache.json`](../src/data/book-cover-cache.json)
   so later builds do not repeat the lookup.
5. A local `cover` image under `src/assets/` is optional and overrides the API result.
   If neither source provides a cover, the review displays a title-and-author placeholder.
6. Add up to 10 strings under `quotes` and/or a `favouriteCharacter` when those details apply.
7. Run `npm run check` or `npm run build`. The home page shelf and the Logbook (`/blog`) pick up the new entry automatically. The shelf sorts reviews by `reviewDate` oldest first; the Logbook groups them by year, newest first.

The optional `GOOGLE_BOOKS_API_KEY` environment variable can hold a Google Books API key.
The deployment workflow reads it from the GitHub Actions `GOOGLE_BOOKS_API_KEY` secret.
Review cover lookups run sequentially during the build, and a missing cover never fails the build.
The key is never stored in review files or source code.

Valid genres are `Fiction`, `Non-Fiction`, and `Fantasy`. Each review is rendered at
`/reviews/<filename>/` by the shared [`BookReview`](../src/layouts/BookReview.astro) layout.
The [`Bookcase`](../src/components/Bookcase.astro) component owns the existing black-and-gold
bookcase styling, shelf grouping, and book-opening interaction, so new entries do not require
homepage or layout changes.
