export function normalizeEpochMs(value: any): number | null {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return null;
  return numeric < 1e12 ? numeric * 1000 : numeric;
}
