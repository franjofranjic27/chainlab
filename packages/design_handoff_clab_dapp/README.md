# Handoff: ChainLab (CLAB) DApp — Dashboard

## Overview

A high-fidelity design for **ChainLab**, a Web3 DApp dashboard for the user's own ERC-20 token **CLAB**. The core screen is a portfolio overview combining wallet balance, a live CLAB/USD price chart, quick token swap, multi-asset holdings, recent on-chain activity, and liquidity-pool positions. Sidebar entries for Wallet, Swap, Liquidity, NFTs, Transactions, Analytics and Settings are stubs for future iteration.

## About the design files

The files in `reference/` are **design references created in HTML/JSX** — a prototype showing intended look-and-feel, layout, and interactions. They are **not production code to copy directly**.

Your task is to **recreate these designs in your target codebase's environment**:

- If a stack already exists (Next.js + RainbowKit/wagmi, Vite + React + Web3-React, Remix, etc.), reuse its components, theming, and contract-binding patterns.
- If no stack exists yet, the recommended starting point is **Next.js (App Router) + TypeScript + Tailwind CSS + wagmi + viem + RainbowKit/ConnectKit**, with Recharts or visx for charts.
- Replace mocked wallet/token data with live reads from the deployed CLAB contract (ERC-20: `balanceOf`, `Transfer` events, etc.) and on-chain price oracles or a subgraph.

## Fidelity

**High-fidelity (hi-fi).** Final colors, typography, spacing, radii, interaction states and motion are settled. Match them pixel-for-pixel using your codebase's components and tokens.

---

## App shell

A 2-column grid: collapsible **sidebar** (left) + **main column** (topbar above content). The grid template responds to a `collapsed` boolean — `240px 1fr` expanded, `68px 1fr` collapsed — with a 220ms cubic-bezier(.2,.7,.2,1) transition on `grid-template-columns`.

Top-level state managed in the root component:

- `theme: 'dark' | 'light'` — default `'dark'`; toggled via topbar sun/moon button. Apply via `data-theme="dark|light"` attribute on `<html>` so CSS variables can re-bind.
- `collapsed: boolean` — sidebar state; applied as `data-collapsed="true|false"` on the app shell.
- `active: string` — current nav item id; switches the content area.

### Sidebar

- Width: `240px` expanded · `68px` collapsed. Background `var(--bg-elev)`, right border `1px solid var(--border)`.
- **Header (60px tall)**:
  - Logo: 30×30 rounded-square (`border-radius: 7px`) with linear-gradient `135deg, #7c5cff → #5a3fe0`, white "CL" wordmark, subtle inner highlight + purple drop-shadow.
  - Brand: "ChainLab" (14.5px / 600) with sublabel "CLAB Protocol" (11px / muted).
  - Collapse chevron button: 28×28, ghost button, hidden when collapsed.
  - When collapsed: header centers the logo; **clicking the logo expands the sidebar**.
- **Nav**: three groups with uppercase section labels (`MAIN`, `ASSETS`, `ACCOUNT`, 10.5px / 600 / 0.08em letter-spacing / muted color). When collapsed the labels become hairline `1px` dividers between groups (first divider hidden).
- **Items**: full-width pill buttons. Default state is muted text; hover lightens background to `--surface-hover`; active state has `--surface` background, 1px inset ring of `--border`, and a 2px-wide accent rail flush to the left edge of the item.
- **Badges** (e.g. `v3` on Swap, `12` on NFTs): pill, `--accent-soft` background, accent text, 10.5px JetBrains Mono. Hidden when collapsed.
- **Footer**: 30×30 avatar with multi-radial-gradient (orange+purple+green/blue blend), wallet alias `vitalik.lab` (13px / 600), short address `0x4f2a…9b1c` (11.5px mono / muted). Footer centers the avatar when collapsed; metadata is `display: none`.

### Topbar (60px tall)

Left → right:

