import { describe, expect, it } from 'vitest';
import { summariseLog } from './logStats';

describe('summariseLog', () => {
	it('counts books and lists read scores best first, skipping empty ones', () => {
		expect(summariseLog(['Skip', 'Must Read', 'Must Read', 'Worth Reading'])).toEqual([
			'4 books logged',
			'2 Must Read',
			'1 Worth Reading',
			'1 Skip',
		]);
	});

	it('uses the singular for one book', () => {
		expect(summariseLog(['Must Read'])).toEqual(['1 book logged', '1 Must Read']);
	});

	it('handles an empty log', () => {
		expect(summariseLog([])).toEqual(['0 books logged']);
	});
});
