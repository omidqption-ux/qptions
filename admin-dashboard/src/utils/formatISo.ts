// src/utils/formatISO.ts

export interface FormatOptions {
    /** If true, formats in UTC; otherwise uses local time. */
    utc?: boolean
}

/**
 * Format an ISO date (or Date / timestamp) to "yyyy-mm-dd hh:mm:ss".
 *
 * @example
 * formatISO('2025-10-09T10:16:44.417Z')            // local time
 * formatISO('2025-10-09T10:16:44.417Z', { utc: true }) // "2025-10-09 10:16:44"
 */
export function formatISO(
    input: string | number | Date,
    { utc = false }: FormatOptions = {}
): string {
    const d = input instanceof Date ? new Date(input.getTime()) : new Date(input)
    if (Number.isNaN(d.getTime())) {
        throw new Error('Invalid date input')
    }

    const get = <K extends 'FullYear' | 'Month' | 'Date' | 'Hours' | 'Minutes' | 'Seconds'>(k: K) =>
        (utc ? (d as any)[`getUTC${k}`]() : (d as any)[`get${k}`]()) as number

    const pad = (n: number) => String(n).padStart(2, '0')

    const yyyy = get('FullYear')
    const mm = pad(get('Month') + 1)
    const dd = pad(get('Date'))
    const hh = pad(get('Hours'))
    const mi = pad(get('Minutes'))
    const ss = pad(get('Seconds'))

    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`
}

export default formatISO
