import { describe, expect, it } from 'vitest';
import { paginate } from '@/lib/pagination';

describe('record pagination', () => {
  it('visits every record exactly once across a partial final page', () => {
    const records = Array.from({ length: 23 }, (_, index) => `receipt-${index}`);
    const pages = [1, 2, 3].map(page => paginate(records, page));
    expect(pages.flatMap(page => page.items)).toEqual(records);
    expect(pages.map(page => [page.start, page.end])).toEqual([[1, 10], [11, 20], [21, 23]]);
    expect(paginate(records, '999').page).toBe(3);
  });
  it('returns an empty first page for an empty dataset', () => {
    expect(paginate([], 9)).toMatchObject({ items: [], page: 1, pageCount: 1, total: 0, start: 0, end: 0 });
  });
});
