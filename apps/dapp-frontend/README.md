# dapp-frontend — ChainLab DApp

Track 3 der [chainlab](../../README.md)-Roadmap: das Web-Frontend, das die
Contracts im Browser nutzbar macht.

Erste Iteration: das **Dashboard** aus dem Design-Handoff
(`packages/design_handoff_clab_dapp`) — Portfolio-Übersicht mit Hero-Strip,
CLAB/USD-Chart, Quick Swap, Holdings, Recent Activity und Liquidity Pools.

## Stack

| Bereich  | Wahl                          |
| -------- | ----------------------------- |
| Build    | Vite + React 19 + TypeScript  |
| Styling  | Design-Tokens als CSS-Variablen (`src/styles.css`, 1:1 aus dem Handoff) |
| Icons    | Hand-gerollte Inline-SVG (`src/icons.tsx`) |

## Befehle

```bash
pnpm install                       # einmalig im Repo-Root
pnpm --filter dapp-frontend dev     # Dev-Server (Vite)
pnpm --filter dapp-frontend build   # Typecheck + Production-Build
pnpm --filter dapp-frontend preview # Production-Build lokal ansehen
```

## Struktur

```
src/
├── App.tsx                 # Shell: Theme, Sidebar-Collapse, aktive Seite
├── styles.css              # Design-Tokens + Komponenten-CSS
├── icons.tsx               # Icon-Set
├── lib/chart.ts            # deterministische Series + SVG-Pfade
├── components/             # Shell: Sidebar, Topbar, PriceChart, Sparkline, PlaceholderPage
└── features/dashboard/     # Dashboard-Karten + Seed-Daten
```

## Status & nächste Schritte

Das Dashboard rendert mit **gemockten Daten** (siehe `features/dashboard/data.ts`).
Noch offen — bewusst nach dem Handoff aufgeschoben:

- **Live-Daten:** wagmi/viem-Anbindung an den deployten `ChainlabToken` —
  `balanceOf`, `Transfer`-Events; Preis über Oracle/Subgraph.
- **Wallet-Connect:** im Handoff noch nicht designt; Topbar zeigt einen
  verbundenen Zustand als Platzhalter.
- **Weitere Seiten:** Wallet, Swap, Liquidity, NFTs, Transactions, Analytics,
  Settings nutzen die `PlaceholderPage`, bis eigene Designs vorliegen.
