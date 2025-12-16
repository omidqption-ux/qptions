import { ethers } from "ethers";

const mnemonic = "measure local sight judge neck analyst edit shed infant fame hip birth";
const wallet = ethers.Wallet.fromPhrase(mnemonic); // default is account #0
console.log("Address:", wallet.address);
console.log("Private key:", wallet.privateKey);