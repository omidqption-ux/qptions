import { restClient } from '@polygon.io/client-js'
const rest = restClient(process.env.POLYGON_API_KEY)

const cryptoSymbols = [
    // Cardano
    { title: 'X:ADAUSD', payoutPercentage: 90, desc: 'Cardano - United States Dollar', currency_symbol: 'USD', base_currency_symbol: 'ADA' },

    // Avalanche
    { title: 'X:AVAXUSD', payoutPercentage: 82, desc: 'Avalanche - United States Dollar', currency_symbol: 'USD', base_currency_symbol: 'AVAX' },

    // Bitcoin
    { title: 'X:BTCUSD', payoutPercentage: 96, desc: 'Bitcoin - United States Dollar', currency_symbol: 'USD', base_currency_symbol: 'BTC' },

    // Dogecoin
    { title: 'X:DOGEUSD', payoutPercentage: 88, desc: 'Dogecoin - United States Dollar', currency_symbol: 'USD', base_currency_symbol: 'DOGE' },

    // Ethereum
    { title: 'X:ETHUSD', payoutPercentage: 94, desc: 'Ethereum - United States Dollar', currency_symbol: 'USD', base_currency_symbol: 'ETH' },

    // Litecoin
    { title: 'X:LTCUSD', payoutPercentage: 84, desc: 'Litecoin - United States Dollar', currency_symbol: 'USD', base_currency_symbol: 'LTC' },

    // Solana
    { title: 'X:SOLUSD', payoutPercentage: 90, desc: 'Solana - United States Dollar', currency_symbol: 'USD', base_currency_symbol: 'SOL' },

    // Uniswap
    { title: 'X:UNIUSD', payoutPercentage: 78, desc: 'Uniswap - United States Dollar', currency_symbol: 'USD', base_currency_symbol: 'UNI' },

    // Stellar
    { title: 'X:XLMUSD', payoutPercentage: 78, desc: 'Stellar - United States Dollar', currency_symbol: 'USD', base_currency_symbol: 'XLM' },

    // Ripple
    { title: 'X:XRPUSD', payoutPercentage: 88, desc: 'Ripple - United States Dollar', currency_symbol: 'USD', base_currency_symbol: 'XRP' },
]

const forexSymbols = [
    // AUD
    { title: 'C:AUDCAD', payoutPercentage: 88, desc: 'Australian dollar - Canadian dollar', currency_symbol: 'CAD', base_currency_symbol: 'AUD' },
    { title: 'C:AUDEUR', payoutPercentage: 90, desc: 'Australian dollar - Euro', currency_symbol: 'EUR', base_currency_symbol: 'AUD' },
    { title: 'C:AUDJPY', payoutPercentage: 76, desc: 'Australian dollar - Japanese yen', currency_symbol: 'JPY', base_currency_symbol: 'AUD' },
    { title: 'C:AUDUSD', payoutPercentage: 92, desc: 'Australian dollar - United States Dollar', currency_symbol: 'USD', base_currency_symbol: 'AUD' },

    // CAD
    { title: 'C:CADAED', payoutPercentage: 75, desc: 'Canadian dollar - United Arab Emirates dirham', currency_symbol: 'AED', base_currency_symbol: 'CAD' },
    { title: 'C:CADAUD', payoutPercentage: 78, desc: 'Canadian dollar - Australian dollar', currency_symbol: 'AUD', base_currency_symbol: 'CAD' },
    { title: 'C:CADCHF', payoutPercentage: 76, desc: 'Canadian dollar - Swiss franc', currency_symbol: 'CHF', base_currency_symbol: 'CAD' },
    { title: 'C:CADEUR', payoutPercentage: 80, desc: 'Canadian dollar - Euro', currency_symbol: 'EUR', base_currency_symbol: 'CAD' },
    { title: 'C:CADGBP', payoutPercentage: 78, desc: 'Canadian dollar - Pound sterling', currency_symbol: 'GBP', base_currency_symbol: 'CAD' },
    { title: 'C:CADJPY', payoutPercentage: 77, desc: 'Canadian dollar - Japanese yen', currency_symbol: 'JPY', base_currency_symbol: 'CAD' },
    { title: 'C:CADUSD', payoutPercentage: 84, desc: 'Canadian dollar - United States Dollar', currency_symbol: 'USD', base_currency_symbol: 'CAD' },

    // EUR
    { title: 'C:EURAUD', payoutPercentage: 88, desc: 'Euro - Australian dollar', currency_symbol: 'AUD', base_currency_symbol: 'EUR' },
    { title: 'C:EURCAD', payoutPercentage: 88, desc: 'Euro - Canadian dollar', currency_symbol: 'CAD', base_currency_symbol: 'EUR' },
    { title: 'C:EURCHF', payoutPercentage: 86, desc: 'Euro - Swiss franc', currency_symbol: 'CHF', base_currency_symbol: 'EUR' },
    { title: 'C:EURGBP', payoutPercentage: 89, desc: 'Euro - Pound sterling', currency_symbol: 'GBP', base_currency_symbol: 'EUR' },
    { title: 'C:EURJPY', payoutPercentage: 90, desc: 'Euro - Japanese yen', currency_symbol: 'JPY', base_currency_symbol: 'EUR' },
    { title: 'C:EURSGD', payoutPercentage: 82, desc: 'Euro - Singapore dollar', currency_symbol: 'SGD', base_currency_symbol: 'EUR' },
    { title: 'C:EURUSD', payoutPercentage: 96, desc: 'Euro - United States Dollar', currency_symbol: 'USD', base_currency_symbol: 'EUR' },

    // GBP
    { title: 'C:GBPAUD', payoutPercentage: 83, desc: 'Pound sterling - Australian dollar', currency_symbol: 'AUD', base_currency_symbol: 'GBP' },
    { title: 'C:GBPCAD', payoutPercentage: 80, desc: 'Pound sterling - Canadian dollar', currency_symbol: 'CAD', base_currency_symbol: 'GBP' },
    { title: 'C:GBPCHF', payoutPercentage: 74, desc: 'Pound sterling - Swiss franc', currency_symbol: 'CHF', base_currency_symbol: 'GBP' },
    { title: 'C:GBPEUR', payoutPercentage: 85, desc: 'Pound sterling - Euro', currency_symbol: 'EUR', base_currency_symbol: 'GBP' },
    { title: 'C:GBPJPY', payoutPercentage: 82, desc: 'Pound sterling - Japanese yen', currency_symbol: 'JPY', base_currency_symbol: 'GBP' },
    { title: 'C:GBPSGD', payoutPercentage: 78, desc: 'Pound sterling - Singapore dollar', currency_symbol: 'SGD', base_currency_symbol: 'GBP' },
    { title: 'C:GBPUSD', payoutPercentage: 94, desc: 'Pound sterling - United States Dollar', currency_symbol: 'USD', base_currency_symbol: 'GBP' },

    // USD
    { title: 'C:USDAUD', payoutPercentage: 88, desc: 'United States Dollar - Australian dollar', currency_symbol: 'AUD', base_currency_symbol: 'USD' },
    { title: 'C:USDCAD', payoutPercentage: 90, desc: 'United States dollar - Canadian dollar', currency_symbol: 'CAD', base_currency_symbol: 'USD' },
    { title: 'C:USDCHF', payoutPercentage: 85, desc: 'United States dollar - Swiss franc', currency_symbol: 'CHF', base_currency_symbol: 'USD' },
    { title: 'C:USDEUR', payoutPercentage: 96, desc: 'United States dollar - Euro', currency_symbol: 'EUR', base_currency_symbol: 'USD' },
    { title: 'C:USDGBP', payoutPercentage: 94, desc: 'United States dollar - Pound sterling', currency_symbol: 'GBP', base_currency_symbol: 'USD' },
    { title: 'C:USDJPY', payoutPercentage: 95, desc: 'United States dollar - Japanese yen', currency_symbol: 'JPY', base_currency_symbol: 'USD' },
    { title: 'C:USDSGD', payoutPercentage: 80, desc: 'United States dollar - Singapore dollar', currency_symbol: 'SGD', base_currency_symbol: 'USD' },
]

