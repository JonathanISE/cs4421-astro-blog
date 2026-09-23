import { describe, expect, it } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
	it('formats a date with a short month, day, and year', () => {
		expect(formatDate(new Date('2024-01-15T12:00:00Z'))).toBe('Jan 15, 2024');
	});

	it('preserves the year at the end of the year', () => {
		expect(formatDate(new Date('2024-12-31T12:00:00Z'))).toBe('Dec 31, 2024');
	});
});