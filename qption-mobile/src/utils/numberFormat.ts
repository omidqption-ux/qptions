export function formatNumber(
  value: number | string | null | undefined,
  options: Intl.NumberFormatOptions = {},
): string {
  if (value === null || value === undefined || value === '') return ''
  const num = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(num)) return ''
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 8,
    ...options,
  }).format(num)
}
