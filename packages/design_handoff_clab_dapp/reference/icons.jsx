/* global React */
// Icons — stroke-only, 24x24 viewBox, Lucide-style proportions
const Ic = ({ d, fill, size = 18, strokeWidth = 1.75, children, ...rest }) => (
  <svg
    className="ic"
    viewBox="0 0 24 24"
    fill={fill || "none"}
    stroke={fill ? "none" : "currentColor"}
    strokeWidth={fill ? 0 : strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    {...rest}
  >
    {d ? <path d={d} /> : children}
  </svg>
);

const Icon = {
  Dashboard: (p) => <Ic {...p}><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></Ic>,
  Wallet: (p) => <Ic {...p}><path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/><path d="M21 9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2Z"/><circle cx="16.5" cy="14" r="1.25" fill="currentColor" stroke="none"/></Ic>,
  Swap: (p) => <Ic {...p}><path d="M7 4 4 7l3 3"/><path d="M4 7h13a3 3 0 0 1 3 3"/><path d="m17 20 3-3-3-3"/><path d="M20 17H7a3 3 0 0 1-3-3"/></Ic>,
  Pool: (p) => <Ic {...p}><path d="M12 3c-3 4-6 7-6 11a6 6 0 0 0 12 0c0-4-3-7-6-11Z"/></Ic>,
  Nft: (p) => <Ic {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 16-5-5-9 9"/></Ic>,
  History: (p) => <Ic {...p}><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 7v5l3 2"/></Ic>,
  Analytics: (p) => <Ic {...p}><path d="M3 3v18h18"/><path d="m7 14 3-3 3 3 5-6"/></Ic>,
  Settings: (p) => <Ic {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></Ic>,
  ChevLeft: (p) => <Ic {...p}><path d="m15 18-6-6 6-6"/></Ic>,
  ChevDown: (p) => <Ic {...p}><path d="m6 9 6 6 6-6"/></Ic>,
  ChevUp: (p) => <Ic {...p}><path d="m6 15 6-6 6 6"/></Ic>,
  Search: (p) => <Ic {...p}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></Ic>,
  Bell: (p) => <Ic {...p}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 8 3 9H3c0-1 3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></Ic>,
  Plus: (p) => <Ic {...p}><path d="M12 5v14M5 12h14"/></Ic>,
  ArrowUpRight: (p) => <Ic {...p}><path d="M7 17 17 7M7 7h10v10"/></Ic>,
  ArrowDownLeft: (p) => <Ic {...p}><path d="M17 7 7 17M17 17H7V7"/></Ic>,
  ArrowDown: (p) => <Ic {...p}><path d="M12 5v14M19 12l-7 7-7-7"/></Ic>,
  Send: (p) => <Ic {...p}><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7Z"/></Ic>,
  Refresh: (p) => <Ic {...p}><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M3 21v-5h5"/></Ic>,
  Copy: (p) => <Ic {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></Ic>,
  Sun: (p) => <Ic {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></Ic>,
  Moon: (p) => <Ic {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z"/></Ic>,
  External: (p) => <Ic {...p}><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></Ic>,
  Filter: (p) => <Ic {...p}><path d="M3 5h18l-7 9v6l-4-2v-4Z"/></Ic>,
  More: (p) => <Ic {...p}><circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/></Ic>,
  Spark: (p) => <Ic {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></Ic>,
  Help: (p) => <Ic {...p}><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2.5 2-2.5 3.5"/><circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none"/></Ic>,
};

window.Icon = Icon;
