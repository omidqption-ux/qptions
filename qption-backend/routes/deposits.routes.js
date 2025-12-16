// routes/deposits.routes.js
import { Router } from "express";
import Wallet from "../models/wallet/Wallet.js";
import Transaction from "../models/wallet/Transaction.js";
import LedgerEntry from "../models/wallet/LedgerEntry.js";
import Balance from "../models/wallet/Balance.js";
import { generateEthAddress, generateTronAddress } from "../utils/keys.js";
import { fromMicros } from "../utils/units.js";
import { verifyToken } from '../middlewares/authMiddleware.js'

const router = Router();

router.get("/address", verifyToken, async (req, res) => {
    try {
        const { chain } = req.query;
        const norm = (chain || "").toUpperCase();

        if (!["ETH", "TRON"].includes(norm)) {
            return res.status(400).json({ error: "Invalid chain. Use 'eth' or 'tron'." });
        }

        let wallet = await Wallet.findOne({ userId: req.user._id, chain: norm });
        if (!wallet) {
            const gen = norm === "ETH" ? await generateEthAddress() : await generateTronAddress();
            wallet = await Wallet.create({
                userId: req.user._id,
                chain: norm,
                address: gen.address,
                encPrivateKey: gen.encPrivateKey
            });
        }

        return res.json({
            chain: wallet.chain,
            address: wallet.address,
            network: wallet.chain === "ETH" ? "ERC20" : "TRC20",
            note: "Send ONLY USDT on the selected network to this address."
        });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
})

router.get("/history", verifyToken, async (req, res) => {
    try {
        const [ledgers, txs] = await Promise.all([
            LedgerEntry.find({ userId: req.user._id, type: "deposit" })
                .sort({ createdAt: -1 })
                .lean(),
            Transaction.find({ userId: req.user._id })
                .sort({ createdAt: -1 })
                .lean()
        ]);

        const ledgerOut = ledgers.map(l => ({
            ...l,
            amount: fromMicros(l.amountMicros)
        }));
        const txOut = txs.map(t => ({
            ...t,
            amount: fromMicros(t.amountMicros)
        }));

        res.json({ ledger: ledgerOut, transactions: txOut });
    } catch (err) {
        console.error("[/history] error", err);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/balances", verifyToken, async (req, res) => {
    try {
        const bals = await Balance.find({ userId: req.user._id }).lean();
        const out = bals.map(b => ({
            chain: b.chain,
            asset: b.asset,
            available: fromMicros(b.availableMicros),
            pending: fromMicros(b.pendingMicros),
            updatedAt: b.updatedAt
        }));
        res.json({ balances: out });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
