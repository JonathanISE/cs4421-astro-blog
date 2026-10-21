import whyNationsFailCover from '../assets/why-nations-fail.jpg';

export type Book = {
	title: string;
	author: string;
	genre: 'Fiction' | 'Non-fiction' | 'Fantasy';
	reviewUrl: string;
	cover: typeof whyNationsFailCover;
};

export const books: Book[] = [
	{
		title: 'Why Nations Fail',
		author: 'Acemoglu & Robinson',
		genre: 'Non-fiction',
		reviewUrl: '/blog/why-nations-fail/',
		cover: whyNationsFailCover,
	},
];
