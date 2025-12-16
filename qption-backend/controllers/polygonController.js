import { restClient } from '@polygon.io/client-js';

const apiKey = "pvqQCG8azOv7q7x4z5YXnxgVyhvsPlfk";
const rest = restClient(apiKey, 'https://api.polygon.io');

const fetchPagedTickers = async (initialUrl, page) => {
    let currentPage = 1;
    let url = initialUrl;
    let response;

    while (currentPage <= page) {
        response = await rest.listTickers({ url }); // If `url` is set, use it directly
        url = response.next_url; // Prepare for next loop
        currentPage++;
        if (!url) break; // No more pages
    }
    return response;
}
export const getForexSymbols = async (req, res) => {
    const page = parseInt(req.query.page) || 1;

    try {
        const initialParams = {
            market: "crypto",
            active: "true",
            order: "asc",
            limit: "100",
            sort: "ticker"
        }
        const response = await fetchPagedTickers(initialParams, page);
        if (!response) {
            return res.status(404).json({ message: 'No data found for this page' });
        }
        const tickersList = response.results.map(item => ({
            ticker: item.ticker,
            market: item.market,
        }))
        res.status(200).json({
            tickersList,
            nextPageAvailable: !!response.next_url,
        })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}