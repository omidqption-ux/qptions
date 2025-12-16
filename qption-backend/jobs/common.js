import '../config/env.js'

// jobs/common.js
import mongoose from 'mongoose';
import { decryptPrivateKey } from '../utils/crypto.js';
import Wallet from '../models/wallet/Wallet.js';

export async function initMongo() {
    mongoose.set('strictQuery', true);
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error('MONGO_URI missing');
    await mongoose.connect(uri);
}

export async function getSweepCandidates(chain) {
    // All user deposit wallets for that chain
    return Wallet.find({ chain }).lean();
}

export function usdtToUnits(amountUsdt, decimals = 6) {
    // Use BigInt to avoid float issues
    const micros = Math.round(Number(amountUsdt) * 10 ** decimals);
    return BigInt(micros);
}

export function toBigIntUnits(num, decimals = 6) {
    // num is JS number (USDT); convert to token units (6 decimals)
    return BigInt(Math.round(Number(num) * 10 ** decimals));
}

export function fromUnitsToUsdt(units, decimals = 6) {
    return Number(units) / 10 ** decimals;
}

export function decryptPkOrThrow(enc) {
    if (!enc) throw new Error('No encPrivateKey stored for this address');
    return decryptPrivateKey(enc); // returns hex string (ETH) or base58/hex (TRON generator gave hex)
}

export function minSweep(chain) {
    const v = chain === 'ETH'
        ? Number(process.env.MIN_SWEEP_USDT_ETH || 10)
        : Number(process.env.MIN_SWEEP_USDT_TRON || 10);
    return v;
}
