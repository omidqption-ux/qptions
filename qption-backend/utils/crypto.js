// utils/crypto.js
import crypto from "crypto";

// WALLET_ENC_KEY must be 32 bytes (base64 or hex). Use base64 here.
const KEY = Buffer.from(process.env.WALLET_ENC_KEY_BASE64 || "", "base64");
if (KEY.length && KEY.length !== 32) {
    console.warn("[crypto] WALLET_ENC_KEY_BASE64 length is not 32 bytes!");
}

export function encryptPrivateKey(pkHex) {
    if (!KEY.length) return null; // allow null to avoid storing private key
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
    const ct = Buffer.concat([cipher.update(pkHex, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, ct]).toString("base64"); // iv(12) | tag(16) | ct
}

export function decryptPrivateKey(b64) {
    const buf = Buffer.from(b64, "base64");
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const ct = buf.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, iv);
    decipher.setAuthTag(tag);
    const pt = Buffer.concat([decipher.update(ct), decipher.final()]);
    return pt.toString("utf8");
}
