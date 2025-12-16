// utils/keys.js
import { Wallet as EthersWallet } from "ethers";
import TronWeb from "tronweb";
import { encryptPrivateKey } from "./crypto.js";

export async function generateEthAddress() {
    const w = EthersWallet.createRandom();
    const enc = encryptPrivateKey(w.privateKey); // may be null if WALLET_ENC_KEY_BASE64 unset
    return { address: w.address, encPrivateKey: enc };
}

export async function generateTronAddress() {
    const acct = TronWeb.utils.accounts.generateAccount(); // { address: { base58, hex }, privateKey }
    const enc = encryptPrivateKey(acct.privateKey);
    return { address: acct.address.base58, encPrivateKey: enc };
}
