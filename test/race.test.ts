import { describe, expect, it } from 'vitest';
import { isRaceSymbol, raceMonthLabel, slotShares, upcomingRaceSymbols } from '@/lib/race';

describe('member race helpers', () => {
  it('accepts only the desktop futures symbol format', () => {
    expect(isRaceSymbol('A75610')).toBe(true);
    expect(isRaceSymbol('A75613')).toBe(false);
    expect(isRaceSymbol('A75610;drop')).toBe(false);
  });
  it('labels symbols like the desktop app', () => {
    expect(raceMonthLabel('A75610')).toBe('2610 · 10월물');
    expect(raceMonthLabel('A75701')).toBe('2701 · 1월물');
  });
  it('lists the current and next two months in Korea time', () => {
    expect(upcomingRaceSymbols(new Date('2026-11-30T15:30:00Z'))).toEqual(['A75612', 'A75701', 'A75702']);
  });
  it('rounds slot shares so they total exactly 100.0', () => {
    const shares = slotShares([{ lower: 4, people: 1, slots: 1 }, { lower: 5, people: 1, slots: 1 }, { lower: 6, people: 1, slots: 1 }]);
    expect([...shares.values()].reduce((a, b) => a + b, 0)).toBeCloseTo(100, 5);
    expect(shares.get(4)).toBe(33.4);
  });
});
