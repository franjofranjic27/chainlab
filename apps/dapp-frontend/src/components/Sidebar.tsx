import { Fragment } from "react";
import type { KeyboardEvent } from "react";
import { Icon } from "../icons";
import type { IconComponent } from "../icons";
import type { PageId } from "../types";

interface NavItem {
  id: PageId;
  label: string;
  icon: IconComponent;
  badge?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
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
    items: [{ id: "settings", label: "Settings", icon: Icon.Settings }],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  active: PageId;
  setActive: (id: PageId) => void;
}

export function Sidebar({ collapsed, onToggle, active, setActive }: SidebarProps) {
  // When collapsed, the logo itself becomes the expand affordance.
  const onLogoKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (collapsed && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <aside className="sidebar">
      <div className="sb-head">
        <div
          className="sb-logo"
          onClick={collapsed ? onToggle : undefined}
          onKeyDown={onLogoKeyDown}
          title={collapsed ? "Expand sidebar" : undefined}
          role={collapsed ? "button" : undefined}
          tabIndex={collapsed ? 0 : undefined}
          aria-label={collapsed ? "Expand sidebar" : undefined}
        >
          CL
        </div>
        <div className="sb-brand">
          ChainLab
          <small>CLAB Protocol</small>
        </div>
        <button
          className="sb-collapse"
          onClick={onToggle}
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          <Icon.ChevLeft size={14} />
        </button>
      </div>

      <nav className="sb-nav">
        {GROUPS.map((g) => (
          <Fragment key={g.label}>
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
          </Fragment>
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
