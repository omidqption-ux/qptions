export interface OhlcBucket {
    time: number;
    open: number | null;
    high: number | null;
    low: number | null;
    close: number | null;
    _empty?: boolean;
}

export interface AggregateRow {
    time: number | string; // whatever you get from Massive / API
    value: number;
    // you can keep extra fields if needed
    [key: string]: any;
}

export function aggregateToOHLC(
    rows: AggregateRow[],
    bucketSec: number = 10
): OhlcBucket[] {
    const out: OhlcBucket[] = [];
    if (!rows || rows.length === 0) return out;

    const STEP = bucketSec * 1000;
    const snapSec = (ms: number): number => Math.floor(ms / 1000) * 1000;
    const snapToStepDown = (ms: number): number => Math.floor(ms / STEP) * STEP;

    // Normalize & sort
    const data = rows
        .map((r) => ({
            ...r,
            time: snapSec(Number(r.time)), // normalize to nearest second in ms
        }))
        .sort((a, b) => a.time - b.time);

    const firstT = data[0].time;
    const lastT = data[data.length - 1].time;

    // Align buckets to epoch (…:00, …:05, …:10, …)
    let bucketStart = snapToStepDown(firstT);
    const end = snapToStepDown(lastT);

    let i = 0;
    let prevClose: number | null = null; // last known close to flat-fill empty buckets

    while (bucketStart <= end) {
        const bucketEnd = bucketStart + STEP;
        let open: number | null = null;
        let high = -Infinity;
        let low = Infinity;
        let close: number | null = null;
        let hadData = false;

        // Consume all rows in [bucketStart, bucketEnd)
        while (
            i < data.length &&
            data[i].time >= bucketStart &&
            data[i].time < bucketEnd
        ) {
            const r = data[i];
            const v = r.value;

            if (!hadData) {
                open = v;
                high = v;
                low = v;
                close = v;
                hadData = true;
            } else {
                if (Number.isFinite(v)) {
                    high = Math.max(high, v);
                    low = Math.min(low, v);
                    close = v;
                }
            }
            i++;
        }

        if (hadData) {
            out.push({
                time: bucketStart,
                open,
                high,
                low,
                close,
            });
            prevClose = close;
        } else {
            // Emit an empty bucket. Use flat fill from prevClose if we have one; else nulls.
            if (prevClose == null) {
                out.push({
                    time: bucketStart,
                    open: null,
                    high: null,
                    low: null,
                    close: null,
                    _empty: true,
                });
            } else {
                out.push({
                    time: bucketStart,
                    open: prevClose,
                    high: prevClose,
                    low: prevClose,
                    close: prevClose,
                    _empty: true,
                });
            }
        }

        bucketStart = bucketEnd;
    }

    return out;
}
