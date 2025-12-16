import '../config/env.js'
import { runEthSweeper } from './ethSweeper.js'
import { runTronSweeper } from './tronSweeper.js'
import http from 'node:http'
import https from 'node:https'

const MODE = (process.argv[2] || process.env.SWEEPER_MODE || 'both').toLowerCase()

// Config knobs (env overrides)
const BASE_MS = Number(process.env.SWEEPER_BASE_MS || 90_000)           // default 90s
const JITTER_PCT = Number(process.env.SWEEPER_JITTER_PCT || 0.15)       // ±15%
const ETH_ENABLED = MODE === 'eth' || MODE === 'both'
const TRON_ENABLED = MODE === 'tron' || MODE === 'both'

// Reuse TCP/TLS connections (cuts handshake + bursts)
const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 50, maxFreeSockets: 10, keepAliveMsecs: 15_000 })
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 50, maxFreeSockets: 10, keepAliveMsecs: 15_000 })

const sleep = ms => new Promise(r => setTimeout(r, ms))
const jitter = (ms, pct = 0.2) => ms + Math.floor((Math.random() * 2 - 1) * ms * pct)

// helper to run with simple backoff on 429/5xx
async function runWithBackoff(fn, label) {
    let delay = 1_000
    for (let attempt = 1; attempt <= 5; attempt++) {
        try {
            await fn()
            return
        } catch (e) {
            const msg = e?.response?.status || e?.code || e?.message || e
            if (String(msg).match(/(429|5\d\d|ECONN|ETIMEDOUT|ENET|EAI_AGAIN)/)) {
                console.warn(`[sweeper] ${label} attempt ${attempt} failed: ${msg}; backing off ${delay}ms`)
                await sleep(delay + Math.floor(Math.random() * 250))
                delay = Math.min(delay * 2, 30_000)
                continue
            }
            console.error(`[sweeper] ${label} fatal:`, msg)
            throw e
        }
    }
}

console.log('[sweeper] started', { MODE, BASE_MS, JITTER_PCT, ETH_ENABLED, TRON_ENABLED })

    ; (async () => {
        // Stagger the two chains so they don’t overlap
        let next = Date.now()
        for (; ;) {
            try {
                if (ETH_ENABLED) {
                    await runWithBackoff(() => runEthSweeper({ httpAgent, httpsAgent }), 'eth')
                }
                // small stagger between chains
                await sleep(2_000 + Math.random() * 1_000)

                if (TRON_ENABLED) {
                    await runWithBackoff(() => runTronSweeper({ httpAgent, httpsAgent }), 'tron')
                }
            } catch (e) {
                console.error('[sweeper] iteration error:', e?.message || e)
            }

            const base = BASE_MS
            const wait = jitter(base, JITTER_PCT)
            next += wait
            const sleepMs = Math.max(0, next - Date.now())
            await sleep(sleepMs)
        }
    })()
