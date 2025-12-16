import TronWeb from 'tronweb';

export function makeTron(tronUrl, apiKey) {
    const tron = new TronWeb({ fullHost: tronUrl });
    if (apiKey) tron.setHeader({ 'TRON-PRO-API-KEY': apiKey });
    return tron;
}