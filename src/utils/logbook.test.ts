import { describe, expect, it } from 'vitest';
import { groupByYear, type LogbookEntry } from './logbook';

function post(id: string, date: Date): LogbookEntry {
	return { kind: 'post', id, title: id, date, href: `/blog/${id}/`, description: '' };
}

describe('groupByYear', () => {
	it('puts the newest year first and the newest entry first within a year', () => {
		const groups = groupByYear([
			post('old', new Date(2024, 0, 15)),
			post('august', new Date(2026, 7, 12)),
			post('october', new Date(2026, 9, 3)),
		]);

		expect(groups.map((group) => group.year)).toEqual([2026, 2024]);
		expect(groups[0].entries.map((entry) => entry.id)).toEqual(['october', 'august']);
	});

	it('returns no groups when there are no entries', () => {
		expect(groupByYear([])).toEqual([]);
	});
});
