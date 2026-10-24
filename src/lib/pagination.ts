export function paginate<T>(records: T[], requestedPage: string | number | undefined, pageSize = 10) {
  const pageCount = Math.max(1, Math.ceil(records.length / pageSize));
  const parsed = Number(requestedPage);
  const page = Math.min(pageCount, Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1);
  const offset = (page - 1) * pageSize;
  return { items: records.slice(offset, offset + pageSize), page, pageCount, total: records.length,
    start: records.length ? offset + 1 : 0, end: Math.min(offset + pageSize, records.length) };
}
