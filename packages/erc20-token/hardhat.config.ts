import { existsSync } from "node:fs";

import type { HardhatUserConfig } from "hardhat/config";
import { configVariable } from "hardhat/config";
import hardhatToolboxViem from "@nomicfoundation/hardhat-toolbox-viem";

// Hardhat 3 laedt .env-Dateien nicht automatisch. Node >= 20.12 kann das nativ —
// damit funktionieren SEPOLIA_RPC_URL / SEPOLIA_PRIVATE_KEY aus einer lokalen .env.
if (existsSync(new URL(".env", import.meta.url))) {
  process.loadEnvFile();
}

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViem],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    },
  },
  networks: {
    // In-Process-Chain fuer Tests — schnell, ephemer.
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    // Verbindung zu einer laufenden `hardhat node` (JSON-RPC auf Port 8545).
    localhost: {
      type: "http",
      chainType: "l1",
      url: "http://127.0.0.1:8545",
    },
    // Oeffentliches Ethereum-Testnet — RPC-URL & Key kommen aus der .env.
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
};

export default config;
