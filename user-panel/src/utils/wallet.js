export function isValidCryptoAddress(address, type) {
     const regexes = {
          bitcoin: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, // Legacy & P2SH
          ethereum: /^0x[a-fA-F0-9]{40}$/, // Ethereum & ERC-20
          litecoin: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/, // Litecoin
          dogecoin: /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/, // Dogecoin
          ripple: /^r[0-9a-zA-Z]{24,34}$/, // XRP
          tron: /^T[A-Za-z1-9]{33}$/, // TRON
          cardano: /^addr1[a-z0-9]+$/, // Cardano (Shelley)
          polkadot: /^1[a-km-zA-HJ-NP-Z1-9]{47,48}$/, // Polkadot
     }

     if (!regexes[type]) {
          throw new Error('Unsupported cryptocurrency type')
     }

     return regexes[type].test(address)
}
