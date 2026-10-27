import { getCollection } from 'astro:content';
import { getBookCover } from './googleBooks';
import { type LogbookEntry, sortNewestFirst } from './logbook';

// Every book review and written post, newest first, in one shared shape.
export async function getLogbookEntries(): Promise<LogbookEntry[]> {
	const [reviews, posts] = await Promise.all([getCollection('books'), getCollection('blog')]);

	const reviewEntries: LogbookEntry[] = await Promise.all(
		reviews.map(async (review) => ({
			kind: 'review' as const,
			id: review.id,
			title: review.data.title,
			author: review.data.author,
			date: review.data.reviewDate,
			href: `/reviews/${review.id}/`,
			coverUrl: await getBookCover(review.data),
			verdict: review.data.verdict,
			readScore: review.data.readScore,
		})),
	);

	const postEntries: LogbookEntry[] = posts.map((post) => ({
		kind: 'post' as const,
		id: post.id,
		title: post.data.title,
		date: post.data.pubDate,
		href: `/blog/${post.id}/`,
		description: post.data.description,
	}));

	return sortNewestFirst([...reviewEntries, ...postEntries]);
}
