import { Icon } from "../icons";

interface PlaceholderPageProps {
  name: string;
}

/** Centered "coming soon" card — shared by every non-dashboard page. */
export function PlaceholderPage({ name }: PlaceholderPageProps) {
  return (
    <div className="card" style={{ padding: 64, textAlign: "center" }}>
      <div
        style={{
          width: 56,
          height: 56,
          margin: "0 auto 16px",
          borderRadius: 12,
          background: "var(--accent-soft)",
          display: "grid",
          placeItems: "center",
          color: "var(--accent)",
        }}
      >
        <Icon.Spark size={28} />
      </div>
      <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>
        {name} coming soon
      </h2>
      <p style={{ margin: 0, color: "var(--muted)", fontSize: 13.5 }}>
        This module is part of the roadmap — staking, governance and NFT minting
        <br />
        will plug in here once the contracts are deployed to mainnet.
      </p>
    </div>
  );
}
