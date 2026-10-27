// British day/month/year without leading zeros, e.g. 3/10/2026.
export function formatDate(date: Date): string {
	return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}
