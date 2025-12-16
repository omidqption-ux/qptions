// services/deposits/minDeposit.js
const DEC = 6;

export function getMinDepositMicros(chain /* 'ETH' | 'TRON' */) {
    const trcMin = Number(process.env.MIN_DEPOSIT_USDT_TRC20 || 10);  // 10 USDT
    const ercMin = Number(process.env.MIN_DEPOSIT_USDT_ERC20 || 30);  // 30 USDT
    const usdt = chain === 'TRON' ? trcMin : ercMin;
    return Math.round(usdt * 10 ** DEC);
}
