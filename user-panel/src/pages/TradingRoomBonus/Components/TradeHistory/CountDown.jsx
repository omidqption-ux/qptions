// Countdown.jsx
import { useEffect, useMemo, useRef, useState } from "react";

const pad2 = (n) => String(n).padStart(2, "0");
const toMs = (epoch) => (epoch < 1e12 ? epoch * 1000 : epoch); // seconds -> ms

function splitMs(ms) {
    const t = Math.max(0, ms);
    const days = Math.floor(t / 86_400_000);
    const hours = Math.floor((t % 86_400_000) / 3_600_000);
    const minutes = Math.floor((t % 3_600_000) / 60_000);
    const seconds = Math.floor((t % 60_000) / 1_000);
    return { days, hours, minutes, seconds, totalMs: t };
}

/**
 * Props:
 * - targetEpoch: number (Unix epoch in *seconds* or *milliseconds*)
 * - tickMs?: number (default 250) – max tick frequency; snapping keeps it on second boundaries
 * - onComplete?: () => void
 * - render?: (parts) => ReactNode  // custom renderer; parts = {days,hours,minutes,seconds,totalMs}
 */
export default function Countdown({ targetEpoch, tickMs = 250, onComplete, render }) {
    const targetMs = useMemo(() => toMs(targetEpoch), [targetEpoch]);
    const [now, setNow] = useState(() => Date.now());
    const doneRef = useRef(false);

    useEffect(() => {
        doneRef.current = false;
        let timeoutId;

        const tick = () => {
            const n = Date.now();
            setNow(n);
            const remaining = targetMs - n;

            if (remaining <= 0) {
                if (!doneRef.current) {
                    doneRef.current = true;
                    onComplete?.();
                }
                return; // stop
            }

            // Align next tick to the next whole second to avoid drift
            const toNextSecond = 1000 - (n % 1000);
            const delay = Math.min(tickMs, toNextSecond);
            timeoutId = setTimeout(tick, delay);
        };

        tick();
        return () => clearTimeout(timeoutId);
    }, [targetMs, tickMs, onComplete]);

    const parts = splitMs(targetMs - now);

    // Custom UI if provided
    if (render) return render(parts);

    // Default UI: "Xd HH:MM:SS"
    return (
        <span aria-live="polite" aria-label="countdown">
            {parts.days > 0 ? `${parts.days}d ` : ""}
            {pad2(parts.hours)}:{pad2(parts.minutes)}:{pad2(parts.seconds)}
        </span>
    );
}
