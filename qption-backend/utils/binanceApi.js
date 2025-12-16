import axios from '../config/binanceAxios.js'
const MAX_LIMIT = 1000
export function formatTypicalPrice(high, low, close) {
     const raw = (Number(high) + Number(low) + Number(close)) / 3

     /* 1 ─ stringify without scientific notation */
     let str = raw.toString()
     if (str.includes('e')) {
          str = raw.toFixed(13).replace(/\.?0+$/, '') // drop trailing zeros
     }

     /* 2 ─ make sure a dot exists */
     if (!str.includes('.')) str += '.'

     const [intPart, decPartRaw = ''] = str.split('.')
     const first2 = (decPartRaw + '00').slice(0, 2)

     const randomLen = Math.max(1, decPartRaw.length - 2)

     let randomTail = ''
     for (let i = 0; i < randomLen; i++) {
          randomTail += Math.floor(Math.random() * 10) // 0‑9
     }

     return `${intPart}.${first2}${randomTail}`
}
export async function fetchRecentKlines(
     symbol,
     interval,
     count,
     endTime = Date.now()
) {
     let remaining = count
     let cursor = endTime // walk backwards
     const chunks = []
     while (remaining > 0) {
          const batchSize = Math.min(remaining, MAX_LIMIT)

          const data = await axios.get('/api/v3/klines', {
               params: { symbol, interval, endTime: cursor, limit: batchSize },
          })

          if (!data.length) break // ran out of history
          chunks.push(data)
          remaining -= data.length
          cursor = data[0][0] - 1 // openTime of first candle −1 ms
     }

     // flatten & map to nicer objects
     return chunks.flat().map((k) => ({
          date: k[0], // open time
          open: +k[1],
          high: +k[2],
          low: +k[3],
          close: +k[4],
          value: +formatTypicalPrice(k[2], k[3], k[4]),
     }))
}
