import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getLogbookEntries } from '../utils/logbookEntries';

export async function GET(context) {
	const entries = await getLogbookEntries();
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: entries.map((entry) => ({
			title: entry.title,
			pubDate: entry.date,
			description: entry.kind === 'review' ? entry.verdict : entry.description,
			link: entry.href,
		})),
	});
}
