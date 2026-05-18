import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { parseEther } from "viem";

/// Initial-Supply: 1.000.000 CLAB. `parseEther` rechnet auf 18 Decimals hoch —
/// dieselbe Schreibweise wie in den Tests, damit die Werte konsistent bleiben.
const ONE_MILLION_TOKENS = parseEther("1000000");

/**
 * Hardhat-Ignition-Modul fuer den ChainlabToken.
 *
 * Deploy lokal:   pnpm deploy:local   (gegen eine laufende `hardhat node`)
 * Deploy Sepolia: pnpm deploy:sepolia (braucht .env mit RPC-URL & Private Key)
 *
 * Parameter lassen sich beim Deploy ueberschreiben, z. B. via --parameters.
 */
export default buildModule("ChainlabTokenModule", (m) => {
  const initialSupply = m.getParameter("initialSupply", ONE_MILLION_TOKENS);
  const initialOwner = m.getParameter("initialOwner", m.getAccount(0));

  const token = m.contract("ChainlabToken", [initialSupply, initialOwner]);

  return { token };
});
