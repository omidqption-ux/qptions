import axiosInstance from '../config/axios.js'
const TICKERS_100 = [
     'X:BTCUSD', 'X:ETHUSD', 'X:USDTUSD', 'X:BNBUSD', 'X:SOLUSD',
     'X:XRPUSD', 'X:DOGEUSD', 'X:ADAUSD', 'X:TRXUSD',
     'X:AVAXUSD', 'X:SHIBUSD', 'X:DOTUSD',
     'X:BCHUSD', 'X:UNIUSD', 'X:LTCUSD', 'X:MATICUSD',
     'X:ETCUSD', 'X:ATOMUSD',
]
export const getLatestMarketData = async (req, res) => {
     try {


          const POLY_URL = '/v2/snapshot/locale/global/markets/crypto/tickers'


          const results = []

          const resp = await axiosInstance.get(POLY_URL, {
               baseURL: 'https://api.polygon.io',
               params: { tickers: TICKERS_100.join(',') },
               headers: { Authorization: `Bearer ${process.env.POLYGON_API_KEY}` },
               timeout: 10_000,
          })
          if (resp?.tickers) results.push(...resp.tickers)


          return res.status(200).json(results)
     } catch (err) {
          return res.status(500).json({ message: err.message })
     }
}
