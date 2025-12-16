// lib/rate.js (ESM)
import Bottleneck from 'bottleneck';
import pRetry from 'p-retry';

export function makeLimiter(opts = {}) {
    return new Bottleneck({
        reservoir: opts.reservoir ?? 5,                 // tokens per window
        reservoirRefreshAmount: opts.refresh ?? 5,      // refill size
        reservoirRefreshInterval: opts.intervalMs ?? 1000, // 1s window
        maxConcurrent: opts.concurrent ?? 1,            // keep single-flight
        minTime: opts.minTime ?? 200,                   // gap between jobs
    });
}

export function withRetry(fn, { retries = 6, min = 400, max = 3000 } = {}) {
    return () =>
        pRetry(() => fn(), {
            retries,
            factor: 1.8,
            minTimeout: min,
            maxTimeout: max,
            randomize: true,
            onFailedAttempt: (e) => {
                const code = e?.response?.status ?? e?.code;
                const msg = (e?.message || '').toLowerCase();
                const retryable =
                    code === 429 ||
                    msg.includes('too many requests') ||
                    msg.includes('rate') ||
                    msg.includes('throttle') ||
                    msg.includes('timeout') ||
                    msg.includes('econnreset');
                if (!retryable) throw e;
            },
        });
}
