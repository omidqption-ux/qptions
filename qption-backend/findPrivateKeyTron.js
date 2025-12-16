import bip39 from "bip39";
import hdkey from "hdkey";
import pkg from "js-sha3";         // ✅ import default
import bs58check from "bs58check";
import elliptic from "elliptic";

const { keccak_256 } = pkg;        // ✅ pull out function

// ---- usage ----
// MNEMONIC="word1 ... word12" node findPrivateKeyTron.js --index 0
// index = 0 is the first TRON account under that seed

function arg(name, def) {
    const i = process.argv.indexOf(name);
    return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
}

const mnemonic = (process.env.MNEMONIC || "").trim();
if (!mnemonic) {
    console.error("ERROR: set MNEMONIC env var (your 12/24 words).");
    process.exit(1);
}

const index = Number(arg("--index", "0"));
if (!Number.isInteger(index) || index < 0) {
    console.error("ERROR: --index must be a non-negative integer");
    process.exit(1);
}

// TRON BIP44 path (coin type 195)
const path = `m/44'/195'/0'/0/${index}`;

try {
    // 1) mnemonic -> seed
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    // 2) derive child key at TRON path
    const root = hdkey.fromMasterSeed(seed);
    const child = root.derive(path);

    // 3) private key (hex, no 0x)
    const pkHex = child.privateKey.toString("hex");

    // 4) compute TRON address from private key
    const ec = new elliptic.ec("secp256k1");
    const key = ec.keyFromPrivate(child.privateKey);
    const pub = key.getPublic(false, "hex").slice(2); // drop "04" prefix

    const hash = keccak_256(Buffer.from(pub, "hex"));
    const ethStyleAddress = hash.slice(24 * 2); // last 20 bytes

    const tronHex = Buffer.from("41" + ethStyleAddress, "hex");
    const tronBase58 = bs58check.encode(tronHex);

    console.log("Derivation path:", path);
    console.log("TRON funder address:", tronBase58);     // T...
    console.log("FUNDER_TRON_PRIVATE_KEY:", pkHex);      // paste to .env
    console.log(`\nPaste into .env:\nFUNDER_TRON_PRIVATE_KEY=${pkHex}`);
} catch (e) {
    console.error("Failed to derive TRON key:", e?.message || e);
    process.exit(1);
}
