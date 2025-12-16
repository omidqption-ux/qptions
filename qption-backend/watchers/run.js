// watchers/run.js
import '../config/env.js';
import { connectDB } from '../db/connect.js';
import { runEthWatcher } from './ethWatcher.js';
import { runTronWatcher } from './tronWatcher.js';

const mode = (process.argv[2] || 'both').toLowerCase();

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function startLoop(name, fn) {
    (async function loop() {
        for (; ;) {
            try {
                console.log(`[${name}] starting...`);
                await fn(); // long-running; should not return
                console.warn(`[${name}] returned unexpectedly; restarting in 2s`);
            } catch (e) {
                console.error(`[${name}] crashed:`, e?.message || e);
            }
            await sleep(2000);
        }
    })();
}

(async () => {
    try {
        await connectDB();

        const wantEth = mode === 'both' || mode === 'eth';
        const wantTron = mode === 'both' || mode === 'tron';

        if (wantEth) startLoop('ETH', runEthWatcher);
        if (wantTron) startLoop('TRON', runTronWatcher);

        if (!wantEth && !wantTron) {
            console.warn('[watchers] nothing to run; use: node watchers/run.js eth|tron|both');
        }

        // keep process alive
        await new Promise(() => { });
    } catch (e) {
        console.error('[watchers] fatal:', e);
        process.exit(1);
    }
})();