1. **Breadcrumb**: `ChainLab / <active page name>` — muted root, bold current.
2. **Search**: 280px ghost input with `--surface` background, magnifying-glass icon, `⌘K` kbd hint. Placeholder: "Search tokens, addresses, or transactions…"
3. **Network pill** (right-aligned group starts here): "Ethereum" with green status dot (8px circle, `--positive`, with 2px halo) + chev-down.
4. **Theme toggle**: 34×34 icon button; sun icon when dark, moon icon when light.
5. **Notifications**: 34×34 icon button with bell + 6px accent dot indicator.
6. **Wallet pill**: pill-shaped, 24×24 avatar, address `0x4f2a…9b1c` (12.5px / 600 / mono) above balance `2.847 ETH` (10.5px / muted).

---

## Dashboard view

### Page head
- H1 greeting "Good evening, vitalik.lab" (22px / 600 / -0.02em).
- Subtitle "Here's what's happening with your portfolio today." (13.5px / muted).
- Right side: secondary button "View on Etherscan" (external-link icon) + primary button "New transfer" (plus icon, accent fill).

### 1. Hero strip (one card, 4 cells side-by-side)

A single card divided by vertical 1px borders into 4 cells:

| Cell | Label | Value | Meta |
|------|-------|-------|------|
| 1 (1.4fr) | PORTFOLIO VALUE | `$48,392.17` (26px mono) | `+2.41% · $1,138.22` green pill + "last 24h" + action row: Send (primary), Receive, Swap |
| 2 (1fr) | CLAB HOLDINGS | `12,480.50` (19px mono) | `≈ $3,891.21` + `+4.12%` green pill |
| 3 (1fr) | TOTAL EARNED | `$1,284.06` | "from staking + LP" |
| 4 (1fr) | ACTIVE POSITIONS | `7` | "3 LP · 2 staking · 2 lending" |

Each cell: 18px×22px padding, label uppercase 11px 0.08em letter-spacing muted, value mono with `font-feature-settings: "tnum","zero"` and `letter-spacing: -0.025em`.

### 2. Grid row: Price chart (2fr) + Quick Swap (1fr)

**CLAB / USD price chart card**
- Card header (50px): 26×26 token icon (CLAB purple gradient, "CL" inside) + `CLAB / USD` title + `ChainLab Token` sub. Right side: timeframe segmented control (`1H 24H 7D 30D 1Y ALL`) — 11.5px mono, 2px inner padding, active tab has `--surface` background + 1px ring.
- Below header, large price block: `$<last>` (28px mono) + `USD` (14px muted) + delta pill colored green/red with chevron based on sign.
- Meta sub-line: "Last updated 12 seconds ago · Uniswap v3 · 0x4f2a…cb91" (12px muted).
- Stat row (5 columns, separated by 28px): MARKET CAP `$12.4M`, 24H VOLUME `$842K`, HOLDERS `3,184`, CIRC. SUPPLY `44.2M CLAB`, FDV `$28.0M`.
- Chart body (height 250px):
  - SVG line chart with smoothed cubic-bezier path (bezier control = midpoint between consecutive samples).
  - Area fill: linear gradient `--accent → transparent` top-to-bottom, 25% start opacity.
  - 5 horizontal gridlines, y-axis labels right-aligned in mono with `$0.0000` formatting.
  - 5 x-axis tick labels: `00:00 06:00 12:00 18:00 Now`.
  - Hover crosshair: dashed vertical line (`stroke-dasharray: 3 3`) + 4px circle marker on the path + floating tooltip card showing `CLAB / USD` and the formatted price.

**Quick Swap card**
- Header: title "Quick swap" + 28×28 ghost refresh button + 28×28 settings button.
- Two `swap-row` panels (background `--surface-2`, 1px border, 8px radius, 14px padding):
  - Row head: "You pay" / "You receive" left, "Balance: 2.847" / "Balance: 12,480.50" right (mono).
  - Main row: numeric input (22px mono / 600 / transparent bg / no border) + token chip (pill with token icon, symbol, chev-down).
  - Footer: `≈ $<usd>` left, "Max" link in accent on payer row.
- Between rows: 28×28 flip button with down-arrow, centered, `margin: -10px auto`, sits above both rows via z-index.
- Info block (10px×12px padding, 6px radius, surface-2): Rate, Network fee, Slippage, Min. received — labels muted, values mono.
- CTA: full-width primary button `Swap <FROM> for <TO>` (12px padding, 7px radius, 14px / 600).

