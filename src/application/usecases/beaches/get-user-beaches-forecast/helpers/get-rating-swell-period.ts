export function getRatingSwellPeriod(period: number): number {
  if (period < 7) return 1;

  if (period < 10) return 2;

  if (period < 14) return 4;

  return 5;
}
