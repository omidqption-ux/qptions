import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
/**
 * Wire Polygon FX snapshot+live into an amCharts 5 series.
 * The series must have valueXField="date" and valueYField="value" (Date + number).
 *
 * @param {object} params
 * @param {string} params.pair            e.g. "C:EURUSD"
 * @param {string} params.interval        e.g. "1s", "1m", "5m"
 * @param {string} params.url             socket server URL (e.g. http://localhost:5000)
 * @param {object} params.seriesRef       ref to am5xy.LineSeries (or other XY series)
 * @param {number} [params.maxPoints=5000] cap series length
 */

const interval = '1s'
const BASE_URL =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000'
        : 'https://api.qption.com';

const socket = io(`${BASE_URL}/real`, {
    path: '/socket.io',
    withCredentials: true,
    // optional, but recommended:
    transports: ['websocket'], // prefer WS
})

export function usePolygonFx({
    pair,
    seriesRef,
    maxPoints = 5000
}) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const countRef = useRef(0);
    const dataRef = useRef([]); // authoritative array of { date: Date, value: number }
    const pendingOverwriteRef = useRef(null);

    useEffect(() => {
        if (!seriesRef?.current) return

        setLoading(true)
        setError("")
        dataRef.current = []
        countRef.current = 0

        // 1) Request history snapshot
        socket.emit("subscribe", { pair }, (err, snapshot) => {
            if (err) {
                setError(typeof err === "string" ? err : err?.message || "Snapshot failed");
                setLoading(false);
                return;
            }
            // Map backend -> amCharts fields
            const mapped = (snapshot || []).map((b) => ({
                date: b.date,
                value: Number(b.close),
            }));

            dataRef.current = mapped;
            countRef.current = mapped.length;

            // Initial setAll
            seriesRef.current.data.setAll(mapped);
            setLoading(false);

            // 2) Start live stream
            socket.emit("startLive", { pair }, (liveErr) => {
                if (liveErr) {
                    setError(typeof liveErr === "string" ? liveErr : liveErr?.message || "Live failed");
                }
            })
        })
        // 3) Merge live bars (append vs overwrite)
        const onLive = (msg) => {
            if (msg.pair !== pair) return;
            const incoming = {
                date: msg.time,
                value: Number(msg.close),
            }
            const arr = dataRef.current;
            const last = arr[arr.length - 1];
            // same candle? -> overwrite (throttled)
            if (last && last.date === incoming.date) {
                arr[arr.length - 1] = incoming;
                if (!pendingOverwriteRef.current) {
                    // throttle: refresh at most ~5 times/sec during the candle
                    pendingOverwriteRef.current = setTimeout(() => {
                        pendingOverwriteRef.current = null;
                        // Light refresh: update the last item only
                        // Not all am5 DataList ops are public; safest is a minimal setAll of the tail
                        // to avoid re-laying the whole dataset frequently:
                        const tail = arr.slice(-Math.min(50, arr.length)); // small tail refresh
                        const keep = arr.length - tail.length;
                        if (keep <= 0) {
                            seriesRef.current.data.setAll(arr);
                        } else {
                            // rebuild efficiently: keep head as-is, then re-append the small tail
                            // This two-step ensures tooltips/axes stay stable.
                            const head = arr.slice(0, keep);
                            seriesRef.current.data.setAll(head);
                            tail.forEach((d) => seriesRef.current.data.push(d));
                        }
                    }, 200);
                }
                return;
            }
            // new candle -> append
            arr.push(incoming);
            countRef.current = arr.length;

            // cap length if needed
            if (arr.length > maxPoints) {
                const trimmed = arr.slice(arr.length - maxPoints);
                dataRef.current = trimmed;
                seriesRef.current.data.setAll(trimmed);
            } else {
                seriesRef.current.data.push(incoming);
            }
        }
        socket.on("liveData", (s) => console.log(s));

        // Cleanup on unmount/param change
        return () => {
            socket.off("liveData", onLive);
            socket.emit("unsubscribe");
            socket.emit("unsubscribeTradeRoom", { pair });
            if (pendingOverwriteRef.current) {
                clearTimeout(pendingOverwriteRef.current);
                pendingOverwriteRef.current = null;
            }
        };
    }, [pair, seriesRef, maxPoints])

    return {
        loading,
        error,
        count: countRef.current,
    };
}