Conversion logic in the prototype: hardcoded `1 ETH = 11,842.5 CLAB`. Inputs accept digits + decimal only; flip swaps `fromTok` and `toTok`.

### 3. Grid row: Holdings · Recent activity · Liquidity pools (3 equal columns)

**Holdings card**
- Header: "Your holdings" + "5 assets" sublabel + "Filter" ghost button.
- Rows: 4-column grid `28px 1fr auto auto`, 10px×18px padding, 1px bottom border:
  - Token icon (28×28 circle, `ti-<symbol>` background — see Design Tokens for the per-token gradients).
  - Token name: symbol (13px / 600) above full name (11.5px / muted).
  - Sparkline: 56×22 SVG, smoothed path, no fill, 1.5px stroke. Color = `--positive` if change ≥ 0, else `--negative`. CLAB uses accent regardless.
  - Amount: `$<usd value>` mono right-aligned, with `<amount> <symbol>` (11px muted) below.

Data:
| Symbol | Name | Amount | USD | Δ |
|---|---|---|---|---|
| CLAB | ChainLab | 12,480.50 | $3,891.21 | +4.12% |
| ETH | Ethereum | 2.847 | $9,366.63 | +1.84% |
| USDC | USD Coin | 18,420.00 | $18,420.00 | +0.01% |
| WBTC | Wrapped BTC | 0.214 | $14,318.94 | +2.07% |
| DAI | Dai | 2,395.39 | $2,395.39 | +0.02% |

**Recent activity card**
- Header: "Recent activity" + ghost "View all" button with arrow-up-right.
- Rows: same 4-column grid. Left icon is a 28×28 rounded-square (7px radius) with `--surface-2` background; inner icon color depends on kind — `in` = positive green, `out` = negative red, `swap` = accent.
- Meta column: title (13px / 500) over `<from> · <time>` (11.5px mono muted).
- Amount column: signed amount in green/red (mono / 500) above USD value (11px muted).
- Status pill (10.5px / 600 / uppercase / 0.04em letter-spacing): `Confirmed` (positive-soft bg + positive text) or `Pending` (warm amber background `rgba(255,180,60,0.12)` + `#e0a23b` text).

Seed data: `Received CLAB +250.00`, `Swap ETH→CLAB +1,184.25 CLAB`, `Sent USDC −500.00`, `Staking reward +12.81 CLAB`, `Swap CLAB→WBTC +0.014 WBTC` (pending).

**Liquidity pools card**
- Header: "Liquidity pools" + "Add" ghost button (plus icon).
- Rows: 14px×18px padding, 1px bottom border.
  - Pair header: 2 stacked token icons (24×24 each, second overlaps first by 8px with 2px outline in `--surface`), `<A> / <B>` (13.5px / 600), fee pill (10.5px mono, surface-2 bg).
  - 3-column stat grid: APR (green mono), TVL (mono), My position (mono). Each stat is label (11.5px muted) over value (13px / 600).

Data: `CLAB/ETH 0.30% · APR 32.4% · TVL $1.84M · Mine $2,140` · `CLAB/USDC 0.30% · 21.8% · $842K · $1,420` · `ETH/USDC 0.05% · 8.9% · $18.2M · $0`.

### Placeholder for non-dashboard pages

A centered card (64px padding) with a 56×56 rounded-square `--accent-soft` icon tile + `Spark` icon, H2 "<Page> coming soon" (18px / 600 / -0.02em), 2-line muted copy. Use the same placeholder for Wallet / Swap / Pool / NFT / History / Analytics / Settings until each gets its own design.

---

## Interactions & behavior

