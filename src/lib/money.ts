export function formatWon(value: number | null | undefined) {
  if (value == null || !Number.isFinite(value)) return '—';
  return `${value < 0 ? '-' : value > 0 ? '+' : ''}₩${Math.abs(value).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}`;
}
