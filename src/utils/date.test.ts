import { describe, expect, it } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
	it('formats a date as day/month/year', () => {
		expect(formatDate(new Date(2024, 0, 15))).toBe('15/1/2024');
	});

	it('does not pad single-digit days or months', () => {
		expect(formatDate(new Date(2026, 9, 3))).toBe('3/10/2026');
	});

	it('preserves the year at the end of the year', () => {
		expect(formatDate(new Date(2024, 11, 31))).toBe('31/12/2024');
	});
});
