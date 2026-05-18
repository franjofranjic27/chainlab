import { Icon } from "../icons";
import type { PageId, Theme } from "../types";

const TITLES: Record<PageId, string> = {
  dashboard: "Dashboard",
  wallet: "Wallet",
  swap: "Swap",
  pool: "Liquidity",
  nft: "NFTs",
  history: "Transactions",
  analytics: "Analytics",
  settings: "Settings",
};

interface TopbarProps {
  theme: Theme;
  onToggleTheme: () => void;
  active: PageId;
}

export function Topbar({ theme, onToggleTheme, active }: TopbarProps) {
  return (
    <header className="topbar">
      <div className="crumbs">
        <span>ChainLab</span>
        <span className="sep">/</span>
        <b>{TITLES[active]}</b>
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
