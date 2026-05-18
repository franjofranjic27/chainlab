/**
 * Seed data for the dashboard cards.
 *
 * NOTE: every value here is mocked (per the design handoff). Wire these to
 * wagmi/viem reads of the deployed CLAB contract + a price source later:
 *  - balances  → erc20 `balanceOf`
 *  - activity  → `Transfer` event logs
 *  - pools     → Uniswap v3 position manager reads
 */

export interface Holding {
  sym: string;
  name: string;
  amount: string;
  value: string;
  spark: { seed: number; vol: number; drift: number; color?: string };
  change: string;
}

export const HOLDINGS: Holding[] = [
  {
    sym: "CLAB",
    name: "ChainLab",
    amount: "12,480.50",
    value: "3,891.21",
    spark: { seed: 12, vol: 0.04, drift: 0.002, color: "var(--accent)" },
    change: "+4.12%",
  },
  {
    sym: "ETH",
    name: "Ethereum",
    amount: "2.847",
    value: "9,366.63",
    spark: { seed: 8, vol: 0.025, drift: 0.001 },
    change: "+1.84%",
  },
  {
    sym: "USDC",
    name: "USD Coin",
    amount: "18,420.00",
    value: "18,420.00",
    spark: { seed: 3, vol: 0.001, drift: 0 },
    change: "+0.01%",
  },
  {
    sym: "WBTC",
    name: "Wrapped BTC",
    amount: "0.214",
    value: "14,318.94",
    spark: { seed: 41, vol: 0.03, drift: 0.0015 },
    change: "+2.07%",
  },
  {
    sym: "DAI",
    name: "Dai",
    amount: "2,395.39",
    value: "2,395.39",
    spark: { seed: 7, vol: 0.002, drift: 0 },
    change: "+0.02%",
  },
];

export type TxnKind = "in" | "out" | "swap";
export type TxnStatus = "ok" | "pend";

export interface Txn {
  kind: TxnKind;
  title: string;
  from: string;
  amount: string;
  value: string;
  status: TxnStatus;
  time: string;
}

export const TXNS: Txn[] = [
  {
    kind: "in",
    title: "Received CLAB",
    from: "0x8a31…2b4d",
    amount: "+ 250.00 CLAB",
    value: "$69.50",
    status: "ok",
    time: "2m ago",
  },
  {
    kind: "swap",
    title: "Swap ETH → CLAB",
    from: "Uniswap v3",
    amount: "+ 1,184.25 CLAB",
    value: "$329.42",
    status: "ok",
    time: "14m ago",
  },
  {
    kind: "out",
    title: "Sent USDC",
    from: "0xb9f1…7a02",
    amount: "− 500.00 USDC",
    value: "$500.00",
    status: "ok",
    time: "1h ago",
  },
  {
    kind: "in",
    title: "Staking reward",
    from: "CLAB Vault",
    amount: "+ 12.81 CLAB",
    value: "$3.56",
    status: "ok",
    time: "3h ago",
  },
  {
    kind: "swap",
    title: "Swap CLAB → WBTC",
    from: "Uniswap v3",
    amount: "+ 0.014 WBTC",
    value: "$937.18",
    status: "pend",
    time: "5h ago",
  },
];

export interface Pool {
  a: string;
  b: string;
  fee: string;
  apr: string;
  tvl: string;
  mine: string;
}

export const POOLS: Pool[] = [
  { a: "CLAB", b: "ETH", fee: "0.30%", apr: "32.4%", tvl: "$1.84M", mine: "$2,140" },
  { a: "CLAB", b: "USDC", fee: "0.30%", apr: "21.8%", tvl: "$842K", mine: "$1,420" },
  { a: "ETH", b: "USDC", fee: "0.05%", apr: "8.9%", tvl: "$18.2M", mine: "$0" },
];