- **Sidebar collapse**: chevron in expanded header collapses; in collapsed state the logo itself acts as the expand affordance (title="Expand sidebar").
- **Theme toggle**: writes `data-theme="dark"|"light"` on `<html>`; all colors are CSS variables so swap is instantaneous (+ 180ms transition on `body` background/color).
- **Chart timeframe tabs**: switching tabs regenerates the series with deterministic per-tf seed/vol/drift parameters (replace with real on-chain or API data).
- **Chart hover**: pointer-move on the SVG element snaps a crosshair + circle to the nearest sample and shows a floating tooltip clamped within the chart bounds.
- **Swap flip**: swaps `fromTok ↔ toTok` state, recalculating displayed amounts immediately.
- **Swap amount input**: filters to `^[0-9.]*$`, parsed with `parseFloat`; output side is read-only.
- **Hover states**: every interactive element has a `--surface-hover` background flip + optional `--border-strong` outline. Transition `120ms ease` for color/bg, `220ms cubic-bezier(.2,.7,.2,1)` for grid-column animation.
- **Responsive breakpoints**:
  - ≤ 1200px: main `grid` collapses 2→1 column; `grid-3` collapses 3→2.
  - ≤ 880px: hero strip collapses 4→2 cells with horizontal borders; `grid-3` becomes single column; topbar search hides.

---

## State management

For a real implementation:

```ts
type TokenSym = 'CLAB' | 'ETH' | 'USDC' | 'WBTC' | 'DAI' | 'USDT';

interface AppState {
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
  activePage: 'dashboard' | 'wallet' | 'swap' | 'pool' | 'nft' | 'history' | 'analytics' | 'settings';
  wallet: { address: `0x${string}`; ensName?: string; balances: Record<TokenSym, bigint> };
  chart: { timeframe: '1H' | '24H' | '7D' | '30D' | '1Y' | 'ALL'; data: PricePoint[] };
  swap: { fromTok: TokenSym; toTok: TokenSym; fromAmt: string };
  txns: Transaction[];
  pools: Pool[];
}
```

Suggested data sources:
- Balances → `viem.readContract({ ...erc20, functionName: 'balanceOf', args: [address] })`.
- Price history → Coingecko REST / Dexscreener / your own subgraph; prefer subgraph for CLAB.
- Transactions → `viem` `getLogs` filtered to the user address with the ERC-20 `Transfer` event topic; merge with swap router events.
- Pools → on-chain reads against Uniswap v3 PositionManager + pool contracts for TVL/APR.

---

## Design tokens

All tokens live in `reference/styles.css` under `:root` and `[data-theme="light"]`. Source-of-truth values:

### Geometry
- Card radius: **8px** (tweakable 2–20px)
- Control radius: **6px** · Pill: `999px`
- Sidebar width: **240px** expanded · **68px** collapsed (collapsed width is fixed; expanded is tweakable 200–300px)
- Topbar height: **60px**
- Outer gutter: **16px**
- Page content padding: `24px 28px 64px`

### Color — accent (shared across themes)
- `--accent`: `#7c5cff`
- `--accent-hover`: `#8a6dff`
- `--accent-soft`: `rgba(124, 92, 255, 0.12)`
- `--accent-soft-strong`: `rgba(124, 92, 255, 0.22)`
- `--positive`: `#2fb47c` · `--positive-soft`: `rgba(47, 180, 124, 0.12)`
- `--negative`: `#e35d6a` · `--negative-soft`: `rgba(227, 93, 106, 0.12)`
- Warm-amber (pending status): bg `rgba(255,180,60,0.12)`, fg `#e0a23b`

### Color — dark theme (default)
- `--bg`: `#0a0b0e`
- `--bg-elev`: `#0e0f13`
- `--surface`: `#13141a`
- `--surface-2`: `#181a21`
- `--surface-hover`: `#1c1e26`
- `--border`: `#22242c`
- `--border-strong`: `#2c2e38`
- `--text`: `#e8e9ee`
- `--text-dim`: `#a8aab3`
- `--muted`: `#7e818c`
- `--chart-grid`: `rgba(255, 255, 255, 0.05)`
- Card shadow: `0 1px 0 rgba(255,255,255,0.02) inset, 0 1px 2px rgba(0,0,0,0.4)`

### Color — light theme
- `--bg`: `#f7f7f8`
- `--bg-elev`: `#f0f0f2`
- `--surface`: `#ffffff`
- `--surface-2`: `#fafafb`
- `--surface-hover`: `#f3f3f5`
- `--border`: `#ececef`
- `--border-strong`: `#dcdce0`
- `--text`: `#0a0b0e`
- `--text-dim`: `#4a4c54`
- `--muted`: `#797b85`
- `--chart-grid`: `rgba(0,0,0,0.05)`
- Card shadow: `0 1px 2px rgba(20, 22, 30, 0.04), 0 0 0 1px rgba(20,22,30,0.02)`

