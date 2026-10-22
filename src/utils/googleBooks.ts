import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { CollectionEntry } from 'astro:content';

type Review = CollectionEntry<'books'>['data'];

type GoogleBook = {
	volumeInfo?: {
		imageLinks?: {
			thumbnail?: string;
		};
	};
};

type GoogleBooksResponse = {
	items?: GoogleBook[];
};

type CoverCache = Record<string, string>;

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
const OPEN_LIBRARY_COVER_API = 'https://covers.openlibrary.org/b/isbn';
const CACHE_PATH = resolve(process.cwd(), 'src/data/book-cover-cache.json');

function normalizeIsbn(isbn: string | undefined): string | undefined {
	const normalized = isbn?.replace(/[\s-]/g, '');
	return normalized || undefined;
}

function getGoogleCoverUrl(book: GoogleBook | undefined): string | undefined {
	const thumbnail = book?.volumeInfo?.imageLinks?.thumbnail;
	return thumbnail?.replace(/^http:\/\//i, 'https://');
}

async function readCoverCache(): Promise<CoverCache> {
	try {
		return JSON.parse(await readFile(CACHE_PATH, 'utf8')) as CoverCache;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown cache read error';
		console.warn(`Book cover cache could not be read: ${message}`);
		return {};
	}
}

async function saveCoverCache(cache: CoverCache): Promise<void> {
	try {
		await writeFile(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`, 'utf8');
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown cache write error';
		console.warn(`Book cover cache could not be updated: ${message}`);
	}
}

async function findOpenLibraryCover(isbn: string): Promise<string | undefined> {
	const url = `${OPEN_LIBRARY_COVER_API}/${encodeURIComponent(isbn)}-L.jpg?default=false`;
	try {
		const response = await fetch(url);
		return response.ok ? url : undefined;
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown request error';
		console.warn(`Open Library cover lookup failed for ISBN "${isbn}": ${message}`);
		return undefined;
	}
}

async function findGoogleCover(isbn: string): Promise<string | undefined> {
	const apiKey = import.meta.env.GOOGLE_BOOKS_API_KEY;
	if (!apiKey) {
		return undefined;
	}

	const params = new URLSearchParams({
		q: `isbn:${isbn}`,
		key: apiKey,
	});
	try {
		const response = await fetch(`${GOOGLE_BOOKS_API}?${params}`);
		if (!response.ok) {
			if (response.status !== 429) {
				console.warn(`Google Books cover lookup failed with status ${response.status} for ISBN "${isbn}".`);
			}
			return undefined;
		}

		const data = (await response.json()) as GoogleBooksResponse;
		return getGoogleCoverUrl(data.items?.[0]);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown request error';
		console.warn(`Google Books cover lookup failed for ISBN "${isbn}": ${message}`);
		return undefined;
	}
}

export async function findGoogleBooksCover(review: Review): Promise<string | undefined> {
	const isbn = normalizeIsbn(review.isbn);
	if (!isbn) {
		console.warn(`[book cover] title="${review.title}" ISBN="(none)" source=fallback`);
		return undefined;
	}

	const cache = await readCoverCache();
	if (cache[isbn]) {
		console.warn(`[book cover] title="${review.title}" ISBN="${isbn}" source=cache`);
		return cache[isbn];
	}

	const openLibraryCover = await findOpenLibraryCover(isbn);
	if (openLibraryCover) {
		cache[isbn] = openLibraryCover;
		await saveCoverCache(cache);
		console.warn(`[book cover] title="${review.title}" ISBN="${isbn}" source=open-library`);
		return openLibraryCover;
	}

	const googleCover = await findGoogleCover(isbn);
	if (googleCover) {
		cache[isbn] = googleCover;
		await saveCoverCache(cache);
		console.warn(`[book cover] title="${review.title}" ISBN="${isbn}" source=google-books`);
		return googleCover;
	}

	console.warn(`[book cover] title="${review.title}" ISBN="${isbn}" source=fallback`);
	return undefined;
}
