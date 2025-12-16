import axios from '../config/polyGonAxios.js'

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
          value: +k[4],
     }))
}