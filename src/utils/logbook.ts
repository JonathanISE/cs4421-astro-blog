import type { CollectionEntry } from 'astro:content';

type ReadScore = CollectionEntry<'books'>['data']['readScore'];

type BaseEntry = {
	id: string;
	title: string;
	date: Date;
	href: string;
};

export type ReviewEntry = BaseEntry & {
	kind: 'review';
	author: string;
	coverUrl?: string;
	verdict: string;
	readScore: ReadScore;
};

export type PostEntry = BaseEntry & {
	kind: 'post';
	description: string;
};

export type LogbookEntry = ReviewEntry | PostEntry;

export type LogbookYear = {
	year: number;
	entries: LogbookEntry[];
};

export function sortNewestFirst(entries: LogbookEntry[]): LogbookEntry[] {
	return [...entries].sort((first, second) => second.date.getTime() - first.date.getTime());
}

// Groups entries by year, newest year first and newest entry first within each year.
export function groupByYear(entries: LogbookEntry[]): LogbookYear[] {
	const years = new Map<number, LogbookEntry[]>();
	for (const entry of sortNewestFirst(entries)) {
		const year = entry.date.getFullYear();
		years.set(year, [...(years.get(year) ?? []), entry]);
	}
	return [...years].map(([year, yearEntries]) => ({ year, entries: yearEntries }));
}
