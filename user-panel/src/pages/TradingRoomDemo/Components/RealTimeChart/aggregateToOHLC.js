export function aggregateToOHLC(rows, bucketSec = 10) {
    const out = [];
    if (!rows || rows.length === 0) return out;

    const STEP = bucketSec * 1000;
    const snapSec = (ms) => Math.floor(ms / 1000) * 1000;
    const snapToStepDown = (ms) => Math.floor(ms / STEP) * STEP;

    // Normalize & sort
    const data = rows
        .map(r => ({ ...r, t: snapSec(Number(r.time)) }))
        .sort((a, b) => a.time - b.time);

    const firstT = data[0].time;
    const lastT = data[data.length - 1].time;

    // Align buckets to epoch (…:00, …:05, …:10, …)
    let bucketStart = snapToStepDown(firstT);
    const end = snapToStepDown(lastT);

    let i = 0;
    let prevClose = null; // last known close to flat-fill empty buckets

    while (bucketStart <= end) {
        const bucketEnd = bucketStart + STEP;
        let open = null, high = -Infinity, low = Infinity, close = null;
        let hadData = false;

        // Consume all rows in [bucketStart, bucketEnd)
        while (i < data.length && data[i].time >= bucketStart && data[i].time < bucketEnd) {
            const r = data[i];
            if (!hadData) {
                open = r.value;
                high = r.value;
                low = r.value;
                close = r.value;
                hadData = true;
            } else {
                if (Number.isFinite(r.value)) high = Math.max(high, r.value);
                if (Number.isFinite(r.value)) low = Math.min(low, r.value);
                if (Number.isFinite(r.value)) close = r.value;
            }
            i++;
        }

        if (hadData) {
            out.push({ time: bucketStart, open, high, low, close })
            prevClose = close
        } else {
            // Emit an empty bucket. Use flat fill from prevClose if we have one; else nulls.
            if (prevClose == null) {
                out.push({ time: bucketStart, open: null, high: null, low: null, close: null, _empty: true });
            } else {
                out.push({ time: bucketStart, open: prevClose, high: prevClose, low: prevClose, close: prevClose, _empty: true });
            }
        }
        bucketStart = bucketEnd;
    }

    return out
}