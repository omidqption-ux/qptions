// utils/units.js
export const USDT_DECIMALS = 6;

export function toMicros(usdtFloatOrString) {
    // Safe for typical retail deposits; if you expect enormous values, switch to BigInt math.
    return Math.round(Number(usdtFloatOrString) * 10 ** USDT_DECIMALS);
}

export function fromMicros(micros) {
    return (Number(micros) / 10 ** USDT_DECIMALS).toFixed(6);
}
