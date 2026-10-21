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

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

function getCoverUrl(book: GoogleBook | undefined): string | undefined {
	const thumbnail = book?.volumeInfo?.imageLinks?.thumbnail;
	return thumbnail?.replace(/^http:\/\//i, 'https://');
}

export async function findGoogleBooksCover(review: Review): Promise<string | undefined> {
	const query = review.isbn
		? `isbn:${review.isbn}`
		: `intitle:${review.title} inauthor:${review.author}`;
	const params = new URLSearchParams({ q: query, maxResults: '1' });
	const apiKey = import.meta.env.GOOGLE_BOOKS_API;
	if (apiKey) {
		params.set('key', apiKey);
	}

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 5000);

	try {
		const response = await fetch(`${GOOGLE_BOOKS_API}?${params}`, {
			signal: controller.signal,
		});
		if (!response.ok) {
			console.warn(`Google Books cover lookup failed with status ${response.status} for "${review.title}".`);
			return undefined;
		}

		const data = (await response.json()) as GoogleBooksResponse;
		return getCoverUrl(data.items?.[0]);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown request error';
		console.warn(`Google Books cover lookup failed for "${review.title}": ${message}`);
		return undefined;
	} finally {
		clearTimeout(timeout);
	}
}
