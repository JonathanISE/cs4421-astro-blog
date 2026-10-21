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
			author: z.string(),
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
			description: z.string(),
			genre: z.enum(['Fiction', 'Non-fiction', 'Fantasy']),
			reviewUrl: z.string(),
			cover: image(),
			chapters: z.array(
				z.object({
					title: z.string(),
					summary: z.string().optional(),
				}),
			).optional(),
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
