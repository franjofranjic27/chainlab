# chainlab

> Eine persönliche Spielwiese, um Ethereum- und Blockchain-Technologie praktisch zu erkunden.

`chainlab` ist ein Monorepo. Jedes Lernthema lebt als eigenständiges Projekt in einem
eigenen Ordner — vom eigenen Coin über Smart Contracts bis hin zu einer dApp mit
Wallet-Anbindung. Das Ziel ist nicht ein Produkt, sondern Verstehen: Konzepte isoliert
ausprobieren, vergleichen und schrittweise aufeinander aufbauen.

---

## Tech-Stack & Tooling

| Bereich            | Wahl                          | Warum                                                        |
| ------------------ | ----------------------------- | ------------------------------------------------------------ |
| Contract-Sprache   | **Solidity**                  | De-facto-Standard für die EVM                                |
| Dev-Framework      | **Hardhat**                   | Compile, Test, Deploy, lokale Node — Tests in TypeScript     |
| Contract-Bausteine | **OpenZeppelin Contracts**    | Geprüfte, standardkonforme Implementierungen (ERC-20/721 …)  |
| Monorepo           | **pnpm workspaces**           | Schlank, schnell, ein Lock-File für alle Projekte            |
| Sprache durchgehend| **TypeScript**                | Tests, Skripte und Frontend einheitlich                      |
| Frontend           | **React + wagmi/viem**        | Moderne, typsichere Wallet- und Contract-Anbindung           |
| Netzwerke          | **Hardhat-Node + Sepolia**    | Lokal entwickeln, im Testnet gegen die echte Welt prüfen     |

Querschnittsthemen, die in mehreren Projekten auftauchen: lokale Chain, Testnet-Deployments,
**Gas-Optimierung** und **Security-Grundlagen** (Reentrancy, Access Control, Checks-Effects-Interactions).

---

## Monorepo-Struktur

```
chainlab/
├── package.json            # Root, private, workspace-Scripts
├── pnpm-workspace.yaml      # bindet packages/* und apps/* ein
├── .gitignore
├── README.md
├── packages/               # Smart-Contract-Projekte (je ein Hardhat-Projekt)
│   ├── erc20-token/
│   ├── hello-contracts/
│   ├── erc721-nft/
│   ├── dao-governance/
│   ├── multisig-wallet/
│   ├── account-abstraction/
│   ├── oracles/
│   └── upgradeable-proxies/
└── apps/                   # Frontends & Off-chain-Services
    ├── dapp-frontend/      # React + wagmi/viem
    └── event-indexing/     # Off-chain Event-Listener/Indexer
```

**Konvention:** `packages/` enthält Smart-Contract-Projekte (jeweils ein eigenständiges
Hardhat-Setup). `apps/` enthält alles, was *außerhalb* der Chain läuft — Frontends und Services.

---

## Use-Cases / Lern-Roadmap

Drei Tracks, vom Einstieg zum Fortgeschrittenen. Jedes Projekt beschreibt *Ziel*,
*Was du lernst* und *Schlüsselkonzepte*.

### Track 1 — Grundlagen: Smart Contracts & der eigene Coin

#### `erc20-token` — Dein eigener Coin
- **Ziel:** Einen fungiblen Token nach ERC-20 erstellen und deployen.
- **Was du lernst:** Wie "Coins" auf Ethereum technisch funktionieren — es ist nur ein Contract.
- **Schlüsselkonzepte:** `mint` / `transfer` / `burn`, Allowances (`approve` / `transferFrom`),
  `decimals`, `totalSupply`, Token-Standard via OpenZeppelin.

#### `hello-contracts` — Wie Smart Contracts funktionieren
- **Ziel:** Kleine, isolierte Contracts, um die Funktionsweise der EVM zu begreifen.
- **Was du lernst:** Storage vs. Memory, Transaktionen, Gas, Events.
- **Schlüsselkonzepte:** `msg.sender`, State-Variablen, `mapping`, Modifier, Events,
  Beispiele: Counter, Storage, einfaches Voting, Escrow.

#### `erc721-nft` — Non-Fungible Tokens
- **Ziel:** Eine NFT-Collection minten.
- **Was du lernst:** Unterschied fungibel vs. nicht-fungibel, Token-Metadata.
- **Schlüsselkonzepte:** ERC-721, `tokenURI` / Metadata, Ownership-Tracking, Minting-Logik.

### Track 2 — Governance & Wallets

#### `dao-governance` — On-Chain-Abstimmungen
- **Ziel:** Eine minimale DAO: Proposals erstellen und darüber abstimmen.
- **Was du lernst:** Wie kollektive Entscheidungen on-chain durchgesetzt werden.
- **Schlüsselkonzepte:** Proposals, Stimmgewicht über Token-Holdings, Quorum, Timelock.

