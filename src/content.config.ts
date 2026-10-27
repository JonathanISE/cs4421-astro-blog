import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			author: z.string().default('jonathan-murphy'),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
		}),
});

const books = defineCollection({
	loader: glob({ base: './src/content/books', pattern: '**/*.md' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			author: z.string(),
			genre: z.enum(['Fiction', 'Non-Fiction', 'Fantasy']),
			isbn: z.string().optional(),
			cover: image().optional(),
			rating: z.number().min(0).max(5),
			readScore: z.enum(['Skip', 'If you have time', 'Worth Reading', 'Must Read']),
			// One short sentence summing up the book, shown in the Logbook and on the review page.
			verdict: z.string().min(1).max(160),
			reviewText: z.string().min(1),
			reviewDate: z.coerce.date(),
			quotes: z.array(z.string()).max(10).optional(),
			favouriteCharacter: z.string().optional(),
		}),
});

const authors = defineCollection({
		loader: glob({ base: './src/content/authors', pattern: '**/*.md' }),
		schema: z.object({
			name: z.string(),
			bio: z.string(),
			avatar: z.string(),
			socialLinks: z.array(
				z.object({
					label: z.string(),
					url: z.url(),
				}),
			),
		}),
});

export const collections = { blog, books, authors };
