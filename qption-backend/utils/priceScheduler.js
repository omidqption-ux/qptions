// utils/priceScheduler.js
const MAX_DELAY_MS = 2_147_483_647 // Node timer hard‑limit ≈24.8 days
const WARMUP_MS = 2_000 // start listening 2 s before close
const timers = new Map() // key -> { armId, guardId }
import { priceFeed } from '../priceFeed.js';

export function scheduleFinalize({
     roomName,
     initialPrice,
     tradeIndex,
     percentage,
     userId,
     pair,
     amount,
     buyOrSell,
     closeTime,
     openTime,
     io,
     finalizeTrade,
     mode
}) {
     const key = `${userId}:${tradeIndex}`
     const targetMs = closeTime * 1000
     // ── 1. set a timer to ARM the listener WARMUP_MS before closeTime ──
     const armDelay = Math.min(
          Math.max(targetMs - Date.now() - WARMUP_MS, 0),
          MAX_DELAY_MS
     )
     const armId = setTimeout(() => armListener(), armDelay)

     // ── 2. helper that attaches waitForPrice and the timeout guard ──
     function armListener() {
          priceFeed
               .waitForPrice(pair, targetMs)
               .then((finalPrice) => {
                    finalizeTrade({
                         mode,
                         roomName,
                         initialPrice,
                         tradeIndex,
                         percentage,
                         userId,
                         amount,
                         buyOrSell,
                         closeTime,
                         openTime,
                         io,
                         finalPrice,
                         pair,
                    })
               })
               .catch((err) => {
                    io.to(`trade-${userId}`).emit('tradeError', {
                         message: err.message,
                    })
               })
               .finally(() => cleanup())
     }

     // ── 3. cleanup helper ──
     function cleanup() {
          const h = timers.get(key)
          if (h?.armId) clearTimeout(h.armId)
          if (h?.guardId) clearTimeout(h.guardId)
          timers.delete(key)
     }

     timers.set(key, { armId })
     return key // let callers cancel if needed
}

export function cancelFinalize(key) {
     const h = timers.get(key)
     if (!h) return
     if (h.armId) clearTimeout(h.armId)
     if (h.guardId) clearTimeout(h.guardId)
     timers.delete(key)
}