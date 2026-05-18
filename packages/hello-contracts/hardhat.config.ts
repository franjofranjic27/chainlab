import type { HardhatUserConfig } from "hardhat/config";
import hardhatToolboxViem from "@nomicfoundation/hardhat-toolbox-viem";

// Reines Lern-Projekt: nur lokale Netzwerke, kein Testnet, keine Secrets.
const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViem],
  // Ohne Deployment genuegt die einfache `version`-Form — anders als bei
  // `erc20-token`, das fuer Sepolia ein optimiertes `production`-Profil hat.
  solidity: {
    version: "0.8.28",
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
  },
};

export default config;
