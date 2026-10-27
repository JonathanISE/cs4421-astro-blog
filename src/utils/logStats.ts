import type { CollectionEntry } from 'astro:content';

type ReadScore = CollectionEntry<'books'>['data']['readScore'];

const READ_SCORES_BEST_FIRST: ReadScore[] = ['Must Read', 'Worth Reading', 'If you have time', 'Skip'];

// e.g. ['10 books logged', '7 Must Read', '3 Worth Reading'], skipping scores nobody has been given.
export function summariseLog(readScores: ReadScore[]): string[] {
	const total = readScores.length;
	const scoreCounts = READ_SCORES_BEST_FIRST.map((score) => ({
		score,
		count: readScores.filter((readScore) => readScore === score).length,
	})).filter(({ count }) => count > 0);

	return [
		`${total} ${total === 1 ? 'book' : 'books'} logged`,
		...scoreCounts.map(({ score, count }) => `${count} ${score}`),
	];
}