#### `multisig-wallet` — Wallet mit mehreren Unterschriften
- **Ziel:** Eine Wallet, die M-von-N Bestätigungen für eine Transaktion braucht.
- **Was du lernst:** Geteilte Kontrolle über Funds, Transaktions-Lifecycle.
- **Schlüsselkonzepte:** Vorschlagen / Bestätigen / Ausführen, Owner-Set, Threshold.

#### `account-abstraction` — ERC-4337 Smart Accounts
- **Ziel:** Ein Smart-Contract-Account statt einer klassischen EOA.
- **Was du lernst:** Wie sich UX-Probleme (Gas, Recovery) auf Contract-Ebene lösen lassen.
- **Schlüsselkonzepte:** ERC-4337, UserOperations, Bundler, Paymaster (gasloses UX).

### Track 3 — Infrastruktur & dApp

#### `dapp-frontend` — Web-Frontend mit Wallet
- **Ziel:** Die Contracts aus den anderen Projekten im Browser nutzbar machen.
- **Was du lernst:** Wie ein Frontend mit der Chain spricht.
- **Schlüsselkonzepte:** Wallet-Connect (MetaMask), `wagmi`/`viem`, Contract-Reads & -Writes,
  Transaktions-Status im UI.

#### `oracles` — Externe Daten on-chain
- **Ziel:** Reale Daten (z. B. Preise) in einen Contract holen.
- **Was du lernst:** Warum Contracts die Außenwelt nicht direkt kennen.
- **Schlüsselkonzepte:** Oracle-Problem, Chainlink Price Feeds.

#### `event-indexing` — On-Chain-Events lesen & indexieren
- **Ziel:** Einen Off-chain-Service, der Contract-Events mitliest und auswertbar macht.
- **Was du lernst:** Wie man Chain-Daten effizient abfragt statt sie live zu pollen.
- **Schlüsselkonzepte:** Event-Logs, Listener, Reorgs, Ausblick: The Graph / Subgraphs.

#### `upgradeable-proxies` — Verträge upgraden
- **Ziel:** Einen Contract aktualisieren, obwohl deployter Code unveränderlich ist.
- **Was du lernst:** Wie Logik und State getrennt werden.
- **Schlüsselkonzepte:** Proxy-Pattern (Transparent / UUPS), Storage-Layout, OpenZeppelin Upgrades.

---

## Getting Started

**Voraussetzungen**
- [Node.js](https://nodejs.org/) (LTS)
- [pnpm](https://pnpm.io/) — `npm install -g pnpm`
- Eine Wallet, z. B. [MetaMask](https://metamask.io/)
- Ein RPC-Provider-Account für Testnet-Zugriff (z. B. [Alchemy](https://www.alchemy.com/) oder [Infura](https://www.infura.io/))

**Genereller Ablauf pro Projekt** (sobald Projekte angelegt sind)
```bash
pnpm install                         # Dependencies für das ganze Monorepo
pnpm --filter erc20-token compile     # Contracts kompilieren
pnpm --filter erc20-token test        # Tests ausführen
pnpm --filter erc20-token node        # lokale Hardhat-Node starten
pnpm --filter erc20-token deploy      # Deployment-Skript ausführen
```

Für Deployments ins **Sepolia-Testnet** wird Test-ETH benötigt — erhältlich über einen
[Sepolia-Faucet](https://sepoliafaucet.com/).

---

## Empfohlene Reihenfolge

Der Roadmap der Reihe nach folgen — die Tracks bauen aufeinander auf:

1. **Track 1** beginnend mit `erc20-token` → `hello-contracts` → `erc721-nft`
2. **Track 2** — Governance & Wallets
3. **Track 3** — Infrastruktur & dApp (`dapp-frontend` macht die früheren Contracts erlebbar)

---

## Ressourcen

- [Ethereum.org — Developer Portal](https://ethereum.org/en/developers/)
- [Solidity-Dokumentation](https://docs.soliditylang.org/)
- [Hardhat-Dokumentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [wagmi](https://wagmi.sh/) · [viem](https://viem.sh/)
- ERC-Standards: [EIP-20](https://eips.ethereum.org/EIPS/eip-20) ·
  [EIP-721](https://eips.ethereum.org/EIPS/eip-721) ·
  [EIP-4337](https://eips.ethereum.org/EIPS/eip-4337)

---

## Status / Fortschritt

Abgehakt wird, sobald ein Projekt steht.

**Track 1 — Grundlagen**
- [x] `erc20-token` — ChainlabToken (CLAB), mintable/burnable/ownable, 13 Tests grün
- [ ] `hello-contracts`
- [ ] `erc721-nft`

**Track 2 — Governance & Wallets**
- [ ] `dao-governance`
- [ ] `multisig-wallet`
- [ ] `account-abstraction`

**Track 3 — Infrastruktur & dApp**
- [ ] `dapp-frontend`
- [ ] `oracles`
- [ ] `event-indexing`
- [ ] `upgradeable-proxies`
