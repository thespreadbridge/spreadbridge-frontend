// Shared helpers for the member entry-gap race page. Symbols follow the KRX
// USD futures code used by the desktop app: A75 + year digit + two-digit month.
export const raceSymbolPattern = /^A75[6-9](0[1-9]|1[0-2])$/;
export const isRaceSymbol = (value: string) => raceSymbolPattern.test(value);

export interface RaceBucket { lower: number; people: number; slots: number; previousPeopleRank?: number | null; previousSlotsRank?: number | null }
export interface RaceSummary {
  symbol: string; shared: boolean; months: string[]; people: number; slots: number;
  buckets: RaceBucket[]; comparisonAt?: string | null; updatedAt: string;
}

export const raceSymbol = (year: number, month: number) => `A75${year % 10}${String(month).padStart(2, '0')}`;
export const raceMonthLabel = (symbol: string) => {
  const match = symbol.match(/^A75(\d)(\d{2})$/);
  return match ? `2${match[1]}${match[2]} · ${Number(match[2])}월물` : symbol;
};

// Current and the next two contract months in Korea time, oldest first.
export function upcomingRaceSymbols(now = new Date()) {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const year = kst.getUTCFullYear(), month = kst.getUTCMonth();
  return [0, 1, 2].map(offset => {
    const date = new Date(Date.UTC(year, month + offset, 1));
    return raceSymbol(date.getUTCFullYear(), date.getUTCMonth() + 1);
  }).filter(isRaceSymbol);
}

// Slot shares in tenths of a percent that always add up to exactly 100.0.
export function slotShares(buckets: RaceBucket[], total: number) {
  if (!total) return new Map(buckets.map(bucket => [bucket.lower, 0]));
  const parts = buckets.map(bucket => { const exact = bucket.slots / total * 1000; return { lower: bucket.lower, base: Math.floor(exact), remainder: exact % 1 }; })
    .sort((a, b) => b.remainder - a.remainder || a.lower - b.lower);
  const residual = 1000 - parts.reduce((sum, part) => sum + part.base, 0);
  return new Map(parts.map((part, index) => [part.lower, (part.base + (index < residual ? 1 : 0)) / 10]));
}

export const kstTime = (value: string) => new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value));
