import { Icon } from "../../icons";
import { HeroStrip } from "./HeroStrip";
import { ClabPriceCard } from "./ClabPriceCard";
import { SwapCard } from "./SwapCard";
import { HoldingsCard } from "./HoldingsCard";
import { TransactionsCard } from "./TransactionsCard";
import { PoolsCard } from "./PoolsCard";

/** The portfolio dashboard — the only fully-designed page in the handoff. */
export function DashboardView() {
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Good evening, vitalik.lab</h1>
          <p>Here's what's happening with your portfolio today.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn">
            <Icon.External size={13} /> View on Etherscan
          </button>
          <button className="btn btn-primary">
            <Icon.Plus size={13} /> New transfer
          </button>
        </div>
      </div>

      <HeroStrip />

      <div className="grid">
        <ClabPriceCard />
        <SwapCard />
      </div>

      <div className="grid-3">
        <HoldingsCard />
        <TransactionsCard />
        <PoolsCard />
      </div>
    </>
  );
}
