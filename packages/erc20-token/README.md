# erc20-token — Dein eigener Coin

Track 1 der [chainlab](../../README.md)-Roadmap: ein fungibler ERC-20-Token.
Zeigt, dass ein "Coin" auf Ethereum technisch nichts weiter als ein Smart Contract ist.

## ChainlabToken (CLAB)

`contracts/ChainlabToken.sol` kombiniert drei OpenZeppelin-Bausteine:

| Baustein        | Funktion                                                        |
| --------------- |-----------------------------------------------------------------|
| `ERC20`         | Standard für fungible Token: `transfer`, `approve`, `allowance` |
| `ERC20Burnable` | Halter koennen eigene Token vernichten (`burn`, `burnFrom`)     |
| `Ownable`       | Access Control — nur der Owner darf `mint` aufrufen             |

- **Name / Symbol:** `Chainlab Token` / `CLAB`, 18 Decimals
- **Initial-Supply:** 1.000.000 CLAB, beim Deploy an den Owner gemintet
- **Minting:** unbegrenzt, aber nur durch den Owner (kein Cap)

## Befehle

```bash
pnpm install            # einmalig im Repo-Root
pnpm compile            # Contract kompilieren
pnpm test               # viem-Tests ausfuehren
pnpm node               # lokale Hardhat-Node starten (Port 8545)
pnpm deploy:local       # Ignition-Deploy gegen die laufende lokale Node
pnpm deploy:sepolia     # Deploy ins Sepolia-Testnet (braucht .env)
```

> Lauf `pnpm --filter erc20-token <script>` vom Repo-Root oder die nackten
> Scripts aus diesem Verzeichnis.

## Sepolia-Deployment

1. `.env.example` nach `.env` kopieren und ausfuellen
   (`SEPOLIA_RPC_URL`, `SEPOLIA_PRIVATE_KEY`).
2. Test-ETH ueber einen [Sepolia-Faucet](https://sepoliafaucet.com/) holen.
3. `pnpm deploy:sepolia` ausfuehren.

Die `.env` ist git-ignoriert — echte Secrets gehoeren niemals ins Repo.

## Lern-Konzepte

- ERC-20 als Token-Standard (`EIP-20`)
- Allowances: `approve` / `transferFrom` (delegierte Transfers)
- `_mint` / `_burn` und das zentrale `_update`-Hook in OpenZeppelin v5
- Access Control via `Ownable` und der `onlyOwner`-Modifier
- Deployment mit Hardhat Ignition (deklarative Module)