### Token brand colors (token-icon gradients)
- `ti-clab`: `linear-gradient(135deg, #7c5cff 0%, #5a3fe0 100%)`
- `ti-eth`: `linear-gradient(135deg, #6b7fff 0%, #3b4ed1 100%)`
- `ti-usdc`: solid `#2775ca`
- `ti-usdt`: solid `#26a17b`
- `ti-wbtc`: solid `#f7931a`
- `ti-dai`: solid `#f5ac37`

### Typography
- UI sans: **Geist** (400/500/600/700) — Google Fonts
- Numeric & mono: **JetBrains Mono** (400/500/600) — apply `font-feature-settings: "tnum","zero"` for tabular numerals and `letter-spacing: -0.01em` everywhere numbers are displayed (prices, addresses, balances, sparkline labels).
- Body base: 14px / 1.45.
- Optional Geist OpenType features: `"cv11", "ss01", "ss03"`.

### Easing & timing
- Color/background: `transition: ... 120ms ease`
- Grid (sidebar): `220ms cubic-bezier(.2, .7, .2, 1)`
- Theme swap on `body`: `180ms ease`

---

## Iconography

All icons are hand-rolled inline-SVG (24×24 viewBox, 1.75 stroke, round caps/joins) modeled after Lucide. Reference list in `reference/icons.jsx`. If your codebase already uses Lucide, swap directly: Dashboard→`LayoutDashboard`, Wallet→`Wallet`, Swap→`ArrowLeftRight`, Pool→`Droplet`, Nft→`Image`, History→`History`, Analytics→`LineChart`, Settings→`Settings`, Sun, Moon, Bell, Plus, ArrowUpRight, ArrowDownLeft, Send (paper-plane), Refresh, External (external-link), Filter, Search, ChevLeft, ChevDown, ChevUp.

---

## Files in `reference/`

- `CLAB DApp.html` — entry; loads React via UMD + Babel and the JSX files.
- `styles.css` — every design token + every component class. The most authoritative file for spacing/colors/typography.
- `app.jsx` — root `App` component, top-level state, tweak wiring.
- `components.jsx` — `Sidebar`, `Topbar`, `HeroStrip`, `ClabPriceCard`, `SwapCard`, `HoldingsCard`, `TransactionsCard`, `PoolsCard`, `PlaceholderPage`. Plus seed data arrays (`HOLDINGS`, `TXNS`, `POOLS`).
- `chart.jsx` — `makeSeries` (deterministic series generator), `Sparkline`, `PriceChart` (with hover crosshair).
- `icons.jsx` — all stroke icons.
- `tweaks-panel.jsx` — auxiliary live-editing panel; safe to **omit** from the real codebase.

To run the reference locally: just open `CLAB DApp.html` in a browser, or `python3 -m http.server` from the `reference/` folder.

---

## Notes for the implementer

1. **Mocked data only** — every number, address, balance, tx and pool in the prototype is fabricated. Wire the components to wagmi/viem reads + a subgraph for live data.
2. **Wallet-connect flow is not designed yet** — the topbar pill assumes a connected state. A disconnected state + connect modal needs design before implementation; for now use whichever connect UI ships with your kit (RainbowKit/ConnectKit/Web3Modal) and theme it to match.
3. **CLAB contract**: the user is still building the ERC-20. Add an `abi/clab.json` to the codebase once deployed and a `contracts/addresses.ts` mapping per-chain.
4. **Other pages are stubs** — implement Dashboard first; Wallet, Swap, Liquidity, NFTs, Transactions, Analytics, Settings can use the placeholder treatment until their own designs land.
5. **Tweaks panel** is a design-time tool — do not port it.
6. **Accessibility**: ensure all icon-only buttons keep their `title` / `aria-label`; the sidebar's collapsed-state expand affordance (logo-as-button) needs `role="button"` and keyboard handling if you keep that pattern.