export const checkMarketStatus = async (req, res) => {
    const { market } = req.query /// "fx" || "crypto"
    try {
        const data = await rest.getMarketStatus()
        let isOpen = market === "fx" ? data?.currencies?.fx === 'open' : data?.currencies?.crypto === 'open'
        return res.status(200).json({ isOpen })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}

export const isMarketactive = async (market) => {

    try {
        const data = await rest.getMarketStatus()
        return market === "fx" ? data?.currencies?.fx === 'open' : data?.currencies?.crypto === 'open'

    } catch (error) {
        return ({ message: error.message })
    }
}

const toNumber = (v) => (typeof v === 'number' ? v : Number(v))

function buildResponse(list, query, market) {
    // query params
    const q = (query.q || '').trim().toUpperCase();
    const minPayout = query.minPayout != null ? Number(query.minPayout) : null;
    const page = Math.max(1, Number(query.page || 1));
    const limit = Math.min(500, Math.max(1, Number(query.limit || 100)));
    const sort = (query.sort || 'symbol').toLowerCase(); // 'symbol' | 'payout' | '-payout'

    // normalize + dedupe by symbol
    const normalized = [];
    const seen = new Set();
    for (const item of list) {
        const symbol = String(item.title).toUpperCase();
        if (seen.has(symbol)) continue;
        seen.add(symbol);
        normalized.push({
            symbol,
            payoutPercentage: toNumber(item.payoutPercentage),
            desc: item.desc,
            market
        });
    }

    // filter
    let filtered = normalized;
    if (q) filtered = filtered.filter((x) => x.symbol.includes(q));
    if (minPayout != null && !Number.isNaN(minPayout)) {
        filtered = filtered.filter((x) => x.payoutPercentage >= minPayout);
    }

    // sort
    if (sort === 'symbol') {
        filtered.sort((a, b) => a.symbol.localeCompare(b.symbol));
    } else if (sort === 'payout') {
        filtered.sort((a, b) => a.payoutPercentage - b.payoutPercentage);
    } else if (sort === '-payout') {
        filtered.sort((a, b) => b.payoutPercentage - a.payoutPercentage);
    }

    // paginate
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const items = filtered.slice(start, start + limit);

    return {
        items,
        total,
        page,
        pages,
        limit,
    }
}

export const getFxSymbols = async (req, res) => {
    try {
        const data = buildResponse(forexSymbols, req.query, 'fx');
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getCryptoSymbols = async (req, res) => {
    try {
        const data = buildResponse(cryptoSymbols, req.query, 'crypto');
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
