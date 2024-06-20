export function previousDayCalc(): string {
  const now = new Date(Date.now());
  const previousDay = Number(now) - 84600000;
  return new Date(previousDay).toISOString();
}
