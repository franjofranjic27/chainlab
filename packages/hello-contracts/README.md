# hello-contracts — Wie Smart Contracts funktionieren

Track 1 der [chainlab](../../README.md)-Roadmap. Vier kleine Contracts, **von Grund
auf und ohne OpenZeppelin** geschrieben — damit die rohe Mechanik der EVM sichtbar
wird, die `erc20-token` hinter geerbten Bausteinen versteckt hat.

## Die Contracts

| Contract            | Lern-Konzepte                                                            |
| ------------------- | ------------------------------------------------------------------------ |
| `Counter.sol`       | State-Variable, Funktionen, Events, Custom Errors, Auto-Getter           |
| `SimpleStorage.sol` | persistenter Storage, `msg.sender`, `view`-Funktionen, `public`/`private` |
| `Voting.sol`        | `struct`, dynamisches Array, `mapping`, `modifier`, `immutable`, `block.timestamp` |
| `Escrow.sol`        | `payable` / `msg.value`, ETH-Transfer per `.call`, `enum`-State-Machine, Checks-Effects-Interactions |

Empfohlene Lesereihenfolge: oben nach unten — die Konzepte bauen aufeinander auf.

## Befehle

```bash
pnpm install     # einmalig im Repo-Root
pnpm compile     # alle vier Contracts kompilieren
pnpm test        # viem-Tests ausfuehren (Verhalten jedes Contracts)
pnpm node        # optionale lokale Hardhat-Node (Port 8545)
```

> Vom Repo-Root: `pnpm --filter hello-contracts <script>`.

## Hinweis

Dies ist ein reines Lern-Projekt: kein Deployment, kein Testnet. Die Tests in
`test/` sind die ausfuehrbare Dokumentation — sie zeigen, wie sich jeder Contract
verhaelt, inklusive der Fehlerfaelle. Den Deployment-Flow zeigt `erc20-token`.
