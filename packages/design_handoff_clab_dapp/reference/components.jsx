/* global React, Icon, PriceChart, Sparkline, makeSeries */
const { useState, useMemo, useCallback } = React;

/* ============================== SIDEBAR ============================== */
function Sidebar({ collapsed, onToggle, active, setActive }) {
  const groups = [
    {
      label: "Main",
      items: [
        { id: "dashboard", label: "Dashboard", icon: Icon.Dashboard },
        { id: "wallet", label: "Wallet", icon: Icon.Wallet },
        { id: "swap", label: "Swap", icon: Icon.Swap, badge: "v3" },
        { id: "pool", label: "Liquidity", icon: Icon.Pool },
      ],
    },
    {
      label: "Assets",
      items: [
        { id: "nft", label: "NFTs", icon: Icon.Nft, badge: "12" },
        { id: "history", label: "Transactions", icon: Icon.History },
        { id: "analytics", label: "Analytics", icon: Icon.Analytics },
      ],
    },
    {
      label: "Account",
      items: [
        { id: "settings", label: "Settings", icon: Icon.Settings },
      ],
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sb-head">
        <div className="sb-logo" onClick={collapsed ? onToggle : undefined} title={collapsed ? "Expand sidebar" : undefined}>CL</div>
        <div className="sb-brand">
          ChainLab
          <small>CLAB Protocol</small>
        </div>
        <button className="sb-collapse" onClick={onToggle} title="Collapse sidebar" aria-label="Collapse sidebar">
          <Icon.ChevLeft size={14} />
        </button>
      </div>

      <nav className="sb-nav">
        {groups.map((g, gi) => (
          <React.Fragment key={gi}>
            <div className="sb-section-label">{g.label}</div>
            {g.items.map((it) => {
              const Ico = it.icon;
              return (
                <button
                  key={it.id}
                  className="sb-item"
                  data-active={active === it.id}
                  onClick={() => setActive(it.id)}
                  title={collapsed ? it.label : undefined}
                >
                  <Ico />
                  <span className="sb-label">{it.label}</span>
                  {it.badge && <span className="sb-badge">{it.badge}</span>}
                </button>
              );
            })}
          </React.Fragment>
        ))}
      </nav>

      <div className="sb-foot">
        <div className="sb-avatar" />
        <div className="sb-foot-meta">
          <b>vitalik.lab</b>
          <span>0x4f2a…9b1c</span>
        </div>
      </div>
    </aside>
  );
}

/* ============================== TOPBAR ============================== */
function Topbar({ theme, onToggleTheme, active }) {
  const titles = {
    dashboard: "Dashboard",
    wallet: "Wallet",
    swap: "Swap",
    pool: "Liquidity",
    nft: "NFTs",
    history: "Transactions",
    analytics: "Analytics",
    settings: "Settings",
  };

  return (
    <header className="topbar">
      <div className="crumbs">
        <span>ChainLab</span>
        <span className="sep">/</span>
        <b>{titles[active] || "Dashboard"}</b>
      </div>

      <label className="topbar-search">
        <Icon.Search size={14} />
        <input placeholder="Search tokens, addresses, or transactions…" />
        <kbd>⌘K</kbd>
      </label>

      <div className="topbar-right">
        <button className="network-pill" title="Connected network">
          <span className="net-dot" />
          Ethereum
          <Icon.ChevDown className="chev" />
        </button>

        <button className="icon-btn" title="Toggle theme" onClick={onToggleTheme}>
          {theme === "dark" ? <Icon.Sun /> : <Icon.Moon />}
        </button>

        <button className="icon-btn" title="Notifications">
          <Icon.Bell />
          <span className="dot" />
        </button>

        <button className="wallet-pill" title="Connected wallet">
          <span className="wp-avatar" />
          <span className="wp-text">
            <b>0x4f2a…9b1c</b>
            <span>2.847 ETH</span>
          </span>
        </button>
      </div>
    </header>
  );
}

/* ============================== HERO STRIP ============================== */
function HeroStrip() {
  return (
    <div className="card hero">
      <div className="hero-cell" style={{ gridRow: "span 1" }}>
        <span className="lbl">Portfolio value</span>
        <span className="val">$48,392.17</span>
        <div className="meta">
          <span className="delta pos">
            <Icon.ChevUp size={10} />
            +2.41% · $1,138.22
          </span>
          <span>last 24h</span>
        </div>
        <div className="hero-actions">
          <button className="btn btn-primary"><Icon.Send size={13} /> Send</button>
          <button className="btn"><Icon.ArrowDownLeft size={13} /> Receive</button>
          <button className="btn"><Icon.Swap size={13} /> Swap</button>
        </div>
      </div>

      <div className="hero-cell">
        <span className="lbl">CLAB holdings</span>
        <span className="val sm">12,480.50</span>
        <div className="meta">
          <span className="mono">≈ $3,891.21</span>
          <span className="delta pos"><Icon.ChevUp size={10} />4.12%</span>
        </div>
      </div>

      <div className="hero-cell">
        <span className="lbl">Total earned</span>
        <span className="val sm">$1,284.06</span>
        <div className="meta">
          <span>from staking + LP</span>
        </div>
      </div>

      <div className="hero-cell">
        <span className="lbl">Active positions</span>
        <span className="val sm">7</span>
        <div className="meta">
          <span>3 LP · 2 staking · 2 lending</span>
        </div>
      </div>
    </div>
  );
}

/* ============================== CLAB PRICE CARD ============================== */
const TFS = ["1H", "24H", "7D", "30D", "1Y", "ALL"];
const TF_SEEDS = { "1H": 11, "24H": 47, "7D": 22, "30D": 91, "1Y": 5, "ALL": 33 };
const TF_VOL = { "1H": 0.012, "24H": 0.022, "7D": 0.04, "30D": 0.06, "1Y": 0.09, "ALL": 0.12 };
const TF_DRIFT = { "1H": 0.0002, "24H": 0.0008, "7D": 0.0012, "30D": 0.0014, "1Y": 0.001, "ALL": 0.0006 };
const TF_COUNT = { "1H": 60, "24H": 96, "7D": 84, "30D": 90, "1Y": 120, "ALL": 160 };

function ClabPriceCard() {
  const [tf, setTf] = useState("7D");
  const data = useMemo(
    () => makeSeries(TF_COUNT[tf], TF_SEEDS[tf], 0.28, TF_VOL[tf], TF_DRIFT[tf]),
    [tf]
  );
  const first = data[0];
  const last = data[data.length - 1];
  const change = ((last - first) / first) * 100;
  const isPos = change >= 0;

  return (
    <div className="card chart-card">
      <div className="card-head">
        <div className="token-icon ti-clab" style={{ width: 26, height: 26, fontSize: 11 }}>CL</div>
        <h3>CLAB / USD</h3>
        <span className="sub">ChainLab Token</span>
        <div className="right">
          <div className="chart-tabs">
            {TFS.map((k) => (
              <button key={k} className="chart-tab" data-active={tf === k} onClick={() => setTf(k)}>
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-head-row">
        <div>
          <div className="chart-price">
            <span className="mono">${last.toFixed(4)}</span>
            <small>USD</small>
            <span className={`delta ${isPos ? "pos" : "neg"}`}>
              {isPos ? <Icon.ChevUp size={10} /> : <Icon.ChevDown size={10} />}
              {isPos ? "+" : ""}{change.toFixed(2)}%
            </span>
          </div>
          <div className="chart-meta">Last updated 12 seconds ago · Uniswap v3 · 0x4f2a…cb91</div>
        </div>
      </div>

      <div className="chart-stat-row">
        <div className="chart-stat"><div className="lbl">Market cap</div><div className="val">$12.4M</div></div>
        <div className="chart-stat"><div className="lbl">24h volume</div><div className="val">$842K</div></div>
        <div className="chart-stat"><div className="lbl">Holders</div><div className="val">3,184</div></div>
        <div className="chart-stat"><div className="lbl">Circ. supply</div><div className="val">44.2M CLAB</div></div>
        <div className="chart-stat"><div className="lbl">FDV</div><div className="val">$28.0M</div></div>
      </div>

      <PriceChart data={data} color="var(--accent)" height={250} />
    </div>
  );
}

/* ============================== SWAP CARD ============================== */
function SwapCard() {
  const [fromAmt, setFromAmt] = useState("1.0");
  const [fromTok, setFromTok] = useState("ETH");
  const [toTok, setToTok] = useState("CLAB");

  const rate = 11842.5; // 1 ETH = 11842.5 CLAB
  const flip = () => {
    setFromTok(toTok);
    setToTok(fromTok);
  };

  const fromAmtN = parseFloat(fromAmt) || 0;
  const toAmt = fromTok === "ETH" ? fromAmtN * rate : fromAmtN / rate;

  return (
    <div className="card">
      <div className="card-head">
        <h3>Quick swap</h3>
        <div className="right">
          <button className="icon-btn" title="Refresh rate" style={{ width: 28, height: 28 }}>
            <Icon.Refresh size={13} />
          </button>
          <button className="icon-btn" title="Settings" style={{ width: 28, height: 28 }}>
            <Icon.Settings size={13} />
          </button>
        </div>
      </div>
      <div className="swap-card">
        <div className="swap-row">
          <div className="swap-row-head">
            <span>You pay</span>
            <span>Balance: <b className="mono" style={{ color: "var(--text)" }}>2.847</b></span>
          </div>
          <div className="swap-row-main">
            <input
              className="swap-amount"
              value={fromAmt}
              onChange={(e) => setFromAmt(e.target.value.replace(/[^\d.]/g, ""))}
              placeholder="0.0"
              inputMode="decimal"
            />
            <button className="token-select">
              <span className={`token-icon ti-${fromTok.toLowerCase()}`}>{fromTok.slice(0, 1)}</span>
              {fromTok}
              <Icon.ChevDown size={12} />
            </button>
          </div>
          <div className="swap-row-head" style={{ marginTop: 0 }}>
            <span>≈ ${(fromTok === "ETH" ? fromAmtN * 3290 : fromAmtN * 0.278).toFixed(2)}</span>
            <span style={{ color: "var(--accent)", fontWeight: 600, cursor: "pointer" }}>Max</span>
          </div>
        </div>

        <button className="swap-flip" onClick={flip} title="Flip">
          <Icon.ArrowDown />
        </button>

        <div className="swap-row">
          <div className="swap-row-head">
            <span>You receive</span>
            <span>Balance: <b className="mono" style={{ color: "var(--text)" }}>12,480.50</b></span>
          </div>
          <div className="swap-row-main">
            <input className="swap-amount" value={toAmt.toLocaleString(undefined, { maximumFractionDigits: 4 })} readOnly />
            <button className="token-select">
              <span className={`token-icon ti-${toTok.toLowerCase()}`}>{toTok.slice(0, 1)}</span>
              {toTok}
              <Icon.ChevDown size={12} />
            </button>
          </div>
          <div className="swap-row-head" style={{ marginTop: 0 }}>
            <span>≈ ${(toTok === "CLAB" ? toAmt * 0.278 : toAmt * 3290).toFixed(2)}</span>
          </div>
        </div>

        <div className="swap-info">
          <div className="swap-info-row"><span>Rate</span><b>1 {fromTok} = {fromTok === "ETH" ? "11,842.5" : "0.0000844"} {toTok}</b></div>
          <div className="swap-info-row"><span>Network fee</span><b>~ $2.14</b></div>
          <div className="swap-info-row"><span>Slippage</span><b>0.50%</b></div>
          <div className="swap-info-row"><span>Min. received</span><b className="mono">{(toAmt * 0.995).toLocaleString(undefined, { maximumFractionDigits: 2 })} {toTok}</b></div>
        </div>

        <button className="swap-cta">Swap {fromTok} for {toTok}</button>
      </div>
    </div>
  );
}

/* ============================== HOLDINGS ============================== */
const HOLDINGS = [
  { sym: "CLAB", name: "ChainLab", amount: "12,480.50", value: "3,891.21", spark: { seed: 12, vol: 0.04, drift: 0.002, color: "var(--accent)" }, change: "+4.12%" },
  { sym: "ETH", name: "Ethereum", amount: "2.847", value: "9,366.63", spark: { seed: 8, vol: 0.025, drift: 0.001 }, change: "+1.84%" },
  { sym: "USDC", name: "USD Coin", amount: "18,420.00", value: "18,420.00", spark: { seed: 3, vol: 0.001, drift: 0 }, change: "+0.01%" },
  { sym: "WBTC", name: "Wrapped BTC", amount: "0.214", value: "14,318.94", spark: { seed: 41, vol: 0.03, drift: 0.0015 }, change: "+2.07%" },
  { sym: "DAI", name: "Dai", amount: "2,395.39", value: "2,395.39", spark: { seed: 7, vol: 0.002, drift: 0 }, change: "+0.02%" },
];

function HoldingsCard() {
  return (
    <div className="card">
      <div className="card-head">
        <h3>Your holdings</h3>
        <span className="sub">5 assets</span>
        <div className="right">
          <button className="btn" style={{ padding: "5px 10px", fontSize: 12 }}>
            <Icon.Filter size={12} /> Filter
          </button>
        </div>
      </div>
      <div>
        {HOLDINGS.map((h) => {
          const series = makeSeries(28, h.spark.seed, 1, h.spark.vol, h.spark.drift);
          const isPos = !h.change.startsWith("-");
          return (
            <div className="holding-row" key={h.sym}>
              <span className={`token-icon ti-${h.sym.toLowerCase()}`}>{h.sym.slice(0, 1)}</span>
              <div className="h-name">
                <b>{h.sym}</b>
                <span>{h.name}</span>
              </div>
              <Sparkline points={series} color={h.spark.color || (isPos ? "var(--positive)" : "var(--negative)")} />
              <div className="h-amount">
                ${h.value}
                <small>{h.amount} {h.sym}</small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================== TRANSACTIONS ============================== */
const TXNS = [
  { kind: "in", title: "Received CLAB", from: "0x8a31…2b4d", amount: "+ 250.00 CLAB", value: "$69.50", status: "ok", time: "2m ago" },
  { kind: "swap", title: "Swap ETH → CLAB", from: "Uniswap v3", amount: "+ 1,184.25 CLAB", value: "$329.42", status: "ok", time: "14m ago" },
  { kind: "out", title: "Sent USDC", from: "0xb9f1…7a02", amount: "− 500.00 USDC", value: "$500.00", status: "ok", time: "1h ago" },
  { kind: "in", title: "Staking reward", from: "CLAB Vault", amount: "+ 12.81 CLAB", value: "$3.56", status: "ok", time: "3h ago" },
  { kind: "swap", title: "Swap CLAB → WBTC", from: "Uniswap v3", amount: "+ 0.014 WBTC", value: "$937.18", status: "pend", time: "5h ago" },
];

function TransactionsCard() {
  return (
    <div className="card">
      <div className="card-head">
        <h3>Recent activity</h3>
        <div className="right">
          <button className="btn" style={{ padding: "5px 10px", fontSize: 12 }}>
            View all <Icon.ArrowUpRight size={12} />
          </button>
        </div>
      </div>
      <div>
        {TXNS.map((t, i) => (
          <div className="tx-row" key={i}>
            <span className={`tx-icon ${t.kind}`}>
              {t.kind === "in" && <Icon.ArrowDownLeft />}
              {t.kind === "out" && <Icon.ArrowUpRight />}
              {t.kind === "swap" && <Icon.Swap />}
            </span>
            <div className="t-meta">
              <b>{t.title}</b>
              <span>{t.from} · {t.time}</span>
            </div>
            <div className="t-amount">
              <b style={{ color: t.kind === "out" ? "var(--negative)" : "var(--positive)" }}>{t.amount}</b>
              <span>{t.value}</span>
            </div>
            <span className={`t-status ${t.status === "ok" ? "ok" : "pend"}`}>
              {t.status === "ok" ? "Confirmed" : "Pending"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== POOLS ============================== */
const POOLS = [
  { a: "CLAB", b: "ETH", fee: "0.30%", apr: "32.4%", tvl: "$1.84M", mine: "$2,140" },
  { a: "CLAB", b: "USDC", fee: "0.30%", apr: "21.8%", tvl: "$842K", mine: "$1,420" },
  { a: "ETH", b: "USDC", fee: "0.05%", apr: "8.9%", tvl: "$18.2M", mine: "$0" },
];

function PoolsCard() {
  return (
    <div className="card">
      <div className="card-head">
        <h3>Liquidity pools</h3>
        <div className="right">
          <button className="btn" style={{ padding: "5px 10px", fontSize: 12 }}>
            <Icon.Plus size={12} /> Add
          </button>
        </div>
      </div>
      <div>
        {POOLS.map((p, i) => (
          <div className="pool-row" key={i}>
            <div className="pool-pair">
              <div className="pair-icons">
                <span className={`token-icon ti-${p.a.toLowerCase()}`}>{p.a.slice(0, 1)}</span>
                <span className={`token-icon ti-${p.b.toLowerCase()}`}>{p.b.slice(0, 1)}</span>
              </div>
              <b>{p.a} / {p.b}</b>
              <span className="pool-fee">{p.fee}</span>
            </div>
            <div className="pool-stats">
              <div className="pool-stat">APR<b style={{ color: "var(--positive)" }}>{p.apr}</b></div>
              <div className="pool-stat">TVL<b>{p.tvl}</b></div>
              <div className="pool-stat">My position<b>{p.mine}</b></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== Placeholder pages ============================== */
function PlaceholderPage({ name }) {
  return (
    <div className="card" style={{ padding: 64, textAlign: "center" }}>
      <div style={{
        width: 56, height: 56, margin: "0 auto 16px",
        borderRadius: 12, background: "var(--accent-soft)",
        display: "grid", placeItems: "center", color: "var(--accent)"
      }}>
        <Icon.Spark size={28} />
      </div>
      <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>{name} coming soon</h2>
      <p style={{ margin: 0, color: "var(--muted)", fontSize: 13.5 }}>
        This module is part of the roadmap — staking, governance and NFT minting<br />
        will plug in here once the contracts are deployed to mainnet.
      </p>
    </div>
  );
}

Object.assign(window, {
  Sidebar, Topbar, HeroStrip, ClabPriceCard, SwapCard,
  HoldingsCard, TransactionsCard, PoolsCard, PlaceholderPage,
});
