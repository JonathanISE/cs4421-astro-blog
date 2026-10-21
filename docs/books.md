# Adding book reviews

Books are content entries in [`src/content/books/`](../src/content/books/). To add one:

1. Create a new `.md` file in that folder (the filename is only an internal identifier).
2. Copy the frontmatter structure from [the placeholder review](../src/content/books/why-nations-fail.md) and provide:
   `title`, `author`, `genre`, `rating`, `readScore`, `reviewDate`, and `reviewText`.
3. Set `readScore` to exactly one of: `Skip`, `If you have time`, `Worth Reading`, or `Must Read`.
4. Add an `isbn` when possible. The build uses it to look up the cover from Google Books.
   If there is no ISBN, it searches by title and author instead.
5. A local `cover` image under `src/assets/` is optional and overrides the API result.
   If neither source provides a cover, the review displays a title-and-author placeholder.
6. Add up to 10 strings under `quotes` and/or a `favouriteCharacter` when those details apply.
7. Run `npm run check` or `npm run build`. The home page discovers the new entry automatically and sorts reviews by `reviewDate`, oldest first.

The optional `GOOGLE_BOOKS_API` environment variable can hold a Google Books API key.
The deployment workflow reads it from the GitHub Actions `GOOGLE_BOOKS_API` secret; the key
is never stored in review files or source code.

Valid genres are `Fiction`, `Non-Fiction`, and `Fantasy`. Each review is rendered at
`/reviews/<filename>/` by the shared [`BookReview`](../src/layouts/BookReview.astro) layout.
The [`Bookcase`](../src/components/Bookcase.astro) component owns the existing black-and-gold
bookcase styling, shelf grouping, and book-opening interaction, so new entries do not require
homepage or layout changes.
